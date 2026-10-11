// Capture / 3 · Speak — listening, and Capture / 4 · Speak — review.
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useBooksStore } from '../../src/store/books';
import { Button, Chip, CloseButton, SheetHeader, FieldLabel, ui } from '../../src/components/ui';
import { closeCapture, pickBook, splitSpokenPage, formatTime, type CaptureKind, type CaptureParams } from '../../src/capture';
import { Palette, FontFamily, Type } from '../../src/theme';

const BARS = 24;
const silence = () => Array.from({ length: BARS }, () => 0);

export default function SpeakScreen() {
  const params = useLocalSearchParams() as CaptureParams;
  const router = useRouter();
  const book = pickBook(useBooksStore((s) => s.books), params.bookId);

  const [listening, setListening] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [heard, setHeard] = useState('');
  const [pending, setPending] = useState('');
  const [error, setError] = useState<string>();
  const [secs, setSecs] = useState(0);
  const [levels, setLevels] = useState(silence);
  const [audioUri, setAudioUri] = useState<string>();
  const [text, setText] = useState('');
  const [page, setPage] = useState<string>();
  const [kind, setKind] = useState<CaptureKind>(params.kind === 'note' ? 'note' : 'quote');

  const said = useRef({ heard, pending });
  said.current = { heard, pending };

  const next = { bookId: book?.id };

  async function start() {
    setHeard(''); setPending(''); setError(undefined); setSecs(0); setLevels(silence()); setAudioUri(undefined);
    setReviewing(false);
    const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) {
      setError('ReadLog needs the microphone and speech recognition. You can allow them in Settings.');
      return;
    }
    ExpoSpeechRecognitionModule.start({
      lang: 'en-US',
      interimResults: true,
      continuous: true,
      addsPunctuation: true,
      iosTaskHint: 'dictation',
      recordingOptions: { persist: true },
      volumeChangeEventOptions: { enabled: true, intervalMillis: 100 },
    });
  }

  function stop() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    ExpoSpeechRecognitionModule.stop();
  }

  useEffect(() => {
    start();
    return () => ExpoSpeechRecognitionModule.abort();
  }, []);

  useEffect(() => {
    if (!listening) return;
    const timer = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [listening]);

  useSpeechRecognitionEvent('start', () => setListening(true));
  useSpeechRecognitionEvent('result', (e) => {
    const said = e.results[0]?.transcript ?? '';
    if (e.isFinal) {
      setHeard((h) => [h, said].filter(Boolean).join(' '));
      setPending('');
    } else {
      setPending(said);
    }
  });
  useSpeechRecognitionEvent('volumechange', (e) => {
    const level = Math.max(0, Math.min(1, (e.value + 2) / 12));
    setLevels((l) => [...l.slice(1), level]);
  });
  useSpeechRecognitionEvent('audioend', (e) => setAudioUri(e.uri ?? undefined));
  useSpeechRecognitionEvent('error', (e) => {
    if (e.error !== 'aborted' && e.error !== 'no-speech') setError(e.message);
  });
  useSpeechRecognitionEvent('end', () => {
    // Anything still pending when recognition stops counts as heard.
    const all = [said.current.heard, said.current.pending].filter(Boolean).join(' ');
    const found = splitSpokenPage(all);
    setListening(false);
    setHeard(all);
    setPending('');
    setText(found.text);
    setPage(found.page);
    setReviewing(true);
  });

  if (!reviewing) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.topRow}>
          <CloseButton onPress={closeCapture} />
          <Text style={ui.meta}>
            {book?.title}{book && book.currentPage > 0 ? ` · page ${book.currentPage}` : ''}
          </Text>
        </View>
        <View style={styles.status}>
          <View style={styles.dot} />
          <Text style={styles.statusText}>{listening ? 'Listening…' : 'Getting ready…'}</Text>
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
          {error ? (
            <Text style={ui.meta}>{error}</Text>
          ) : (
            <Text style={styles.transcript}>
              {heard || pending ? heard : <Text style={styles.pending}>Start reading aloud…</Text>}
              {pending ? <Text style={styles.pending}>{heard ? ' ' : ''}{pending}</Text> : null}
            </Text>
          )}
        </ScrollView>
        <View style={styles.wave}>
          {levels.map((l, i) => <View key={i} style={[styles.bar, { height: 6 + l * 42 }]} />)}
        </View>
        <Text style={[ui.meta, styles.center]}>{formatTime(secs)}</Text>
        <StopButton onPress={stop} active={listening} />
        <View style={styles.switchRow}>
          <Button variant="tertiary" label="Snap instead"
            onPress={() => router.replace({ pathname: '/capture/snap', params: { ...next, kind } })} />
          <Button variant="tertiary" label="Type instead"
            onPress={() => router.replace({ pathname: '/capture/save', params: { ...next, kind, text: heard, source: 'typed' } })} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={{ gap: 16 }} keyboardShouldPersistTaps="handled">
        <SheetHeader
          title={page ? `Page ${page} heard` : 'Here’s what you said'}
          subtitle={book ? `${book.title} · ${book.author}` : undefined}
          onClose={closeCapture}
        />
        {audioUri && <PlayBack uri={audioUri} />}
        <View>
          <FieldLabel>Transcript — edit freely</FieldLabel>
          <TextInput style={[ui.field, styles.edit]} value={text} onChangeText={setText} multiline
            placeholder="Nothing was heard — try recording again" placeholderTextColor={Palette.secondaryText} />
        </View>
        <View>
          <FieldLabel>Keep as</FieldLabel>
          <View style={styles.chips}>
            <Chip label="Quote" selected={kind === 'quote'} onPress={() => setKind('quote')} />
            <Chip label="Note" selected={kind === 'note'} onPress={() => setKind('note')} />
          </View>
        </View>
      </ScrollView>
      <View style={styles.actions}>
        <Button variant="secondary" label="Record again" style={{ flex: 1 }} onPress={start} />
        <Button label="Keep text" style={{ flex: 1 }} disabled={!text.trim()}
          onPress={() => router.push({ pathname: '/capture/save', params: { ...next, kind, text, page, source: 'spoken' } })} />
      </View>
    </SafeAreaView>
  );
}

function StopButton({ onPress, active }: { onPress: () => void; active: boolean }) {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!active) return;
    const loop = Animated.loop(Animated.timing(pulse, {
      toValue: 1, duration: 1400, easing: Easing.out(Easing.quad), useNativeDriver: true,
    }));
    loop.start();
    return () => loop.stop();
  }, [active]);
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.15] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });
  return (
    <View style={styles.stopWrap}>
      <Animated.View style={[styles.ring, { transform: [{ scale }], opacity }]} />
      <Pressable onPress={onPress} disabled={!active} accessibilityLabel="Stop recording"
        style={({ pressed }) => [styles.stop, pressed && { opacity: 0.85 }]}>
        <View style={styles.stopSquare} />
      </Pressable>
    </View>
  );
}

function PlayBack({ uri }: { uri: string }) {
  const player = useAudioPlayer({ uri });
  const status = useAudioPlayerStatus(player);
  const progress = status.duration ? status.currentTime / status.duration : 0;

  async function toggle() {
    if (status.playing) return player.pause();
    await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false });
    if (status.didJustFinish || progress >= 0.99) player.seekTo(0);
    player.play();
  }

  return (
    <View style={styles.play}>
      <Pressable onPress={toggle} style={styles.playButton} accessibilityLabel={status.playing ? 'Pause' : 'Play back'}>
        <MaterialCommunityIcons name={status.playing ? 'pause' : 'play'} size={20} color={Palette.buttonText} />
      </Pressable>
      <View style={styles.miniWave}>
        {MINI.map((h, i) => (
          <View key={i} style={[styles.miniBar, { height: h },
            i / MINI.length < progress && { backgroundColor: Palette.primary }]} />
        ))}
      </View>
      <Text style={ui.meta}>{formatTime(Math.round(status.duration || 0))}</Text>
    </View>
  );
}

const MINI = [6, 10, 16, 12, 20, 14, 8, 18, 22, 12, 8, 14, 10, 6, 12, 16, 8, 6];

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.background, padding: 16, gap: 16 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 24 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Palette.secondary },
  statusText: { fontFamily: FontFamily.sansSemiBold, fontSize: 14, color: Palette.secondary },
  transcript: { ...Type.transcript, color: Palette.mainText },
  pending: { color: Palette.secondaryText, opacity: 0.6 },
  wave: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, height: 52 },
  bar: { width: 4, borderRadius: 2, backgroundColor: Palette.primary },
  center: { textAlign: 'center' },
  stopWrap: { alignSelf: 'center', width: 116, height: 116, alignItems: 'center', justifyContent: 'center' },
  ring: { ...StyleSheet.absoluteFill, borderRadius: 58, backgroundColor: Palette.secondary },
  stop: { width: 88, height: 88, borderRadius: 44, backgroundColor: Palette.primary, alignItems: 'center', justifyContent: 'center' },
  stopSquare: { width: 26, height: 26, borderRadius: 5, backgroundColor: Palette.buttonText },
  switchRow: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  edit: { ...Type.bodyLarge, color: Palette.mainText, minHeight: 140, textAlignVertical: 'top' },
  chips: { flexDirection: 'row', gap: 8 },
  play: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Palette.buttonText,
    borderRadius: 999, paddingVertical: 10, paddingLeft: 12, paddingRight: 16,
  },
  playButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: Palette.primary, alignItems: 'center', justifyContent: 'center' },
  miniWave: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 3 },
  miniBar: { width: 3, borderRadius: 2, backgroundColor: Palette.subtleOutline },
  actions: { flexDirection: 'row', gap: 12 },
});

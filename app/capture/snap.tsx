// Capture / 1 · Snap — aim, and Capture / 2 · Snap — review.
import React, { useRef, useState } from 'react';
import {
  View, Text, Image, Pressable, TextInput, ScrollView, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { extractTextFromImage } from 'expo-text-extractor';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useBooksStore } from '../../src/store/books';
import { Button, Chip, CloseButton, SheetHeader, ui, type IconName } from '../../src/components/ui';
import { closeCapture, pickBook, splitPageNumber, joinLines, looksMisread, countWord, type CaptureParams } from '../../src/capture';
import { Palette, Type } from '../../src/theme';

type Step = 'aim' | 'reading' | 'review';

export default function SnapScreen() {
  const params = useLocalSearchParams() as CaptureParams;
  const router = useRouter();
  const book = pickBook(useBooksStore((s) => s.books), params.bookId);
  const [permission, requestPermission] = useCameraPermissions();
  const camera = useRef<CameraView>(null);

  const [step, setStep] = useState<Step>('aim');
  const [photo, setPhoto] = useState<string>();
  const [lines, setLines] = useState<string[]>([]);
  const [included, setIncluded] = useState<boolean[]>([]);
  const [text, setText] = useState('');
  const [page, setPage] = useState<string>();
  const [editing, setEditing] = useState(false);
  const [adjusting, setAdjusting] = useState(false);

  const next = { bookId: book?.id, kind: params.kind };

  async function shoot() {
    if (!camera.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep('reading');
    try {
      const picture = await camera.current.takePictureAsync({ quality: 0.85 });
      const found = splitPageNumber(await extractTextFromImage(picture.uri));
      setPhoto(picture.uri);
      setLines(found.lines);
      setIncluded(found.lines.map(() => true));
      setText(joinLines(found.lines));
      setPage(found.page);
    } catch {
      setLines([]);
      setText('');
    }
    setEditing(false);
    setAdjusting(false);
    setStep('review');
  }

  function toggleLine(i: number) {
    const nextIncluded = included.map((on, j) => (j === i ? !on : on));
    setIncluded(nextIncluded);
    setText(joinLines(lines.filter((_, j) => nextIncluded[j])));
  }

  if (step !== 'review') {
    return (
      <View style={styles.camera}>
        {permission?.granted ? (
          <CameraView ref={camera} style={StyleSheet.absoluteFill} facing="back" />
        ) : (
          <View style={styles.permission}>
            <Text style={styles.onDark}>ReadLog needs the camera to read the page.</Text>
            <Button label="Allow camera" onPress={requestPermission} style={{ marginTop: 16 }} />
          </View>
        )}
        <SafeAreaView style={styles.overlay} pointerEvents="box-none">
          <View style={styles.topBar}>
            <CloseButton onPress={closeCapture} />
            <View style={styles.pill}><Text style={styles.pillText}>Page auto-detect · On</Text></View>
          </View>
          <View style={styles.guide} pointerEvents="none" />
          <View style={{ gap: 24 }}>
            <Text style={styles.onDark}>
              {step === 'reading' ? 'Reading the page…' : 'Hold the frame over the passage'}
            </Text>
            <View style={styles.controls}>
              <SideButton icon="microphone-outline" label="Speak"
                onPress={() => router.replace({ pathname: '/capture/speak', params: next })} />
              <Pressable onPress={shoot} disabled={step === 'reading' || !permission?.granted}
                accessibilityLabel="Capture page" style={({ pressed }) => [styles.shutter, pressed && { opacity: 0.8 }]}>
                {step === 'reading'
                  ? <ActivityIndicator color={Palette.buttonText} />
                  : <View style={styles.shutterInner} />}
              </Pressable>
              <SideButton icon="format-text" label="Type"
                onPress={() => router.replace({ pathname: '/capture/save', params: { ...next, source: 'typed' } })} />
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const misread = text.split(/\s+/).filter(looksMisread).length;

  return (
    <SafeAreaView style={styles.review}>
      <ScrollView contentContainerStyle={styles.reviewContent} keyboardShouldPersistTaps="handled">
        <SheetHeader title="Read from the page" subtitle={book ? `${book.title} · ${book.author}` : undefined} onClose={closeCapture} />
        <View style={styles.row}>
          <Chip label={page ? `Page ${page} detected` : 'No page number found'} />
          {lines.length > 1 && (
            <Button variant="tertiary" label={adjusting ? 'Done' : 'Adjust selection'} onPress={() => setAdjusting((a) => !a)} />
          )}
        </View>
        {photo && <Image source={{ uri: photo }} style={styles.scan} />}

        {adjusting ? (
          <View style={ui.field}>
            {lines.map((line, i) => (
              <Pressable key={i} onPress={() => toggleLine(i)} style={styles.line}>
                <MaterialCommunityIcons name={included[i] ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={20} color={included[i] ? Palette.primary : Palette.secondaryText} />
                <Text style={[ui.body, { flex: 1 }, !included[i] && { color: Palette.secondaryText }]}>{line}</Text>
              </Pressable>
            ))}
          </View>
        ) : lines.length === 0 ? (
          <Text style={ui.meta}>Couldn’t find any text. Try again with more light, holding the phone flat over the page.</Text>
        ) : (
          <>
            <Text style={ui.meta}>Recognised text — edit anything that came out wrong</Text>
            {editing ? (
              <TextInput style={[ui.field, styles.text]} value={text} onChangeText={setText} multiline autoFocus />
            ) : (
              <Pressable style={ui.field} onPress={() => setEditing(true)}>
                <Text style={styles.text}>
                  {text.split(/(\s+)/).map((part, i) => (
                    <Text key={i} style={looksMisread(part) ? styles.misread : undefined}>{part}</Text>
                  ))}
                </Text>
              </Pressable>
            )}
            {misread > 0 && !editing && (
              <View style={styles.row}>
                <View style={styles.dot} />
                <Text style={ui.meta}>
                  {countWord(misread)} {misread === 1 ? 'word looks' : 'words look'} misread — tap to fix
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
      <View style={styles.actions}>
        <Button variant="secondary" label="Retake" style={{ flex: 1 }} onPress={() => setStep('aim')} />
        <Button label="Keep text" style={{ flex: 1 }} disabled={!text.trim()}
          onPress={() => router.push({ pathname: '/capture/save', params: { ...next, text, page, source: 'snapped' } })} />
      </View>
    </SafeAreaView>
  );
}

function SideButton({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.side} hitSlop={12}>
      <MaterialCommunityIcons name={icon} size={24} color={Palette.buttonText} />
      <Text style={styles.sideLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  camera: { flex: 1, backgroundColor: Palette.camera },
  permission: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', padding: 32 },
  overlay: { flex: 1, justifyContent: 'space-between' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8 },
  pill: { backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  pillText: { ...Type.meta, color: Palette.buttonText },
  guide: {
    alignSelf: 'center', width: '84%', height: 140, borderRadius: 12,
    borderWidth: 2, borderColor: Palette.secondary, backgroundColor: 'rgba(212,100,92,0.10)',
  },
  onDark: { ...Type.body, color: Palette.buttonText, textAlign: 'center' },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 40, paddingBottom: 24 },
  side: { width: 56, alignItems: 'center', gap: 4 },
  sideLabel: { ...Type.labelSmall, color: Palette.buttonText },
  shutter: {
    width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: Palette.buttonText,
    alignItems: 'center', justifyContent: 'center',
  },
  shutterInner: { width: 62, height: 62, borderRadius: 31, backgroundColor: Palette.buttonText },

  review: { flex: 1, backgroundColor: Palette.background },
  reviewContent: { padding: 16, gap: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scan: { height: 96, borderRadius: 12, backgroundColor: Palette.camera },
  text: { ...Type.bodyLarge, color: Palette.mainText },
  misread: { color: Palette.highlightOutline, textDecorationLine: 'underline' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Palette.secondary },
  line: { flexDirection: 'row', gap: 10, paddingVertical: 6, alignItems: 'flex-start' },
  actions: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8 },
});

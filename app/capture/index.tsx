// Capture / 0 · Choose how — form sheet opened from the + button.
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useBooksStore } from '../../src/store/books';
import { SheetHeader, type IconName } from '../../src/components/ui';
import { pickBook, type CaptureParams } from '../../src/capture';
import { Palette, Type } from '../../src/theme';

const OPTIONS: { path: '/capture/snap' | '/capture/speak' | '/capture/save'; icon: IconName; title: string; hint: string }[] = [
  { path: '/capture/snap', icon: 'camera-outline', title: 'Snap the page', hint: 'Fastest for long passages' },
  { path: '/capture/speak', icon: 'microphone-outline', title: 'Say it out loud', hint: 'Hands stay on the book' },
  { path: '/capture/save', icon: 'format-text', title: 'Type it', hint: 'For a thought of your own' },
];

export default function ChooseCaptureScreen() {
  const params = useLocalSearchParams() as CaptureParams;
  const router = useRouter();
  const books = useBooksStore((s) => s.books);
  const [chosenId, setBookId] = useState<string>();
  const [picking, setPicking] = useState(false);
  const book = pickBook(books, chosenId ?? params.bookId);
  const bookId = book?.id;
  const kind = params.kind === 'note' ? 'note' : 'quote';

  function choose(path: (typeof OPTIONS)[number]['path']) {
    Haptics.selectionAsync();
    const source = path === '/capture/save' ? 'typed' : undefined;
    router.push({ pathname: path, params: { bookId, kind, ...(source && { source }) } } as Href);
  }

  return (
    <View style={styles.sheet}>
      <SheetHeader
        title={kind === 'note' ? 'Add a note' : 'Add a quote'}
        subtitle={book ? `to ${book.title} · change` : 'Pick a book'}
        onSubtitlePress={() => setPicking((p) => !p)}
        onClose={() => router.back()}
      />

      {picking ? (
        books.map((b) => (
          <Pressable key={b.id} style={({ pressed }) => [styles.row, b.id === bookId && styles.rowOn, pressed && styles.pressed]}
            onPress={() => { setBookId(b.id); setPicking(false); }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{b.title}</Text>
              <Text style={styles.rowHint}>{b.author}</Text>
            </View>
            {b.id === bookId && <MaterialCommunityIcons name="check" size={22} color={Palette.primary} />}
          </Pressable>
        ))
      ) : (
        OPTIONS.map((o, i) => (
          <Pressable key={o.path} onPress={() => choose(o.path)}
            style={({ pressed }) => [styles.row, i === 0 && styles.rowOn, pressed && styles.pressed]}>
            <View style={styles.icon}>
              <MaterialCommunityIcons name={o.icon} size={24} color={Palette.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{o.title}</Text>
              <Text style={styles.rowHint}>{o.hint}</Text>
            </View>
          </Pressable>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // fitToContents sheets size to this view, so no flex: 1 here.
  sheet: { backgroundColor: Palette.sheet, paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40, gap: 16 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16,
    backgroundColor: Palette.buttonText, borderRadius: 20, borderWidth: 1, borderColor: 'transparent',
  },
  rowOn: { borderColor: Palette.highlightOutline },
  pressed: { opacity: 0.7 },
  icon: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: Palette.background,
    alignItems: 'center', justifyContent: 'center',
  },
  rowTitle: { ...Type.bodyStrong, color: Palette.mainText },
  rowHint: { ...Type.meta, color: Palette.secondaryText, marginTop: 2 },
});

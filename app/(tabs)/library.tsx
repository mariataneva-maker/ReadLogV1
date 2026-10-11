// Library — Figma frame "Library" (26:1707): status chips and a cover grid.
import React, { useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useBooksStore, type ReadStatus } from '../../src/store/books';
import { Chip } from '../../src/components/ui';
import { FABMenu } from '../../src/components';
import { Palette, FontFamily } from '../../src/theme';

const FILTERS: { status: ReadStatus; label: string }[] = [
  { status: 'reading', label: 'Reading' },
  { status: 'completed', label: 'Finished' },
  { status: 'not_started', label: 'Want to read' },
];

const GAP = 12;
const PADDING = 16;

export default function LibraryScreen() {
  const router = useRouter();
  const books = useBooksStore((s) => s.books);
  const [status, setStatus] = useState<ReadStatus>('reading');
  const { width } = useWindowDimensions();
  const coverWidth = (width - PADDING * 2 - GAP * 2) / 3;
  const shown = books.filter((b) => b.status === status);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Library</Text>
        <View style={styles.chips}>
          {FILTERS.map((f) => (
            <Chip key={f.status} label={f.label} selected={status === f.status} onPress={() => setStatus(f.status)} />
          ))}
        </View>
        <View style={styles.grid}>
          {shown.map((book) => (
            <Pressable key={book.id} style={{ width: coverWidth }} onPress={() => router.push(`/book/${book.id}`)}>
              {book.coverUrl
                ? <Image source={{ uri: book.coverUrl }} style={[styles.cover, { height: coverWidth * 1.5 }]} />
                : <View style={[styles.cover, { height: coverWidth * 1.5 }]} />}
              <Text style={styles.bookTitle} numberOfLines={1}>{book.title}</Text>
              <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
            </Pressable>
          ))}
        </View>
        {shown.length === 0 && <Text style={styles.empty}>Nothing here yet.</Text>}
      </ScrollView>
      <FABMenu actions={[
        { label: 'Add book', icon: 'book-outline', onPress: () => router.push('/search') },
        { label: 'Add quote', icon: 'format-quote-close', onPress: () => router.push('/capture') },
        { label: 'Add note', icon: 'note-edit-outline', onPress: () => router.push({ pathname: '/capture', params: { kind: 'note' } }) },
      ]} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.background },
  content: { padding: PADDING, paddingBottom: 160, gap: 24 },
  title: { fontFamily: FontFamily.sansSemiBold, fontSize: 36, color: Palette.mainText, marginTop: 8 },
  chips: { flexDirection: 'row', gap: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP, rowGap: 20 },
  cover: { width: '100%', borderRadius: 4, backgroundColor: Palette.subtleOutline },
  bookTitle: { fontFamily: FontFamily.sans, fontSize: 14, color: Palette.mainText, marginTop: 8 },
  author: { fontFamily: FontFamily.sans, fontSize: 12, color: Palette.secondaryText, marginTop: 2 },
  empty: { fontFamily: FontFamily.sans, fontSize: 14, color: Palette.secondaryText },
});

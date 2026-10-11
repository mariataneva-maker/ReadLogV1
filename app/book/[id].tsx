// Book detail — Figma frames "Book detail" (22:517), "Book detail not reading" (26:587)
// and "Book quotes" (26:697).
import React, { useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBooksStore, type Book } from '../../src/store/books';
import { Button, type IconName } from '../../src/components/ui';
import { Entry } from '../../src/components/Entry';
import { Palette, Type, Effects, GenreColours } from '../../src/theme';

type Section = 'overview' | 'quotes' | 'notes';

const SECTIONS: { key: Section; label: string; icon: IconName }[] = [
  { key: 'overview', label: 'Overview', icon: 'card-text-outline' },
  { key: 'quotes', label: 'Quotes', icon: 'format-quote-close' },
  { key: 'notes', label: 'Notes', icon: 'note-edit-outline' },
];

// Genre chips get a steady colour per genre from Figma colour/genre/1–6.
function genreColour(genre: string) {
  let h = 0;
  for (const c of genre) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return GenreColours[h % GenreColours.length];
}


export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { books, quotes, notes, setStatus } = useBooksStore();
  const [section, setSection] = useState<Section>('overview');

  const book = books.find((b) => b.id === id);
  if (!book) return null;

  const bookQuotes = quotes.filter((q) => q.bookId === id);
  const bookNotes = notes.filter((n) => n.bookId === id);
  const onShelf = book.status !== 'not_started';
  const progress = book.totalPages ? Math.min(1, book.currentPage / book.totalPages) : 0;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} hitSlop={8} accessibilityLabel="Back" style={styles.back}>
          <MaterialCommunityIcons name="arrow-left" size={28} color={Palette.mainText} />
        </Pressable>

        <View style={styles.hero}>
          {book.coverUrl ? <Image source={{ uri: book.coverUrl }} style={styles.cover} /> : <View style={styles.cover} />}
          <View>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>{book.author}</Text>
          </View>
          <View style={styles.meta}>
            {book.genre ? (
              <View style={[styles.genre, { backgroundColor: genreColour(book.genre) }]}>
                <Text style={styles.genreLabel}>{book.genre}</Text>
              </View>
            ) : null}
            <Stars rating={book.rating} />
          </View>
        </View>

        {onShelf && (
          <View style={styles.progress}>
            <View style={styles.progressRow}>
              <Text style={styles.body}>Progress</Text>
              <Text style={styles.muted}>
                Page {book.currentPage} of {book.totalPages} • {Math.round(progress * 100)}%
              </Text>
            </View>
            <View style={styles.track}><View style={[styles.fill, { width: `${progress * 100}%` }]} /></View>
          </View>
        )}

        <View style={styles.actions}>
          {onShelf ? (
            <>
              <Button label="Update progress" style={{ flex: 1 }}
                onPress={() => router.push({ pathname: '/log-progress', params: { bookId: book.id } })} />
              <Pressable accessibilityLabel={`Add a quote or note to ${book.title}`} style={styles.add}
                onPress={() => router.push({ pathname: '/capture', params: { bookId: book.id } })}>
                <MaterialCommunityIcons name="plus" size={28} color={Palette.buttonText} />
              </Pressable>
            </>
          ) : (
            <Button label="Add to shelf" style={{ flex: 1 }} onPress={() => setStatus(book.id, 'reading')} />
          )}
        </View>

        <View style={styles.segments}>
          {SECTIONS.map((s) => (
            <Pressable key={s.key} onPress={() => setSection(s.key)} accessibilityState={{ selected: section === s.key }}
              style={[styles.segment, section === s.key && styles.segmentOn]}>
              <MaterialCommunityIcons name={s.icon} size={20} color={Palette.mainText} />
              <Text style={styles.segmentLabel}>{s.label}</Text>
            </Pressable>
          ))}
        </View>

        {section === 'overview' && <Overview book={book} />}
        {section === 'quotes' && (
          bookQuotes.length
            ? bookQuotes.map((q) => <Entry key={q.id} entry={q} />)
            : <Text style={styles.muted}>No quotes yet. Tap + to add one.</Text>
        )}
        {section === 'notes' && (
          bookNotes.length
            ? bookNotes.map((n) => <Entry key={n.id} entry={n} />)
            : <Text style={styles.muted}>No notes yet. Tap + to add one.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <View style={styles.stars} accessibilityLabel={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <MaterialCommunityIcons key={i} size={22} color={Palette.mainText}
          name={rating >= i ? 'star' : rating >= i - 0.5 ? 'star-half-full' : 'star-outline'} />
      ))}
    </View>
  );
}

function Overview({ book }: { book: Book }) {
  const facts = [
    ['Pages', book.totalPages ? String(book.totalPages) : '—'],
    ['Chapters', book.totalChapters ? String(book.totalChapters) : '—'],
  ];
  return (
    <View style={styles.facts}>
      {facts.map(([label, value]) => (
        <View key={label} style={{ flex: 1 }}>
          <Text style={styles.factLabel}>{label}</Text>
          <Text style={styles.body}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.background },
  content: { paddingHorizontal: 16, paddingBottom: 140, gap: 24 },
  back: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 8, marginLeft: -8 },
  hero: { alignItems: 'center', gap: 16, marginTop: -16 },
  cover: {
    width: 135, height: 206, backgroundColor: Palette.subtleOutline,
    ...Effects.coverLarge,
  },
  title: { ...Type.titleBook, color: Palette.mainText, textAlign: 'center' },
  author: { ...Type.body, color: Palette.mainText, textAlign: 'center' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 40 },
  genre: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  genreLabel: { ...Type.meta, color: Palette.buttonText },
  stars: { flexDirection: 'row' },
  progress: { gap: 8 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  track: { height: 4, borderRadius: 2, backgroundColor: Palette.subtleOutline, overflow: 'hidden' },
  fill: { height: 4, borderRadius: 2, backgroundColor: Palette.highlightOutline },
  actions: { flexDirection: 'row', gap: 12 },
  add: { width: 56, height: 50, borderRadius: 999, backgroundColor: Palette.primary, alignItems: 'center', justifyContent: 'center' },
  segments: {
    flexDirection: 'row', padding: 4, gap: 4, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.65)', borderWidth: 1, borderColor: '#F7F7F7',
  },
  segment: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 32, borderRadius: 999 },
  segmentOn: { backgroundColor: Palette.segmentSelected },
  segmentLabel: { ...Type.labelSmall, color: Palette.mainText },
  body: { ...Type.body, color: Palette.mainText },
  muted: { ...Type.body, color: Palette.mutedText },
  facts: { flexDirection: 'row', gap: 16 },
  factLabel: { ...Type.bodyStrong, color: Palette.mainText },
});

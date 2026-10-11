// Home — Figma frame "Home" (18:944).
import React, { useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBooksStore, type ReadStatus } from '../../src/store/books';
import { Chip } from '../../src/components/ui';
import { BookCard, FABMenu } from '../../src/components';
import { Palette, Type, Effects } from '../../src/theme';

const FILTERS: { status: ReadStatus; label: string }[] = [
  { status: 'reading', label: 'Reading' },
  { status: 'completed', label: 'Finished' },
  { status: 'not_started', label: 'Want to read' },
];

export default function HomeScreen() {
  const router = useRouter();
  const books = useBooksStore((s) => s.books);
  const [status, setStatus] = useState<ReadStatus>('reading');
  const reading = books.filter((b) => b.status === 'reading');
  const shown = books.filter((b) => b.status === status);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Home</Text>
          {/* Profile isn't built yet; the button is here to match the design. */}
          <View style={styles.profile} accessibilityLabel="Profile">
            <MaterialCommunityIcons name="account-outline" size={28} color={Palette.buttonText} />
          </View>
        </View>

        {reading.length > 0 && (
          <View style={styles.today}>
            <Text style={styles.question}>What did you read today?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              style={styles.carousel} contentContainerStyle={styles.carouselContent}>
              {reading.map((book) => (
                <Pressable key={book.id} accessibilityLabel={`Add a quote from ${book.title}`}
                  onPress={() => router.push({ pathname: '/capture', params: { bookId: book.id } })}
                  style={({ pressed }) => [styles.readingCard, pressed && { opacity: 0.8 }]}>
                  {book.coverUrl
                    ? <Image source={{ uri: book.coverUrl }} style={styles.readingCover} />
                    : <View style={styles.readingCover} />}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.chips}>
          {FILTERS.map((f) => (
            <Chip key={f.status} label={f.label} selected={status === f.status} onPress={() => setStatus(f.status)} />
          ))}
        </View>

        <View style={styles.list}>
          {shown.map((book) => (
            <BookCard key={book.id} book={book} onPress={() => router.push(`/book/${book.id}`)} />
          ))}
          {shown.length === 0 && <Text style={styles.empty}>Nothing here yet.</Text>}
        </View>
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
  content: { paddingTop: 8, paddingBottom: 180, gap: 32 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  title: { ...Type.titleScreen, color: Palette.mainText },
  profile: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: Palette.secondary,
    alignItems: 'center', justifyContent: 'center',
  },
  today: { gap: 16 },
  question: { ...Type.headingSection, color: Palette.mainText, paddingHorizontal: 16 },
  // Extra vertical room so the covers' shadows aren't clipped by the scroll view.
  carousel: { marginVertical: -16 },
  carouselContent: { gap: 12, paddingHorizontal: 16, paddingVertical: 16 },
  // The shadow sits on the wrapper because a rounded image clips its own shadow.
  readingCard: {
    ...Effects.cover,
  },
  readingCover: { width: 108, height: 162, borderRadius: 4, backgroundColor: Palette.subtleOutline },
  chips: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: -8 },
  list: { gap: 16, paddingHorizontal: 16 },
  empty: { ...Type.meta, color: Palette.secondaryText },
});

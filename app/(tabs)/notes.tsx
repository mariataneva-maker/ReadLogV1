// Notes — every saved note, newest first, filterable by book.
import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useBooksStore } from '../../src/store/books';
import { Chip } from '../../src/components/ui';
import { Entry, listScreenStyles as styles } from '../../src/components/Entry';
import { FAB } from '../../src/components';

export default function NotesScreen() {
  const router = useRouter();
  const { notes, books } = useBooksStore();
  const [bookId, setBookId] = useState<string>();
  const bookById = Object.fromEntries(books.map((b) => [b.id, b]));

  const newest = useMemo(() => [...notes].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [notes]);
  const notedBooks = useMemo(
    () => [...new Set(newest.map((n) => n.bookId))].map((id) => bookById[id]).filter(Boolean),
    [newest, books],
  );
  const shown = bookId ? newest.filter((n) => n.bookId === bookId) : newest;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Notes</Text>
        {notedBooks.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            style={styles.chipScroll} contentContainerStyle={styles.chips}>
            <Chip label="All" selected={!bookId} onPress={() => setBookId(undefined)} />
            {notedBooks.map((b) => <Chip key={b.id} label={b.title} selected={bookId === b.id} onPress={() => setBookId(b.id)} />)}
          </ScrollView>
        )}
        {shown.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No notes yet</Text>
            <Text style={styles.emptyText}>Tap + while you read to capture a thought.</Text>
          </View>
        ) : (
          shown.map((n) => (
            <Entry key={n.id} entry={n} book={bookById[n.bookId]} onPress={() => router.push(`/book/${n.bookId}`)} />
          ))
        )}
      </ScrollView>
      <FAB onPress={() => router.push({ pathname: '/capture', params: { kind: 'note' } })} />
    </SafeAreaView>
  );
}

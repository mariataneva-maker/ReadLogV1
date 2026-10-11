// Quotes — every saved quote, newest first, filterable by tag.
import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useBooksStore } from '../../src/store/books';
import { Chip } from '../../src/components/ui';
import { Entry, splitTags, listScreenStyles } from '../../src/components/Entry';
import { FAB } from '../../src/components';

export default function QuotesScreen() {
  const router = useRouter();
  const { quotes, books } = useBooksStore();
  const [tag, setTag] = useState<string>();
  const bookById = Object.fromEntries(books.map((b) => [b.id, b]));

  const newest = useMemo(() => [...quotes].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [quotes]);
  const tags = useMemo(() => [...new Set(newest.flatMap((q) => splitTags(q.tag)))], [newest]);
  const shown = tag ? newest.filter((q) => splitTags(q.tag).includes(tag)) : newest;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Quotes</Text>
        {tags.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            style={styles.chipScroll} contentContainerStyle={styles.chips}>
            <Chip label="All" selected={!tag} onPress={() => setTag(undefined)} />
            {tags.map((t) => <Chip key={t} label={t} selected={tag === t} onPress={() => setTag(t)} />)}
          </ScrollView>
        )}
        {shown.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No quotes yet</Text>
            <Text style={styles.emptyText}>Tap + while you read to snap, say or type one.</Text>
          </View>
        ) : (
          shown.map((q) => (
            <Entry key={q.id} entry={q} book={bookById[q.bookId]} onPress={() => router.push(`/book/${q.bookId}`)} />
          ))
        )}
      </ScrollView>
      <FAB onPress={() => router.push('/capture')} />
    </SafeAreaView>
  );
}

const styles = listScreenStyles;

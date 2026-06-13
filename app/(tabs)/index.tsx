import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useBooksStore, Book } from '../../src/store/books';
import { BookCover, Pill, ProgressBar, FAB } from '../../src/components';
import { Colors, Typography, FontFamily, Shadow, Radius } from '../../src/theme';

type FilterStatus = 'not_started' | 'reading' | 'completed';

export default function LibraryScreen() {
  const { books } = useBooksStore();
  const [filter, setFilter] = useState<FilterStatus>('reading');
  const router = useRouter();

  const filtered = books.filter((b) => b.status === filter);
  const reading = books.filter((b) => b.status === 'reading');
  const featured = reading[0];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Library</Text>
          <TouchableOpacity style={styles.addBtn} activeOpacity={0.7}>
            <Text style={styles.addBtnText}>+ Add book</Text>
          </TouchableOpacity>
        </View>

        {/* Filter pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.pillsRow}
          contentContainerStyle={styles.pillsContent}
        >
          {(['not_started', 'reading', 'completed'] as FilterStatus[]).map((s) => (
            <Pill
              key={s}
              label={s === 'not_started' ? 'Not started' : s === 'reading' ? 'Reading' : 'Completed'}
              active={filter === s}
              onPress={() => setFilter(s)}
              style={{ marginRight: 8 }}
            />
          ))}
        </ScrollView>

        {/* Currently reading carousel */}
        {filter === 'reading' && reading.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, Typography.meta]}>Currently reading</Text>
            <BookStack books={reading} />
            {featured && (
              <View style={styles.featuredInfo}>
                <Text style={styles.featuredTitle}>{featured.title}</Text>
                <Text style={[Typography.body, { color: Colors.grey, marginTop: 6 }]}>
                  {featured.author}
                </Text>
                <ProgressBar
                  progress={featured.currentPage / featured.totalPages}
                  height={3}
                  style={{ marginTop: 14, width: 180, alignSelf: 'center' }}
                />
                <Text style={[Typography.meta, { marginTop: 10 }]}>
                  Page {featured.currentPage} of {featured.totalPages} ·{' '}
                  {Math.round((featured.currentPage / featured.totalPages) * 100)}%
                </Text>
              </View>
            )}
            <DotIndicator count={reading.length} active={0} />
          </>
        )}

        {/* Book list */}
        <View style={styles.list}>
          <Text style={[Typography.meta, styles.listLabel]}>
            {filter === 'reading' ? 'All reading' : filter === 'completed' ? 'Completed' : 'Not started'} · {filtered.length}
          </Text>
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      <FAB onPress={() => router.push('/capture')} />
    </SafeAreaView>
  );
}

function BookStack({ books }: { books: Book[] }) {
  const [b1, b2, b3] = books;
  return (
    <View style={styles.stack}>
      {b3 && (
        <Image
          source={{ uri: b3.coverUrl ?? undefined }}
          style={[styles.stackCover, styles.stackBack]}
        />
      )}
      {b2 && (
        <Image
          source={{ uri: b2.coverUrl ?? undefined }}
          style={[styles.stackCover, styles.stackMid]}
        />
      )}
      {b1 && (
        <Image
          source={{ uri: b1.coverUrl ?? undefined }}
          style={[styles.stackCover, styles.stackFront]}
        />
      )}
    </View>
  );
}

function DotIndicator({ count, active }: { count: number; active: number }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[styles.dot, i === active && styles.dotActive]} />
      ))}
    </View>
  );
}

function BookCard({ book }: { book: Book }) {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.75} onPress={() => router.push(`/book/${book.id}`)}>
      <BookCover uri={book.coverUrl} size="sm" />
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={[Typography.meta, { marginTop: 5 }]}>{book.author}</Text>
        <ProgressBar
          progress={book.currentPage / book.totalPages}
          height={3}
          style={{ marginTop: 10 }}
        />
        <Text style={[Typography.meta, { marginTop: 7, color: Colors.faint }]}>
          Page {book.currentPage} of {book.totalPages}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.paper },
  scroll: { flex: 1 },
  content: { paddingTop: 4 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 4,
  },
  title: {
    ...Typography.display,
    fontSize: 30,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.line,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  addBtnText: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: 14,
    color: Colors.pine,
  },

  pillsRow: { marginTop: 20 },
  pillsContent: { paddingHorizontal: 24 },

  sectionLabel: {
    paddingHorizontal: 24,
    marginTop: 28,
  },

  // stacked covers
  stack: {
    height: 248,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  stackCover: {
    position: 'absolute',
    width: 158,
    height: 236,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    ...Shadow.cover,
  },
  stackFront: { transform: [{ translateX: 0 }], zIndex: 3 },
  stackMid: { transform: [{ translateX: -115 }, { rotate: '-8deg' }, { scale: 0.86 }], zIndex: 2 },
  stackBack: { transform: [{ translateX: 115 }, { rotate: '8deg' }, { scale: 0.86 }], zIndex: 1 },

  featuredInfo: { alignItems: 'center', marginTop: 10 },
  featuredTitle: { ...Typography.display, fontSize: 18, textAlign: 'center' },

  dots: { flexDirection: 'row', gap: 6, justifyContent: 'center', marginTop: 14 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.faint },
  dotActive: { backgroundColor: Colors.pine },

  list: { paddingHorizontal: 24, marginTop: 30 },
  listLabel: { color: Colors.faint, marginBottom: 14 },

  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: Radius.md,
    padding: 14,
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
    alignItems: 'center',
    ...Shadow.card,
  },
  cardInfo: { flex: 1 },
  cardTitle: {
    fontFamily: FontFamily.serif,
    fontSize: 18,
    lineHeight: 22,
    color: Colors.ink,
  },
});

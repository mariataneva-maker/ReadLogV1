import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useBooksStore } from '../../src/store/books';
import { Tag, FAB } from '../../src/components';
import { Colors, Typography, FontFamily, Shadow, Radius } from '../../src/theme';

export default function QuotesScreen() {
  const { quotes, books } = useBooksStore();

  const bookMap = Object.fromEntries(books.map((b) => [b.id, b]));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Quotes</Text>

        <View style={styles.list}>
          {quotes.map((q) => {
            const book = bookMap[q.bookId];
            return (
              <View key={q.id} style={styles.card}>
                <Text style={styles.quoteText}>{q.text}</Text>
                <View style={styles.divider} />
                <View style={styles.meta}>
                  <View style={styles.source}>
                    {book?.coverUrl && (
                      <Image
                        source={{ uri: book.coverUrl }}
                        style={styles.miniCover}
                        resizeMode="cover"
                      />
                    )}
                    <View style={styles.sourceInfo}>
                      <Text style={styles.bookTitle} numberOfLines={1}>
                        {book?.title ?? 'Unknown'}
                      </Text>
                      <Text style={[Typography.meta, { color: Colors.faint }]}>
                        p.{q.page} · Ch.{q.chapter}
                      </Text>
                    </View>
                  </View>
                  {q.tag && <Tag label={q.tag} />}
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      <FAB onPress={() => {}} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.paper },
  scroll: { flex: 1 },
  content: { paddingTop: 4 },

  title: {
    ...Typography.display,
    fontSize: 30,
    paddingHorizontal: 24,
    paddingTop: 4,
    marginBottom: 24,
  },

  list: { paddingHorizontal: 24 },

  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: Radius.md,
    padding: 18,
    marginBottom: 14,
    ...Shadow.card,
  },
  quoteText: {
    ...Typography.read,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.line,
    marginVertical: 14,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  source: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 12,
  },
  miniCover: {
    width: 30,
    height: 44,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  sourceInfo: { flex: 1 },
  bookTitle: {
    fontFamily: FontFamily.sansMedium,
    fontSize: 13,
    color: Colors.ink,
  },
});

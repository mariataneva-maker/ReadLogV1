import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooksStore } from '../../src/store/books';
import { FAB } from '../../src/components';
import { Colors, Typography, FontFamily, Shadow, Radius } from '../../src/theme';

export default function NotesScreen() {
  const { notes, books } = useBooksStore();
  const router = useRouter();
  const bookMap = Object.fromEntries(books.map((b) => [b.id, b]));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Notes</Text>

        {notes.length === 0 ? (
          <View style={styles.empty}>
            <Text style={[Typography.body, { color: Colors.ink }]}>No notes yet</Text>
            <Text style={[Typography.meta, { textAlign: 'center', marginTop: 8, lineHeight: 20 }]}>
              Tap the + button while reading to capture a thought.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {notes.map((n) => {
              const book = bookMap[n.bookId];
              return (
                <View key={n.id} style={styles.card}>
                  <Text style={styles.noteText}>{n.text}</Text>
                  <View style={styles.divider} />
                  <View style={styles.meta}>
                    <View style={styles.source}>
                      {book?.coverUrl && (
                        <Image source={{ uri: book.coverUrl }} style={styles.miniCover} resizeMode="cover" />
                      )}
                      <View style={styles.sourceInfo}>
                        <Text style={styles.bookTitle} numberOfLines={1}>{book?.title ?? 'Unknown'}</Text>
                        <Text style={[Typography.meta, { color: Colors.faint }]}>
                          {n.page ? `p.${n.page}` : ''}{n.chapter ? ` · Ch.${n.chapter}` : ''}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: 140 }} />
      </ScrollView>

      <FAB onPress={() => router.push({ pathname: '/capture', params: { mode: 'note' } })} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.paper },
  content: { paddingTop: 4 },
  title: {
    fontFamily: FontFamily.serif, fontSize: 30, color: Colors.ink,
    paddingHorizontal: 24, paddingTop: 4, marginBottom: 24,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 48, paddingTop: 80 },
  list: { paddingHorizontal: 24 },
  card: {
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.line,
    borderRadius: Radius.md, padding: 18, marginBottom: 14, ...Shadow.card,
  },
  noteText: { fontFamily: FontFamily.serif, fontSize: 17, lineHeight: 26, color: Colors.ink },
  divider: { height: 1, backgroundColor: Colors.line, marginVertical: 14 },
  meta: { flexDirection: 'row', alignItems: 'center' },
  source: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  miniCover: { width: 30, height: 44, borderRadius: 2, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },
  sourceInfo: { flex: 1 },
  bookTitle: { fontFamily: FontFamily.sansMedium, fontSize: 13, color: Colors.ink },
});

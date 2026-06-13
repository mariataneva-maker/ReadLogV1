import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useBooksStore } from '../src/store/books';
import { Colors, FontFamily, Radius, Shadow, Typography } from '../src/theme';

interface SearchResult {
  key: string;
  title: string;
  author_name?: string[];
  isbn?: string[];
  number_of_pages_median?: number;
  first_publish_year?: number;
}

function coverUrl(isbn: string | undefined): string | null {
  if (!isbn) return null;
  return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
}

export default function SearchScreen() {
  const router = useRouter();
  const { books, addBook } = useBooksStore();
  const existingIds = new Set(books.map((b) => b.id));

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const encoded = encodeURIComponent(query.trim());
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encoded}&limit=20&fields=key,title,author_name,isbn,number_of_pages_median,first_publish_year`
      );
      const data = await res.json();
      setResults(data.docs ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  function handleAdd(item: SearchResult) {
    const isbn = item.isbn?.[0];
    const bookId = item.key.replace('/works/', '');
    if (existingIds.has(bookId)) return;

    addBook({
      id: bookId,
      title: item.title,
      author: item.author_name?.[0] ?? 'Unknown',
      coverUrl: coverUrl(isbn),
      genre: '',
      rating: 0,
      status: 'not_started',
      totalPages: item.number_of_pages_median ?? 0,
      currentPage: 0,
      currentChapter: 0,
      totalChapters: 0,
    });
    router.back();
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Add book</Text>
        <View style={{ width: 52 }} />
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search by title or author…"
          placeholderTextColor={Colors.faint}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={search}
          returnKeyType="search"
          autoFocus
        />
        <TouchableOpacity onPress={search} activeOpacity={0.7} style={styles.searchBtn}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.pine} />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            searched ? (
              <View style={styles.center}>
                <Text style={Typography.meta}>No results found.</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => {
            const isbn = item.isbn?.[0];
            const bookId = item.key.replace('/works/', '');
            const already = existingIds.has(bookId);
            return (
              <View style={styles.row}>
                <View style={styles.coverPlaceholder}>
                  {isbn ? (
                    <Image
                      source={{ uri: coverUrl(isbn)! }}
                      style={styles.cover}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.cover, { backgroundColor: Colors.line }]} />
                  )}
                </View>
                <View style={styles.info}>
                  <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                  <Text style={[Typography.meta, { marginTop: 3 }]}>
                    {item.author_name?.[0] ?? 'Unknown'}
                  </Text>
                  {item.number_of_pages_median ? (
                    <Text style={[Typography.meta, { color: Colors.faint, marginTop: 2 }]}>
                      {item.number_of_pages_median} pages
                      {item.first_publish_year ? ` · ${item.first_publish_year}` : ''}
                    </Text>
                  ) : null}
                </View>
                <TouchableOpacity
                  onPress={() => handleAdd(item)}
                  disabled={already}
                  activeOpacity={0.7}
                  style={[styles.addBtn, already && styles.addBtnDone]}
                >
                  <Text style={[styles.addBtnText, already && styles.addBtnTextDone]}>
                    {already ? 'Added' : 'Add'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.paper },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12,
  },
  cancel: { fontFamily: FontFamily.sansMedium, fontSize: 15, color: Colors.grey },
  heading: { fontFamily: FontFamily.sansSemiBold, fontSize: 15, color: Colors.ink },

  searchBar: {
    flexDirection: 'row', gap: 10, marginHorizontal: 24, marginBottom: 16,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.line,
    borderRadius: Radius.md, padding: 12, alignItems: 'center', ...Shadow.card,
  },
  input: {
    flex: 1, fontFamily: FontFamily.sansMedium, fontSize: 15, color: Colors.ink,
  },
  searchBtn: {
    backgroundColor: Colors.pine, paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: Radius.full,
  },
  searchBtnText: { fontFamily: FontFamily.sansSemiBold, fontSize: 13, color: Colors.cream },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  list: { paddingHorizontal: 24, paddingBottom: 40 },

  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.line,
  },
  coverPlaceholder: {
    width: 44, height: 64, borderRadius: Radius.sm, overflow: 'hidden',
    ...Shadow.card,
  },
  cover: { width: 44, height: 64 },
  info: { flex: 1 },
  title: { fontFamily: FontFamily.serif, fontSize: 16, lineHeight: 20, color: Colors.ink },

  addBtn: {
    borderWidth: 1, borderColor: Colors.pine, paddingHorizontal: 14,
    paddingVertical: 6, borderRadius: Radius.full,
  },
  addBtnDone: { borderColor: Colors.line, backgroundColor: Colors.tint },
  addBtnText: { fontFamily: FontFamily.sansSemiBold, fontSize: 13, color: Colors.pine },
  addBtnTextDone: { color: Colors.faint },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBooksStore } from '../src/store/books';
import { Colors, FontFamily, Radius, Shadow } from '../src/theme';

export default function LogProgressScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const router = useRouter();
  const { books, updateProgress } = useBooksStore();

  const book = books.find((b) => b.id === bookId) ?? books[0];
  const [page, setPage] = useState(String(book?.currentPage ?? ''));

  const pct = book ? Math.round((parseInt(page) || 0) / book.totalPages * 100) : 0;
  const isValid = parseInt(page) > 0 && parseInt(page) <= (book?.totalPages ?? 0);

  function handleSave() {
    if (!isValid || !book) return;
    updateProgress(book.id, parseInt(page));
    router.back();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.content}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.heading}>Log reading</Text>
            <TouchableOpacity onPress={handleSave} activeOpacity={0.7} style={[styles.saveBtn, !isValid && styles.saveBtnDisabled]}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.bookTitle}>{book?.title}</Text>
          <Text style={styles.bookAuthor}>{book?.author}</Text>

          <View style={styles.inputCard}>
            <Text style={styles.fieldLabel}>Current page</Text>
            <TextInput
              style={styles.pageInput}
              value={page}
              onChangeText={setPage}
              keyboardType="number-pad"
              autoFocus
              selectTextOnFocus
            />
            <Text style={styles.total}>of {book?.totalPages}</Text>
          </View>

          {parseInt(page) > 0 && (
            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${Math.min(pct, 100)}%` }]} />
              </View>
              <Text style={styles.pctLabel}>{pct}%</Text>
            </View>
          )}

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.paper },
  content: { flex: 1, padding: 24, paddingTop: 16 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  cancel: { fontFamily: FontFamily.sansMedium, fontSize: 15, color: Colors.grey },
  heading: { fontFamily: FontFamily.sansSemiBold, fontSize: 15, color: Colors.ink },
  saveBtn: { backgroundColor: Colors.pine, paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { fontFamily: FontFamily.sansSemiBold, fontSize: 14, color: Colors.cream },

  bookTitle: { fontFamily: FontFamily.serif, fontSize: 22, color: Colors.ink, textAlign: 'center' },
  bookAuthor: { fontFamily: FontFamily.sansMedium, fontSize: 14, color: Colors.grey, textAlign: 'center', marginTop: 6, marginBottom: 32 },

  inputCard: {
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.line,
    borderRadius: Radius.md, padding: 20, alignItems: 'center', ...Shadow.card,
  },
  fieldLabel: { fontFamily: FontFamily.sansMedium, fontSize: 12, color: Colors.faint, marginBottom: 12 },
  pageInput: {
    fontFamily: FontFamily.serif, fontSize: 48, color: Colors.ink,
    textAlign: 'center', minWidth: 120,
  },
  total: { fontFamily: FontFamily.sansMedium, fontSize: 14, color: Colors.faint, marginTop: 8 },

  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 24 },
  progressTrack: { flex: 1, height: 3, backgroundColor: Colors.line, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.pine, borderRadius: 2 },
  pctLabel: { fontFamily: FontFamily.sansMedium, fontSize: 13, color: Colors.grey, width: 36, textAlign: 'right' },
});

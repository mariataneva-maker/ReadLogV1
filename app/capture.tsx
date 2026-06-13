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
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBooksStore } from '../src/store/books';
import { Colors, Typography, FontFamily, Radius, Shadow } from '../src/theme';

type Mode = 'quote' | 'note';

export default function CaptureScreen() {
  const { bookId, mode: initialMode } = useLocalSearchParams<{ bookId?: string; mode?: string }>();
  const router = useRouter();
  const { books, addQuote, addNote } = useBooksStore();

  const [mode, setMode] = useState<Mode>((initialMode === 'note' ? 'note' : 'quote') as Mode);
  const [text, setText] = useState('');
  const [page, setPage] = useState('');
  const [chapter, setChapter] = useState('');
  const [tag, setTag] = useState('');
  const [myNote, setMyNote] = useState('');

  const book = books.find((b) => b.id === bookId) ?? books[0];

  function handleSave() {
    if (!text.trim()) return;
    if (mode === 'quote') {
      addQuote({
        id: Date.now().toString(),
        bookId: book.id,
        text: text.trim(),
        page: parseInt(page) || 0,
        chapter: parseInt(chapter) || 0,
        tag: tag.trim() || undefined,
        myNote: myNote.trim() || undefined,
        createdAt: new Date().toISOString(),
      });
    } else {
      addNote({
        id: Date.now().toString(),
        bookId: book.id,
        text: text.trim(),
        page: parseInt(page) || undefined,
        chapter: parseInt(chapter) || undefined,
        createdAt: new Date().toISOString(),
      });
    }
    router.back();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.heading}>New capture</Text>
            <TouchableOpacity onPress={handleSave} activeOpacity={0.7} style={[styles.saveBtn, !text.trim() && styles.saveBtnDisabled]}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Mode toggle */}
          <View style={styles.toggle}>
            <TouchableOpacity
              style={[styles.toggleBtn, mode === 'quote' && styles.toggleBtnOn]}
              onPress={() => setMode('quote')}
              activeOpacity={0.7}
            >
              <Text style={[styles.toggleLabel, mode === 'quote' && styles.toggleLabelOn]}>Quote</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, mode === 'note' && styles.toggleBtnOn]}
              onPress={() => setMode('note')}
              activeOpacity={0.7}
            >
              <Text style={[styles.toggleLabel, mode === 'note' && styles.toggleLabelOn]}>Note</Text>
            </TouchableOpacity>
          </View>

          {/* Book context */}
          <View style={styles.bookCtx}>
            <Text style={[Typography.meta, { color: Colors.faint }]}>From</Text>
            <Text style={[Typography.body, { marginLeft: 8 }]}>{book?.title ?? 'Unknown book'}</Text>
          </View>

          {/* Main text */}
          <View style={styles.field}>
            <TextInput
              style={styles.mainInput}
              placeholder={mode === 'quote' ? 'Paste or type the quote…' : 'Write your note…'}
              placeholderTextColor={Colors.faint}
              multiline
              value={text}
              onChangeText={setText}
              autoFocus
            />
          </View>

          {/* Page + Chapter */}
          <View style={styles.row}>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Page</Text>
              <TextInput
                style={styles.smallInput}
                placeholder="e.g. 142"
                placeholderTextColor={Colors.faint}
                keyboardType="number-pad"
                value={page}
                onChangeText={setPage}
              />
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Chapter</Text>
              <TextInput
                style={styles.smallInput}
                placeholder="e.g. 6"
                placeholderTextColor={Colors.faint}
                keyboardType="number-pad"
                value={chapter}
                onChangeText={setChapter}
              />
            </View>
          </View>

          {/* Tag */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Tag <Text style={styles.optional}>(optional)</Text></Text>
            <TextInput
              style={styles.smallInput}
              placeholder="e.g. Mindset"
              placeholderTextColor={Colors.faint}
              value={tag}
              onChangeText={setTag}
            />
          </View>

          {/* My note (quote mode only) */}
          {mode === 'quote' && (
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>My note <Text style={styles.optional}>(optional)</Text></Text>
              <TextInput
                style={[styles.mainInput, { minHeight: 80 }]}
                placeholder="What this means to you…"
                placeholderTextColor={Colors.faint}
                multiline
                value={myNote}
                onChangeText={setMyNote}
              />
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.paper },
  scroll: { padding: 24, paddingTop: 16 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  cancel: { fontFamily: FontFamily.sansMedium, fontSize: 15, color: Colors.grey },
  heading: { fontFamily: FontFamily.sansSemiBold, fontSize: 15, color: Colors.ink },
  saveBtn: { backgroundColor: Colors.pine, paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { fontFamily: FontFamily.sansSemiBold, fontSize: 14, color: Colors.cream },

  toggle: {
    flexDirection: 'row', backgroundColor: Colors.line, borderRadius: Radius.full,
    padding: 4, marginBottom: 24, alignSelf: 'flex-start',
  },
  toggleBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: Radius.full },
  toggleBtnOn: { backgroundColor: Colors.pine },
  toggleLabel: { fontFamily: FontFamily.sansSemiBold, fontSize: 14, color: Colors.grey },
  toggleLabelOn: { color: Colors.cream },

  bookCtx: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },

  field: {
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.line,
    borderRadius: Radius.md, padding: 14, marginBottom: 12, ...Shadow.card,
  },
  fieldLabel: { fontFamily: FontFamily.sansMedium, fontSize: 12, color: Colors.faint, marginBottom: 6 },
  optional: { color: Colors.faint },
  mainInput: {
    fontFamily: FontFamily.serif, fontSize: 19, lineHeight: 28, color: Colors.ink,
    minHeight: 120, textAlignVertical: 'top',
  },
  smallInput: { fontFamily: FontFamily.sansMedium, fontSize: 15, color: Colors.ink },
  row: { flexDirection: 'row', gap: 12 },
});

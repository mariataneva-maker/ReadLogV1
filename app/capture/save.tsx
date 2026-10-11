// Capture / 5 · Save details — the last step for Snap, Speak and Type.
import React, { useMemo, useState } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useBooksStore } from '../../src/store/books';
import { BookCard } from '../../src/components';
import { Button, Chip, TagChip, SheetHeader, FieldLabel, ui } from '../../src/components/ui';
import { closeCapture, pickBook, type CaptureParams, type CaptureSource } from '../../src/capture';
import { Palette, FontFamily } from '../../src/theme';

const SOURCE_LABEL: Record<CaptureSource, string> = { snapped: 'Snapped', spoken: 'Spoken', typed: 'Typed' };

export default function SaveCaptureScreen() {
  const params = useLocalSearchParams() as CaptureParams & { mode?: string };
  const { books, quotes, addQuote, addNote } = useBooksStore();

  const kind = params.kind === 'note' || params.mode === 'note' ? 'note' : 'quote';
  const source: CaptureSource = params.source ?? 'typed';
  const [chosenId, setBookId] = useState<string>();
  const [picking, setPicking] = useState(false);
  const [text, setText] = useState(params.text ?? '');
  const [page, setPage] = useState(params.page ?? '');
  const [chapter, setChapter] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>();
  const [why, setWhy] = useState('');
  const book = pickBook(books, chosenId ?? params.bookId);
  const bookId = book?.id;

  // Tags you've used before, most recent first, as one-tap suggestions.
  const knownTags = useMemo(() => {
    const all = [...quotes].reverse().flatMap((q) => (q.tag ?? '').split(',').map((t) => t.trim()));
    return [...new Set(all.filter(Boolean))].slice(0, 6);
  }, [quotes]);

  const subtitle = source === 'snapped' && params.page
    ? `Snapped from page ${params.page}`
    : SOURCE_LABEL[source];

  function addTag(tag?: string) {
    const t = tag?.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setNewTag(undefined);
  }

  function save() {
    if (!book || !text.trim()) return;
    const base = {
      id: Date.now().toString(),
      bookId: book.id,
      text: text.trim(),
      source,
      createdAt: new Date().toISOString(),
    };
    if (kind === 'quote') {
      addQuote({
        ...base,
        page: parseInt(page) || 0,
        chapter: parseInt(chapter) || 0,
        tag: tags.join(', ') || undefined,
        myNote: why.trim() || undefined,
      });
    } else {
      addNote({ ...base, page: parseInt(page) || undefined, chapter: parseInt(chapter) || undefined });
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    closeCapture();
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <SheetHeader title={kind === 'note' ? 'New note' : 'New quote'} subtitle={subtitle} onClose={closeCapture} />

          <View>
            <FieldLabel>Book</FieldLabel>
            {book && <BookCard book={book} onPress={() => setPicking((p) => !p)} />}
            {picking && books.filter((b) => b.id !== bookId).map((b) => (
              <BookCard key={b.id} book={b} onPress={() => { setBookId(b.id); setPicking(false); }} style={{ marginTop: 8 }} />
            ))}
          </View>

          <View style={styles.pair}>
            <View style={{ flex: 1 }}>
              <FieldLabel>Chapter</FieldLabel>
              <TextInput style={[ui.field, ui.body]} value={chapter} onChangeText={setChapter} keyboardType="number-pad"
                placeholder="e.g. 17" placeholderTextColor={Palette.secondaryText} />
            </View>
            <View style={{ flex: 1 }}>
              <FieldLabel>Page</FieldLabel>
              <TextInput style={[ui.field, ui.body]} value={page} onChangeText={setPage} keyboardType="number-pad"
                placeholder="e.g. 142" placeholderTextColor={Palette.secondaryText} />
            </View>
          </View>

          <View>
            <FieldLabel>{kind === 'note' ? 'Note' : 'Quote'}</FieldLabel>
            <TextInput style={[ui.field, ui.body, styles.multi]} value={text} onChangeText={setText} multiline
              autoFocus={!text} placeholderTextColor={Palette.secondaryText}
              placeholder={kind === 'note' ? 'Write your thought…' : 'Type or paste the quote…'} />
          </View>

          {kind === 'quote' && (
            <>
              <View>
                <FieldLabel>Tags</FieldLabel>
                <View style={styles.tags}>
                  {tags.map((t) => <TagChip key={t} label={t} onPress={() => setTags(tags.filter((x) => x !== t))} />)}
                  {knownTags.filter((t) => !tags.includes(t)).map((t) => (
                    <Chip key={t} label={t} onPress={() => addTag(t)} />
                  ))}
                  {newTag === undefined ? (
                    <Chip label="+ Add tag" onPress={() => setNewTag('')} />
                  ) : (
                    <TextInput style={[styles.tagInput]} value={newTag} onChangeText={setNewTag} autoFocus
                      placeholder="New tag" placeholderTextColor={Palette.secondaryText}
                      onSubmitEditing={() => addTag(newTag)} onBlur={() => addTag(newTag)} returnKeyType="done" />
                  )}
                </View>
              </View>
              <View>
                <FieldLabel>Why I kept it</FieldLabel>
                <TextInput style={[ui.field, ui.body, styles.why]} value={why} onChangeText={setWhy} multiline
                  placeholder="What it made you think" placeholderTextColor={Palette.secondaryText} />
              </View>
            </>
          )}
        </ScrollView>
        <Button label={kind === 'note' ? 'Save note' : 'Save quote'} onPress={save}
          disabled={!book || !text.trim()} style={styles.save} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.background },
  content: { padding: 16, gap: 16 },
  pair: { flexDirection: 'row', gap: 12 },
  multi: { minHeight: 96, textAlignVertical: 'top' },
  why: { minHeight: 72, textAlignVertical: 'top' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  tagInput: {
    fontFamily: FontFamily.sans, fontSize: 15, color: Palette.mainText, minWidth: 100,
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999,
    backgroundColor: Palette.buttonText, borderWidth: 1, borderColor: Palette.highlightOutline,
  },
  save: { marginHorizontal: 16, marginBottom: 16, marginTop: 8 },
});

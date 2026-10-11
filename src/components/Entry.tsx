// A saved quote or note, styled after the Figma "Book quotes" list.
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import type { Book, Quote, Note } from '../store/books';
import { TagChip } from './ui';
import { Palette, FontFamily } from '../theme';

const MUTED = '#6B7C74';

export function splitTags(tag?: string): string[] {
  return (tag ?? '').split(',').map((t) => t.trim()).filter(Boolean);
}

/** Pass `book` to show which book it came from (used outside Book detail). */
export function Entry({ entry, book, onPress }: { entry: Quote | Note; book?: Book; onPress?: () => void }) {
  const tags = 'tag' in entry ? splitTags(entry.tag) : [];
  const where = [entry.chapter ? `Chapter ${entry.chapter}` : '', entry.page ? `Page ${entry.page}` : ''];

  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [styles.entry, pressed && { opacity: 0.7 }]}>
      {book ? (
        <View style={styles.meta}>
          <View style={styles.source}>
            {book.coverUrl ? <Image source={{ uri: book.coverUrl }} style={styles.cover} /> : <View style={styles.cover} />}
            <Text style={styles.muted} numberOfLines={1}>{book.title}</Text>
          </View>
          {entry.page ? <Text style={styles.muted}>Page {entry.page}</Text> : null}
        </View>
      ) : (where[0] || where[1]) ? (
        <View style={styles.meta}>
          <Text style={styles.muted}>{where[0]}</Text>
          <Text style={styles.muted}>{where[1]}</Text>
        </View>
      ) : null}
      <Text style={styles.text}>{entry.text}</Text>
      {tags.length > 0 && <View style={styles.tags}>{tags.map((t) => <TagChip key={t} label={t} />)}</View>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  entry: { gap: 8, paddingBottom: 16, borderBottomWidth: 0.5, borderBottomColor: Palette.tag },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 16 },
  source: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 },
  cover: { width: 20, height: 30, borderRadius: 2, backgroundColor: Palette.subtleOutline },
  muted: { fontFamily: FontFamily.sans, fontSize: 16, lineHeight: 21, color: MUTED, flexShrink: 1 },
  text: { fontFamily: FontFamily.sans, fontSize: 16, lineHeight: 22, color: Palette.mainText },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
});

/** Shared layout for the Quotes and Notes tabs. */
export const listScreenStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.background },
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 180, gap: 16 },
  title: { fontFamily: FontFamily.sansSemiBold, fontSize: 36, color: Palette.mainText, marginBottom: 8 },
  chipScroll: { marginHorizontal: -16, marginBottom: 8 },
  chips: { gap: 8, paddingHorizontal: 16 },
  empty: { alignItems: 'center', paddingTop: 48, gap: 8 },
  emptyTitle: { fontFamily: FontFamily.serifMedium, fontSize: 20, color: Palette.mainText },
  emptyText: { fontFamily: FontFamily.sans, fontSize: 14, color: Palette.secondaryText, textAlign: 'center' },
});

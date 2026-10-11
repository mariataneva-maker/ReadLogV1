// Figma "Book card": small cover, title, author and reading progress.
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import type { Book } from '../store/books';
import { Palette, FontFamily, Type } from '../theme';

export function BookCard({ book, onPress, style }: { book: Book; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  const progress = book.totalPages ? Math.min(1, book.currentPage / book.totalPages) : 0;
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [styles.card, style, pressed && styles.pressed]}>
      {book.coverUrl ? <Image source={{ uri: book.coverUrl }} style={styles.cover} /> : <View style={styles.cover} />}
      <View style={styles.info}>
        <View>
          <Text style={styles.title} numberOfLines={1}>{book.title}</Text>
          <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 17, padding: 16,
    backgroundColor: Palette.cardBackground, borderRadius: 16, borderWidth: 1, borderColor: Palette.subtleOutline,
  },
  pressed: { opacity: 0.75 },
  cover: { width: 38, height: 56, borderRadius: 2, backgroundColor: Palette.subtleOutline },
  info: { flex: 1, gap: 8 },
  title: { ...Type.body, color: Palette.mainText },
  author: { ...Type.meta, color: Palette.mutedText },
  track: { height: 4, borderRadius: 2, backgroundColor: Palette.subtleOutline, overflow: 'hidden' },
  fill: { height: 4, borderRadius: 2, backgroundColor: Palette.highlightOutline },
});

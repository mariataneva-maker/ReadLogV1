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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBooksStore, Quote, Note } from '../../src/store/books';
import { BookCover, Tag, ProgressBar, FAB } from '../../src/components';
import { Colors, Typography, FontFamily, Radius, Shadow } from '../../src/theme';

type Tab = 'info' | 'quotes' | 'notes';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { books, quotes, notes, streak } = useBooksStore();
  const [tab, setTab] = useState<Tab>('quotes');

  const book = books.find((b) => b.id === id);
  if (!book) return null;

  const bookQuotes = quotes.filter((q) => q.bookId === id);
  const bookNotes = notes.filter((n) => n.bookId === id);
  const pct = Math.round((book.currentPage / book.totalPages) * 100);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Nav */}
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <BackIcon />
          </TouchableOpacity>
          <View style={styles.moreBtn}>
            <DotsIcon />
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <BookCover uri={book.coverUrl} size="lg" />
          <Text style={styles.title}>{book.title}</Text>
          <Text style={[Typography.body, styles.author]}>{book.author}</Text>
          <View style={styles.chips}>
            <View style={styles.genreChip}><Text style={styles.genreText}>{book.genre}</Text></View>
            <Text style={styles.stars}>{'★'.repeat(book.rating) + '☆'.repeat(5 - book.rating)}</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progSection}>
          <View style={styles.progRow}>
            <Text style={Typography.meta}>Progress</Text>
            <Text style={Typography.meta}>{streak > 0 ? `${streak}-day streak` : 'No streak yet'}</Text>
          </View>
          <ProgressBar progress={book.currentPage / book.totalPages} height={3} style={{ marginTop: 12 }} />
          <Text style={[Typography.meta, { marginTop: 11 }]}>
            Page {book.currentPage} of {book.totalPages} · {pct}% · Chapter {book.currentChapter} of {book.totalChapters}
          </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.cta}
          activeOpacity={0.85}
          onPress={() => router.push({ pathname: '/log-progress', params: { bookId: id } })}
        >
          <Text style={styles.ctaText}>Log reading</Text>
        </TouchableOpacity>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['info', 'quotes', 'notes'] as Tab[]).map((t) => (
            <TouchableOpacity key={t} onPress={() => setTab(t)} style={styles.tabBtn} activeOpacity={0.7}>
              <Text style={[styles.tabLabel, tab === t && styles.tabLabelOn]}>
                {t === 'info' ? 'Book info' : t === 'quotes' ? `Quotes ${bookQuotes.length}` : `Notes ${bookNotes.length}`}
              </Text>
              {tab === t && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab content */}
        {tab === 'quotes' && (
          <View>
            {bookQuotes.length === 0 ? (
              <View style={styles.empty}>
                <Text style={Typography.meta}>No quotes yet — tap + to add one.</Text>
              </View>
            ) : (
              bookQuotes.map((q) => <QuoteRow key={q.id} quote={q} />)
            )}
          </View>
        )}
        {tab === 'notes' && (
          <View>
            {bookNotes.length === 0 ? (
              <View style={styles.empty}>
                <Text style={Typography.meta}>No notes yet — tap + to add one.</Text>
              </View>
            ) : (
              bookNotes.map((n) => <NoteRow key={n.id} note={n} />)
            )}
          </View>
        )}
        {tab === 'info' && (
          <View style={styles.infoSection}>
            <InfoRow label="Genre" value={book.genre} />
            <InfoRow label="Total pages" value={String(book.totalPages)} />
            <InfoRow label="Chapters" value={String(book.totalChapters)} />
            <InfoRow label="Rating" value={'★'.repeat(book.rating) + '☆'.repeat(5 - book.rating)} />
          </View>
        )}

        <View style={{ height: 140 }} />
      </ScrollView>

      <FAB onPress={() => router.push({ pathname: '/capture', params: { bookId: id } })} />
    </SafeAreaView>
  );
}

function NoteRow({ note }: { note: Note }) {
  return (
    <View style={styles.quoteRow}>
      <Text style={[styles.quoteText, { fontSize: 16, lineHeight: 24 }]}>{note.text}</Text>
      <View style={styles.quoteMeta}>
        <Text style={Typography.meta}>
          {note.page ? `Page ${note.page}` : ''}{note.chapter ? ` · Chapter ${note.chapter}` : ''}
        </Text>
      </View>
    </View>
  );
}

function QuoteRow({ quote }: { quote: Quote }) {
  return (
    <View style={styles.quoteRow}>
      <Text style={styles.quoteText}>{quote.text}</Text>
      <View style={styles.quoteMeta}>
        <Text style={Typography.meta}>Page {quote.page} · Chapter {quote.chapter}</Text>
        {quote.tag && <Tag label={quote.tag} />}
      </View>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={Typography.meta}>{label}</Text>
      <Text style={[Typography.body, { color: Colors.ink }]}>{value}</Text>
    </View>
  );
}

function BackIcon() {
  return (
    <View style={{ width: 20, height: 20, justifyContent: 'center' }}>
      <View style={[styles.chevron, { transform: [{ rotate: '45deg' }, { translateX: 3 }] }]} />
      <View style={[styles.chevronBottom, { transform: [{ rotate: '-45deg' }, { translateX: 3 }] }]} />
    </View>
  );
}

function DotsIcon() {
  return (
    <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={styles.dot} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.paper },

  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 8 },
  backBtn: { padding: 8 },
  moreBtn: { padding: 8 },

  hero: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 8, paddingBottom: 8 },
  title: { fontFamily: FontFamily.serif, fontSize: 29, lineHeight: 32, color: Colors.ink, textAlign: 'center', marginTop: 24 },
  author: { color: Colors.grey, marginTop: 8 },
  chips: { flexDirection: 'row', gap: 10, marginTop: 16, alignItems: 'center' },
  genreChip: { borderWidth: 1, borderColor: Colors.line, paddingHorizontal: 13, paddingVertical: 5, borderRadius: Radius.full },
  genreText: { fontFamily: FontFamily.sansMedium, fontSize: 13, color: Colors.ink },
  stars: { fontSize: 14, color: Colors.pine, letterSpacing: 1 },

  progSection: { marginHorizontal: 24, marginTop: 30 },
  progRow: { flexDirection: 'row', justifyContent: 'space-between' },

  cta: {
    marginHorizontal: 24, marginTop: 22, height: 50, borderRadius: Radius.full,
    backgroundColor: Colors.pine, alignItems: 'center', justifyContent: 'center',
  },
  ctaText: { fontFamily: FontFamily.sansSemiBold, fontSize: 15, color: Colors.cream },

  tabs: { flexDirection: 'row', gap: 26, justifyContent: 'center', marginTop: 30, marginHorizontal: 24, borderBottomWidth: 1, borderBottomColor: Colors.line },
  tabBtn: { paddingBottom: 13, position: 'relative' },
  tabLabel: { fontFamily: FontFamily.sansMedium, fontSize: 15, color: Colors.grey },
  tabLabelOn: { color: Colors.ink },
  tabUnderline: { position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, backgroundColor: Colors.pine },

  quoteRow: { padding: 24, borderBottomWidth: 1, borderBottomColor: Colors.line },
  quoteText: { fontFamily: FontFamily.serif, fontSize: 19, lineHeight: 28, color: Colors.ink },
  quoteMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },

  empty: { padding: 40, alignItems: 'center' },

  infoSection: { marginHorizontal: 24, marginTop: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.line },

  chevron: { width: 10, height: 2, backgroundColor: Colors.ink, borderRadius: 1 },
  chevronBottom: { width: 10, height: 2, backgroundColor: Colors.ink, borderRadius: 1, marginTop: -2 },
  dot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.ink },
});

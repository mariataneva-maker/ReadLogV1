import { create } from 'zustand';
import { db } from '../db';
import { books as booksTable, quotes as quotesTable, notes as notesTable, readingSessions } from '../db/schema';
import { eq } from 'drizzle-orm';

export type ReadStatus = 'not_started' | 'reading' | 'completed';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string | null;
  genre: string;
  rating: number;
  status: ReadStatus;
  totalPages: number;
  currentPage: number;
  currentChapter: number;
  totalChapters: number;
}

export interface Quote {
  id: string;
  bookId: string;
  text: string;
  page: number;
  chapter: number;
  myNote?: string;
  tag?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  bookId: string;
  text: string;
  page?: number;
  chapter?: number;
  createdAt: string;
}

interface BooksState {
  books: Book[];
  quotes: Quote[];
  notes: Note[];
  streak: number;
  loadAll: () => void;
  addBook: (book: Book) => void;
  updateProgress: (bookId: string, page: number) => void;
  addQuote: (quote: Quote) => void;
  addNote: (note: Note) => void;
}

function toBook(row: typeof booksTable.$inferSelect): Book {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    coverUrl: row.coverUrl ?? null,
    genre: row.genre,
    rating: row.rating,
    status: row.status as ReadStatus,
    totalPages: row.totalPages,
    currentPage: row.currentPage,
    currentChapter: row.currentChapter,
    totalChapters: row.totalChapters,
  };
}

function toQuote(row: typeof quotesTable.$inferSelect): Quote {
  return {
    id: row.id,
    bookId: row.bookId,
    text: row.text,
    page: row.page,
    chapter: row.chapter,
    myNote: row.myNote ?? undefined,
    tag: row.tag ?? undefined,
    createdAt: row.createdAt,
  };
}

function toNote(row: typeof notesTable.$inferSelect): Note {
  return {
    id: row.id,
    bookId: row.bookId,
    text: row.text,
    page: row.page ?? undefined,
    chapter: row.chapter ?? undefined,
    createdAt: row.createdAt,
  };
}

function calcStreak(): number {
  const sessions = db.select({ date: readingSessions.date })
    .from(readingSessions)
    .orderBy(readingSessions.date)
    .all();

  if (sessions.length === 0) return 0;

  const uniqueDays = [...new Set(sessions.map((s) => s.date))].sort().reverse();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]);
    const curr = new Date(uniqueDays[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

export const useBooksStore = create<BooksState>((set) => ({
  books: [],
  quotes: [],
  notes: [],
  streak: 0,

  loadAll: () => {
    const books = db.select().from(booksTable).all().map(toBook);
    const quotes = db.select().from(quotesTable).all().map(toQuote);
    const notes = db.select().from(notesTable).all().map(toNote);
    const streak = calcStreak();
    set({ books, quotes, notes, streak });
  },

  addBook: (book) => {
    db.insert(booksTable).values({
      id: book.id,
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
      genre: book.genre,
      rating: book.rating,
      status: book.status,
      totalPages: book.totalPages,
      currentPage: book.currentPage,
      currentChapter: book.currentChapter,
      totalChapters: book.totalChapters,
      createdAt: new Date().toISOString(),
    }).run();
    set((s) => ({ books: [...s.books, book] }));
  },

  updateProgress: (bookId, page) => {
    db.update(booksTable)
      .set({ currentPage: page })
      .where(eq(booksTable.id, bookId))
      .run();

    const today = new Date().toISOString().slice(0, 10);
    const prevPage = db.select({ currentPage: booksTable.currentPage })
      .from(booksTable)
      .where(eq(booksTable.id, bookId))
      .get()?.currentPage ?? 0;

    db.insert(readingSessions).values({
      id: Date.now().toString(),
      bookId,
      date: today,
      pageReached: page,
      pagesRead: Math.max(0, page - prevPage),
      createdAt: new Date().toISOString(),
    }).run();

    const streak = calcStreak();
    set((s) => ({
      books: s.books.map((b) => (b.id === bookId ? { ...b, currentPage: page } : b)),
      streak,
    }));
  },

  addQuote: (quote) => {
    db.insert(quotesTable).values({
      id: quote.id,
      bookId: quote.bookId,
      text: quote.text,
      page: quote.page,
      chapter: quote.chapter,
      myNote: quote.myNote,
      tag: quote.tag,
      createdAt: quote.createdAt,
    }).run();
    set((s) => ({ quotes: [...s.quotes, quote] }));
  },

  addNote: (note) => {
    db.insert(notesTable).values({
      id: note.id,
      bookId: note.bookId,
      text: note.text,
      page: note.page,
      chapter: note.chapter,
      createdAt: note.createdAt,
    }).run();
    set((s) => ({ notes: [...s.notes, note] }));
  },
}));

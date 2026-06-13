import { create } from 'zustand';

export type ReadStatus = 'not_started' | 'reading' | 'completed';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string | null;
  genre: string;
  rating: number; // 0–5
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

interface BooksState {
  books: Book[];
  quotes: Quote[];
  addBook: (book: Book) => void;
  updateProgress: (bookId: string, page: number) => void;
  addQuote: (quote: Quote) => void;
}

const SEED_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Atomic Habits',
    author: 'James Clear',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780735211292-M.jpg',
    genre: 'Self-help',
    rating: 4,
    status: 'reading',
    totalPages: 310,
    currentPage: 142,
    currentChapter: 6,
    totalChapters: 22,
  },
  {
    id: '2',
    title: 'The Overstory',
    author: 'Richard Powers',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780393356687-M.jpg',
    genre: 'Fiction',
    rating: 5,
    status: 'reading',
    totalPages: 502,
    currentPage: 118,
    currentChapter: 3,
    totalChapters: 12,
  },
  {
    id: '3',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780571364879-M.jpg',
    genre: 'Fiction',
    rating: 4,
    status: 'reading',
    totalPages: 303,
    currentPage: 214,
    currentChapter: 8,
    totalChapters: 10,
  },
];

const SEED_QUOTES: Quote[] = [
  {
    id: 'q1',
    bookId: '1',
    text: 'You do not rise to the level of your goals, you fall to the level of your systems.',
    page: 27,
    chapter: 2,
    tag: 'Mindset',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q2',
    bookId: '1',
    text: 'Every action you take is a vote for the type of person you wish to become.',
    page: 38,
    chapter: 3,
    tag: 'Identity',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q3',
    bookId: '2',
    text: "The best arguments in the world won’t change a person’s mind. The only thing that can do that is a good story.",
    page: 194,
    chapter: 5,
    tag: 'Storytelling',
    createdAt: new Date().toISOString(),
  },
];

export const useBooksStore = create<BooksState>((set) => ({
  books: SEED_BOOKS,
  quotes: SEED_QUOTES,
  addBook: (book) => set((s) => ({ books: [...s.books, book] })),
  updateProgress: (bookId, page) =>
    set((s) => ({
      books: s.books.map((b) => (b.id === bookId ? { ...b, currentPage: page } : b)),
    })),
  addQuote: (quote) => set((s) => ({ quotes: [...s.quotes, quote] })),
}));

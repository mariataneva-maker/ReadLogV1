import { int, real, text, sqliteTable } from 'drizzle-orm/sqlite-core';

export const books = sqliteTable('books', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  coverUrl: text('cover_url'),
  genre: text('genre').notNull().default(''),
  rating: int('rating').notNull().default(0),
  status: text('status', { enum: ['not_started', 'reading', 'completed'] }).notNull().default('not_started'),
  totalPages: int('total_pages').notNull().default(0),
  currentPage: int('current_page').notNull().default(0),
  currentChapter: int('current_chapter').notNull().default(0),
  totalChapters: int('total_chapters').notNull().default(0),
  dateStarted: text('date_started'),
  dateFinished: text('date_finished'),
  createdAt: text('created_at').notNull(),
});

export const quotes = sqliteTable('quotes', {
  id: text('id').primaryKey(),
  bookId: text('book_id').notNull().references(() => books.id, { onDelete: 'cascade' }),
  text: text('text').notNull(),
  page: int('page').notNull().default(0),
  chapter: int('chapter').notNull().default(0),
  myNote: text('my_note'),
  tag: text('tag'),
  createdAt: text('created_at').notNull(),
});

export const notes = sqliteTable('notes', {
  id: text('id').primaryKey(),
  bookId: text('book_id').notNull().references(() => books.id, { onDelete: 'cascade' }),
  text: text('text').notNull(),
  page: int('page'),
  chapter: int('chapter'),
  createdAt: text('created_at').notNull(),
});

export const readingSessions = sqliteTable('reading_sessions', {
  id: text('id').primaryKey(),
  bookId: text('book_id').notNull().references(() => books.id, { onDelete: 'cascade' }),
  date: text('date').notNull(), // YYYY-MM-DD
  pageReached: int('page_reached').notNull(),
  pagesRead: int('pages_read').notNull().default(0),
  createdAt: text('created_at').notNull(),
});

import { db } from './index';
import { books, quotes, notes } from './schema';

export async function seedIfEmpty() {
  const existing = db.select().from(books).all();
  if (existing.length > 0) return;

  const now = new Date().toISOString();

  db.insert(books).values([
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
      createdAt: now,
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
      createdAt: now,
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
      createdAt: now,
    },
  ]).run();

  db.insert(quotes).values([
    {
      id: 'q1',
      bookId: '1',
      text: 'You do not rise to the level of your goals, you fall to the level of your systems.',
      page: 27,
      chapter: 2,
      tag: 'Mindset',
      createdAt: now,
    },
    {
      id: 'q2',
      bookId: '1',
      text: 'Every action you take is a vote for the type of person you wish to become.',
      page: 38,
      chapter: 3,
      tag: 'Identity',
      createdAt: now,
    },
    {
      id: 'q3',
      bookId: '2',
      text: "The best arguments in the world won't change a person's mind. The only thing that can do that is a good story.",
      page: 194,
      chapter: 5,
      tag: 'Storytelling',
      createdAt: now,
    },
  ]).run();

  db.insert(notes).values([
    {
      id: 'n1',
      bookId: '1',
      text: 'The compounding effect applies to habits the same way it does to money — small improvements accumulate into remarkable results.',
      page: 15,
      chapter: 1,
      createdAt: now,
    },
  ]).run();
}

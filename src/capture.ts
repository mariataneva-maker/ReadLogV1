// Shared helpers for the Snap / Speak / Type capture flow.
import { router } from 'expo-router';
import type { Book } from './store/books';

export type CaptureKind = 'quote' | 'note';
export type CaptureSource = 'snapped' | 'spoken' | 'typed';

export interface CaptureParams {
  bookId?: string;
  kind?: CaptureKind;
  text?: string;
  page?: string;
  source?: CaptureSource;
}

/** The book a capture belongs to: the one asked for, else the one being read. */
export function pickBook(books: Book[], bookId?: string): Book | undefined {
  return books.find((b) => b.id === bookId)
    ?? books.find((b) => b.status === 'reading')
    ?? books[0];
}

/** Pulls a printed page number (a line that is only digits) off the top or bottom of a scan. */
export function splitPageNumber(lines: string[]): { page?: string; lines: string[] } {
  const clean = lines.map((l) => l.trim()).filter(Boolean);
  const candidates = [0, 1, clean.length - 1, clean.length - 2].filter((i) => i >= 0 && i < clean.length);
  const index = candidates.find((i) => /^\d{1,4}$/.test(clean[i]));
  if (index === undefined) return { lines: clean };
  return { page: clean[index], lines: clean.filter((_, i) => i !== index) };
}

/** Joins scanned lines into running text, re-joining words hyphenated across a line break. */
export function joinLines(lines: string[]): string {
  return lines.reduce((text, line) => {
    if (!text) return line;
    if (/[A-Za-z]-$/.test(text) && /^[a-z]/.test(line)) return text.slice(0, -1) + line;
    return `${text} ${line}`;
  }, '');
}

/**
 * Apple's text recognition doesn't report per-word confidence, so flag words that
 * look misread instead: letters mixed with digits ("powerfu1"), a capital I or l
 * inside a lowercase word ("fearIess"), or stray symbols.
 */
export function looksMisread(word: string): boolean {
  const w = word.replace(/^[^\w]+|[^\w]+$/g, '');
  if (w.length < 2) return false;
  if (/^\d+(st|nd|rd|th|s)?$/i.test(w)) return false;
  return /[a-z]\d|\d[a-z]/i.test(w) || /[a-z]I[a-z]/.test(w) || /[|¢§]/.test(word);
}

/** Finds "page 142" in spoken text and removes it, so the page is saved as data. */
export function splitSpokenPage(text: string): { page?: string; text: string } {
  const match = text.match(/\bpage (\d{1,4})\b[.,:]?/i);
  if (!match) return { text: text.trim() };
  const rest = text.replace(match[0], ' ').replace(/\s{2,}/g, ' ').trim();
  return { page: match[1], text: rest.charAt(0).toUpperCase() + rest.slice(1) };
}

const NUMBER_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five'];
export function countWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n);
}

export function formatTime(secs: number): string {
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
}

/** Leaves the capture flow and returns to wherever it was opened from. */
export function closeCapture() {
  if (router.canDismiss()) router.dismissAll();
  else router.replace('/');
}

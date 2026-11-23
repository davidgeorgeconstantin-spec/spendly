// Shared TypeScript types for the whole app.

export type Category =
  | 'food'
  | 'transport'
  | 'housing'
  | 'bills'
  | 'fun'
  | 'health'
  | 'other';

export interface Expense {
  id: string;
  title: string;
  amount: number; // always a positive number
  category: Category;
  date: string; // ISO date, e.g. "2026-11-23"
}

export type Currency = 'RON' | 'EUR' | 'USD';

export type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

export interface Filters {
  search: string;
  category: Category | 'all';
  month: string; // "2026-11" or "all"
  sort: SortOption;
}

export const CATEGORIES: { value: Category; label: string; emoji: string; color: string }[] = [
  { value: 'food', label: 'Food', emoji: '🍕', color: '#f97316' },
  { value: 'transport', label: 'Transport', emoji: '🚌', color: '#3b82f6' },
  { value: 'housing', label: 'Housing', emoji: '🏠', color: '#8b5cf6' },
  { value: 'bills', label: 'Bills', emoji: '💡', color: '#eab308' },
  { value: 'fun', label: 'Fun', emoji: '🎮', color: '#ec4899' },
  { value: 'health', label: 'Health', emoji: '💊', color: '#10b981' },
  { value: 'other', label: 'Other', emoji: '📦', color: '#64748b' },
];

export function getCategory(value: Category) {
  return CATEGORIES.find((c) => c.value === value) ?? CATEGORIES[CATEGORIES.length - 1];
}

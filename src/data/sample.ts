import type { Expense } from '../types';
import { todayISO } from '../utils/format';

// Example data shown the first time the app opens.
function daysAgo(n: number): string {
  const d = new Date(todayISO() + 'T00:00:00');
  d.setDate(d.getDate() - n);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export const SAMPLE_EXPENSES: Expense[] = [
  { id: 's1', title: 'Groceries – Lidl', amount: 186.4, category: 'food', date: daysAgo(0) },
  { id: 's2', title: 'Monthly bus pass', amount: 80, category: 'transport', date: daysAgo(1) },
  { id: 's3', title: 'Electricity bill', amount: 214.75, category: 'bills', date: daysAgo(3) },
  { id: 's4', title: 'Cinema tickets', amount: 62, category: 'fun', date: daysAgo(4) },
  { id: 's5', title: 'Rent', amount: 1500, category: 'housing', date: daysAgo(6) },
  { id: 's6', title: 'Pharmacy', amount: 45.9, category: 'health', date: daysAgo(8) },
  { id: 's7', title: 'Pizza night', amount: 95, category: 'food', date: daysAgo(10) },
];

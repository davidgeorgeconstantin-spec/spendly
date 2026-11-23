import type { Currency } from '../types';

export function formatMoney(amount: number, currency: Currency): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Today's date as "YYYY-MM-DD" in local time. */
export function todayISO(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

export function monthLabel(month: string): string {
  return new Date(month + '-01T00:00:00').toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
}

export function createId(): string {
  return crypto.randomUUID();
}

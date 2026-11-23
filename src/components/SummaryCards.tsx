import type { Currency } from '../types';
import { formatMoney } from '../utils/format';

interface SummaryCardsProps {
  total: number;
  count: number;
  average: number;
  biggest: number;
  currency: Currency;
}

interface CardProps {
  label: string;
  value: string;
  accent?: boolean; // optional prop
}

function Card({ label, value, accent = false }: CardProps) {
  return (
    <div className={accent ? 'card summary-card accent' : 'card summary-card'}>
      <span className="summary-label">{label}</span>
      <strong className="summary-value">{value}</strong>
    </div>
  );
}

export function SummaryCards({ total, count, average, biggest, currency }: SummaryCardsProps) {
  return (
    <section className="summary-grid" aria-label="Summary">
      <Card label="Total spent" value={formatMoney(total, currency)} accent />
      <Card label="Expenses" value={String(count)} />
      <Card label="Average" value={formatMoney(average, currency)} />
      <Card label="Biggest" value={formatMoney(biggest, currency)} />
    </section>
  );
}

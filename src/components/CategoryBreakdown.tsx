import { CATEGORIES, type Currency, type Expense } from '../types';
import { formatMoney } from '../utils/format';

interface CategoryBreakdownProps {
  expenses: Expense[];
  currency: Currency;
}

export function CategoryBreakdown({ expenses, currency }: CategoryBreakdownProps) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const rows = CATEGORIES.map((c) => {
    const amount = expenses
      .filter((e) => e.category === c.value)
      .reduce((sum, e) => sum + e.amount, 0);
    return { ...c, amount, percent: total > 0 ? (amount / total) * 100 : 0 };
  })
    .filter((row) => row.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  return (
    <section className="card">
      <h2>By category</h2>
      {rows.length === 0 ? (
        <p className="muted">Nothing to show yet.</p>
      ) : (
        <ul className="breakdown">
          {rows.map((row) => (
            <li key={row.value}>
              <div className="breakdown-head">
                <span>
                  {row.emoji} {row.label}
                </span>
                <span className="muted">
                  {formatMoney(row.amount, currency)} · {row.percent.toFixed(0)}%
                </span>
              </div>
              <div className="bar">
                <div className="bar-fill" style={{ width: `${row.percent}%`, backgroundColor: row.color }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

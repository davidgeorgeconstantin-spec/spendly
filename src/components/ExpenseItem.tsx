import { getCategory, type Currency, type Expense } from '../types';
import { formatDate, formatMoney } from '../utils/format';

interface ExpenseItemProps {
  expense: Expense;
  currency: Currency;
  onDelete: (id: string) => void;
}

export function ExpenseItem({ expense, currency, onDelete }: ExpenseItemProps) {
  const category = getCategory(expense.category);

  return (
    <li className="expense-item">
      <span
        className="expense-icon"
        style={{ backgroundColor: category.color + '22', color: category.color }}
        aria-hidden="true"
      >
        {category.emoji}
      </span>

      <div className="expense-info">
        <strong>{expense.title}</strong>
        <span className="muted">
          {category.label} · {formatDate(expense.date)}
        </span>
      </div>

      <span className="expense-amount">-{formatMoney(expense.amount, currency)}</span>

      <button
        className="btn-icon"
        onClick={() => onDelete(expense.id)}
        aria-label={`Delete ${expense.title}`}
        title="Delete"
      >
        ✕
      </button>
    </li>
  );
}

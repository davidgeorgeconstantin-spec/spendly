import type { Currency, Expense } from '../types';
import { ExpenseItem } from './ExpenseItem';

interface ExpenseListProps {
  expenses: Expense[];
  currency: Currency;
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, currency, onDelete }: ExpenseListProps) {
  // Conditional rendering: show a friendly message when the list is empty.
  if (expenses.length === 0) {
    return (
      <div className="empty">
        <p>No expenses found.</p>
        <p className="muted">Add one, or change the filters.</p>
      </div>
    );
  }

  return (
    <ul className="expense-list">
      {expenses.map((expense) => (
        // `key` helps React know which item is which when the list changes.
        <ExpenseItem key={expense.id} expense={expense} currency={currency} onDelete={onDelete} />
      ))}
    </ul>
  );
}

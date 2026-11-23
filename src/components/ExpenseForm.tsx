import { useState, type FormEvent } from 'react';
import { CATEGORIES, type Category, type Expense } from '../types';
import { createId, todayISO } from '../utils/format';

interface ExpenseFormProps {
  onAdd: (expense: Expense) => void;
}

export function ExpenseForm({ onAdd }: ExpenseFormProps) {
  // Controlled inputs: React state is the "source of truth" for every field.
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('food');
  const [date, setDate] = useState(todayISO());
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // stop the browser from reloading the page

    const value = Number(amount);
    if (title.trim() === '') {
      setError('Please enter a title.');
      return;
    }
    if (!Number.isFinite(value) || value <= 0) {
      setError('Amount must be a number greater than 0.');
      return;
    }

    onAdd({ id: createId(), title: title.trim(), amount: value, category, date });

    // Reset the form
    setTitle('');
    setAmount('');
    setError(null);
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>Add expense</h2>

      <label className="field">
        <span>Title</span>
        <input
          type="text"
          placeholder="e.g. Groceries"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <div className="field-row">
        <label className="field">
          <span>Amount</span>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Date</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>

      <label className="field">
        <span>Category</span>
        <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.emoji} {c.label}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="error" role="alert">{error}</p>}

      <button type="submit" className="btn-primary">+ Add expense</button>
    </form>
  );
}

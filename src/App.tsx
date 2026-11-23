import { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { ExpenseForm } from './components/ExpenseForm';
import { FilterBar } from './components/FilterBar';
import { ExpenseList } from './components/ExpenseList';
import { CategoryBreakdown } from './components/CategoryBreakdown';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SAMPLE_EXPENSES } from './data/sample';
import type { Currency, Expense, Filters } from './types';

const DEFAULT_FILTERS: Filters = { search: '', category: 'all', month: 'all', sort: 'newest' };

export default function App() {
  // State that is saved in localStorage
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('spendly:expenses', SAMPLE_EXPENSES);
  const [currency, setCurrency] = useLocalStorage<Currency>('spendly:currency', 'RON');
  // State that only lives while the page is open
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  function addExpense(expense: Expense) {
    // Never mutate state directly – always create a new array.
    setExpenses((prev) => [expense, ...prev]);
  }

  function deleteExpense(id: string) {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  function clearAll() {
    if (confirm('Delete all expenses? This cannot be undone.')) {
      setExpenses([]);
    }
  }

  // Derived data: calculated from state, not stored separately.
  const months = useMemo(
    () => [...new Set(expenses.map((e) => e.date.slice(0, 7)))].sort().reverse(),
    [expenses],
  );

  const visibleExpenses = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    const filtered = expenses.filter((e) => {
      const matchesSearch = e.title.toLowerCase().includes(search);
      const matchesCategory = filters.category === 'all' || e.category === filters.category;
      const matchesMonth = filters.month === 'all' || e.date.startsWith(filters.month);
      return matchesSearch && matchesCategory && matchesMonth;
    });

    return [...filtered].sort((a, b) => {
      switch (filters.sort) {
        case 'oldest':
          return a.date.localeCompare(b.date);
        case 'highest':
          return b.amount - a.amount;
        case 'lowest':
          return a.amount - b.amount;
        case 'newest':
        default:
          return b.date.localeCompare(a.date);
      }
    });
  }, [expenses, filters]);

  const total = visibleExpenses.reduce((sum, e) => sum + e.amount, 0);
  const count = visibleExpenses.length;
  const average = count > 0 ? total / count : 0;
  const biggest = count > 0 ? Math.max(...visibleExpenses.map((e) => e.amount)) : 0;

  return (
    <div className="app">
      <Header currency={currency} onCurrencyChange={setCurrency} />

      <SummaryCards total={total} count={count} average={average} biggest={biggest} currency={currency} />

      <main className="layout">
        <aside className="sidebar">
          <ExpenseForm onAdd={addExpense} />
          <CategoryBreakdown expenses={visibleExpenses} currency={currency} />
        </aside>

        <section className="card list-card">
          <div className="list-head">
            <h2>Expenses</h2>
            {expenses.length > 0 && (
              <button className="btn-ghost" onClick={clearAll}>
                Clear all
              </button>
            )}
          </div>
          <FilterBar filters={filters} months={months} onChange={setFilters} />
          <ExpenseList expenses={visibleExpenses} currency={currency} onDelete={deleteExpense} />
        </section>
      </main>

      <footer className="footer muted">
        Built with React + TypeScript + Vite · Data is stored only in your browser (localStorage)
      </footer>
    </div>
  );
}

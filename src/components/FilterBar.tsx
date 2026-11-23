import { CATEGORIES, type Category, type Filters, type SortOption } from '../types';
import { monthLabel } from '../utils/format';

interface FilterBarProps {
  filters: Filters;
  months: string[]; // months that have at least one expense, e.g. ["2026-11", "2026-10"]
  onChange: (filters: Filters) => void;
}

export function FilterBar({ filters, months, onChange }: FilterBarProps) {
  // Helper: update one field and keep the others (spread operator).
  function update<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="filter-bar">
      <input
        type="search"
        placeholder="Search…"
        value={filters.search}
        onChange={(e) => update('search', e.target.value)}
        aria-label="Search"
      />

      <select
        value={filters.category}
        onChange={(e) => update('category', e.target.value as Category | 'all')}
        aria-label="Category"
      >
        <option value="all">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.emoji} {c.label}
          </option>
        ))}
      </select>

      <select value={filters.month} onChange={(e) => update('month', e.target.value)} aria-label="Month">
        <option value="all">All months</option>
        {months.map((m) => (
          <option key={m} value={m}>
            {monthLabel(m)}
          </option>
        ))}
      </select>

      <select
        value={filters.sort}
        onChange={(e) => update('sort', e.target.value as SortOption)}
        aria-label="Sort"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="highest">Highest amount</option>
        <option value="lowest">Lowest amount</option>
      </select>
    </div>
  );
}

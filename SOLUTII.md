# Soluții: Proiectul 1, Spendly

> ⚠️ **Uită-te aici doar după ce ai încercat singur cel puțin 20–30 de minute.** Greșelile te învață cel mai mult. Dacă soluția ta e diferită, dar funcționează, e perfect. Arată-mi-o și o comparăm.

Toate soluțiile de mai jos au fost testate: proiectul trece `npm run build` cu ele aplicate.

---

## Soluția 1: categoria „Education”

**Fișier:** `src/types.ts`

```ts
export type Category =
  | 'food'
  | 'transport'
  | 'housing'
  | 'bills'
  | 'fun'
  | 'health'
  | 'education' // ← nou
  | 'other';
```

```ts
export const CATEGORIES = [
  // ...celelalte categorii
  { value: 'health', label: 'Health', emoji: '💊', color: '#10b981' },
  { value: 'education', label: 'Education', emoji: '📚', color: '#06b6d4' }, // ← nou
  { value: 'other', label: 'Other', emoji: '📦', color: '#64748b' },
];
```

**De ce merge peste tot:** formularul, filtrele și graficul fac toate `.map()` pe aceeași listă `CATEGORIES`. O singură sursă de adevăr înseamnă o singură schimbare.

---

## Soluția 2: limită de 40 de caractere + contor

**Fișier:** `src/components/ExpenseForm.tsx`

```tsx
const MAX_TITLE = 40; // deasupra componentei
```

În `handleSubmit`, după verificarea titlului gol:

```tsx
if (title.trim().length > MAX_TITLE) {
  setError(`Title can have at most ${MAX_TITLE} characters.`);
  return;
}
```

În JSX, câmpul Title:

```tsx
<input
  type="text"
  placeholder="e.g. Groceries"
  value={title}
  maxLength={MAX_TITLE}
  onChange={(e) => setTitle(e.target.value)}
/>
<small className={title.length >= MAX_TITLE ? 'counter limit' : 'counter'}>
  {title.length}/{MAX_TITLE}
</small>
```

**Fișier:** `src/index.css`

```css
.counter { align-self: flex-end; font-size: 0.75rem; color: var(--muted); }
.counter.limit { color: var(--danger); }
```

**De reținut:** contorul nu are nevoie de state nou, pentru că e calculat din `title`. `maxLength` oprește tastarea, iar validarea din `handleSubmit` e o a doua plasă de siguranță.

---

## Soluția 3: butonul „Duplicate”

**Fișier:** `src/App.tsx`

```tsx
import { createId, todayISO } from './utils/format';

function duplicateExpense(id: string) {
  setExpenses((prev) => {
    const original = prev.find((e) => e.id === id);
    if (!original) return prev; // nu există: nu schimbăm nimic
    const copy: Expense = { ...original, id: createId(), date: todayISO() };
    return [copy, ...prev];
  });
}

// ...în JSX:
<ExpenseList
  expenses={visibleExpenses}
  currency={currency}
  onDelete={deleteExpense}
  onDuplicate={duplicateExpense}
/>
```

**Fișier:** `src/components/ExpenseList.tsx`

```tsx
interface ExpenseListProps {
  expenses: Expense[];
  currency: Currency;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void; // ← nou
}

export function ExpenseList({ expenses, currency, onDelete, onDuplicate }: ExpenseListProps) {
  // ...
  <ExpenseItem
    key={expense.id}
    expense={expense}
    currency={currency}
    onDelete={onDelete}
    onDuplicate={onDuplicate}
  />
}
```

**Fișier:** `src/components/ExpenseItem.tsx`

```tsx
interface ExpenseItemProps {
  expense: Expense;
  currency: Currency;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void; // ← nou
}

export function ExpenseItem({ expense, currency, onDelete, onDuplicate }: ExpenseItemProps) {
  // ...înainte de butonul de ștergere:
  <button
    className="btn-icon"
    onClick={() => onDuplicate(expense.id)}
    aria-label={`Duplicate ${expense.title}`}
    title="Duplicate"
  >
    ⧉
  </button>
}
```

**De reținut:** `{ ...original, id: ..., date: ... }` copiază toate câmpurile și le înlocuiește doar pe cele scrise după. Asta se numește *prop drilling*: funcția coboară două niveluri. La proiecte mai mari vom folosi Context sau Zustand.

---

## Soluția 4: „Reset filters”

**Fișier:** `src/App.tsx`, după calculul lui `biggest`:

```tsx
const filtersActive =
  filters.search !== DEFAULT_FILTERS.search ||
  filters.category !== DEFAULT_FILTERS.category ||
  filters.month !== DEFAULT_FILTERS.month ||
  filters.sort !== DEFAULT_FILTERS.sort;
```

În JSX, în `list-head`. Punem butoanele într-un `div`, ca să stea grupate în dreapta:

```tsx
<div className="list-head">
  <h2>Expenses</h2>
  <div className="list-actions">
    {filtersActive && (
      <button className="btn-ghost" onClick={() => setFilters(DEFAULT_FILTERS)}>
        Reset filters
      </button>
    )}
    {expenses.length > 0 && (
      <button className="btn-ghost" onClick={clearAll}>
        Clear all
      </button>
    )}
  </div>
</div>
```

**Fișier:** `src/index.css`

```css
.list-actions { display: flex; gap: 0.5rem; }
```

**Variantă mai scurtă (și ea corectă):** `const filtersActive = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);`. Merge, dar depinde de ordinea câmpurilor, așa că varianta explicită e mai sigură.

---

## Soluția 5: filtre salvate + titlul paginii

**Fișier:** `src/App.tsx`

**a)** Un singur rând schimbat:

```tsx
// înainte:
const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
// după:
const [filters, setFilters] = useLocalStorage<Filters>('spendly:filters', DEFAULT_FILTERS);
```

**b)** Importul devine `import { useEffect, useMemo } from 'react';` (`useState` nu mai e folosit). Apoi, după ce e calculat `total`:

```tsx
import { formatMoney } from './utils/format';

useEffect(() => {
  document.title = `${formatMoney(total, currency)} · Spendly`;
}, [total, currency]);
```

**De reținut:** asta e puterea unui hook propriu. Ai scris logica o dată și acum o folosești de 3 ori, fiecare cu o linie. `document.title` e „în afara” React-ului, deci locul lui e într-un `useEffect`.

---

## Soluția 6: „Export CSV”

**Fișier nou:** `src/utils/csv.ts`

```ts
import type { Expense } from '../types';

// Puts a value in quotes and doubles any quotes inside it (CSV rule).
function escapeCsv(value: string | number): string {
  return `"${String(value).replace(/"/g, '""')}"`;
}

export function exportToCsv(expenses: Expense[], fileName = 'expenses.csv'): void {
  const header = ['Date', 'Title', 'Category', 'Amount'];
  const rows = expenses.map((e) => [e.date, e.title, e.category, e.amount.toFixed(2)]);

  const csv = [header, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url); // eliberează memoria
}
```

**Fișier:** `src/App.tsx`

```tsx
import { exportToCsv } from './utils/csv';

// în .list-actions, lângă celelalte butoane:
{visibleExpenses.length > 0 && (
  <button className="btn-ghost" onClick={() => exportToCsv(visibleExpenses)}>
    Export CSV
  </button>
)}
```

**Bonus pentru Excel cu diacritice:** pune `'\uFEFF' + csv` în `Blob`, ca Excel să recunoască UTF-8.

---

## După ce termini toate exercițiile

```bash
npm run build   # trebuie să treacă fără erori
git add .
git commit -m "feat: add education category, duplicate, reset filters and CSV export"
```

Apoi scrie-mi și verific împreună codul tău.

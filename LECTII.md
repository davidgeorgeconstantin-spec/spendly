# Lecții: Proiectul 1, Spendly (tracker de cheltuieli)

**6 seri, câte 2–3 ore fiecare.** Fiecare lecție are:

1. **Concepte:** explicația pe înțeles.
2. **Unde e în cod:** fișierul și rândurile exacte.
3. **Încearcă:** mici experimente.
4. **Exercițiu:** îl faci singur, cu indicii. Soluția e în `SOLUTII.md`, dar uită-te în ea doar după ce încerci!

> **Sfat:** ține două ferestre deschise, cu codul în stânga și browserul în dreapta. Când schimbi ceva în cod și salvezi, pagina se actualizează singură.

---

## Pregătire (o singură dată)

Ai nevoie de **Node.js 20+** și de **VS Code** (sau Cursor).

```bash
cd 01-expense-tracker
npm install      # descarcă pachetele (React, TypeScript, Vite)
npm run dev      # pornește aplicația la http://localhost:5173
```

Alte comenzi utile:

| Comandă | Ce face |
|---|---|
| `npm run build` | verifică tipurile TypeScript și face versiunea finală în folderul `dist/` |
| `npm run preview` | pornește versiunea finală, ca s-o vezi înainte de publicare |
| `npm run lint` | caută greșeli frecvente în cod |

Structura proiectului:

```
src/
├── main.tsx                 ← punctul de pornire: pune <App /> în pagină
├── App.tsx                  ← componenta principală: ține datele și le împarte
├── types.ts                 ← tipurile TypeScript (cum arată o cheltuială etc.)
├── index.css                ← tot designul
├── components/
│   ├── Header.tsx           ← titlul și alegerea monedei
│   ├── SummaryCards.tsx     ← cardurile cu total, medie etc.
│   ├── ExpenseForm.tsx      ← formularul de adăugare
│   ├── FilterBar.tsx        ← căutare, filtre, sortare
│   ├── ExpenseList.tsx      ← lista de cheltuieli
│   ├── ExpenseItem.tsx      ← un singur rând din listă
│   └── CategoryBreakdown.tsx← barele pe categorii
├── hooks/useLocalStorage.ts ← hook propriu: salvează datele în browser
├── utils/format.ts          ← funcții ajutătoare (formatare bani, dată)
└── data/sample.ts           ← date de exemplu la prima pornire
```

---

## Lecția 1: componente, JSX, props și tipuri TypeScript

### Concepte

**1. Componenta** e o funcție care returnează o bucată de interfață. Numele începe mereu cu literă mare.

```tsx
function Salut() {
  return <h1>Salut, David!</h1>;
}
```

Gândește-te la componente ca la piese LEGO: `App` e construită din `Header`, `SummaryCards`, `ExpenseForm` și așa mai departe. Fiecare piesă face un singur lucru.

**2. JSX** e HTML scris în JavaScript, cu câteva diferențe:

- `class` devine `className`.
- Între acolade `{ }` pui cod JavaScript: `{expense.title}`, `{2 + 2}`.
- `style` primește un obiect: `style={{ color: 'red' }}`.
- Orice tag trebuie închis: `<input />`, `<br />`.

**3. Props** sunt datele pe care o componentă-părinte le trimite unei componente-copil, ca atributele în HTML.

```tsx
<Card label="Total spent" value="RON 2,184.05" accent />
```

Copilul le primește ca parametru (de obicei „desfăcute” cu `{ }`):

```tsx
function Card({ label, value, accent = false }: CardProps) { ... }
```

Props-urile sunt **doar pentru citire**: copilul nu le modifică niciodată.

**4. Tipuri TypeScript.** TypeScript e JavaScript cu tipuri. Îți spune **înainte să rulezi** că ai greșit ceva, de exemplu că ai trimis un text unde trebuia un număr.

- `interface`: descrie forma unui obiect.

  ```ts
  interface Expense {
    id: string;
    title: string;
    amount: number;
    category: Category;
    date: string;
  }
  ```

- `type` cu **uniune** (`|`): o valoare poate fi doar una din listă.

  ```ts
  type Currency = 'RON' | 'EUR' | 'USD';
  ```

  Dacă scrii `'GBP'`, TypeScript îți arată imediat eroare.

- `?` înseamnă **opțional**: `accent?: boolean`, deci prop-ul poate lipsi.

- **Funcții ca props:** `onCurrencyChange: (currency: Currency) => void` înseamnă „o funcție care primește o monedă și nu returnează nimic”. Așa „vorbește” copilul cu părintele.

### Unde e în cod

| Ce | Fișier | Rânduri |
|---|---|---|
| Tipul `Category` (uniune) | `src/types.ts` | 3–10 |
| Interfața `Expense` | `src/types.ts` | 12–18 |
| `Currency`, `SortOption`, `Filters` | `src/types.ts` | 20–29 |
| Lista `CATEGORIES` (etichete, emoji, culori) | `src/types.ts` | 31–39 |
| Componenta `Card`, cu prop opțional `accent` | `src/components/SummaryCards.tsx` | 12–25 |
| `SummaryCards` folosește `Card` de 4 ori | `src/components/SummaryCards.tsx` | 27–36 |
| `HeaderProps`: o funcție trimisă ca prop | `src/components/Header.tsx` | 3–6 și 23 |
| `App` trimite props către copii | `src/App.tsx` | 74 și 76 |

### Încearcă

1. În `App.tsx`, rândul 76, schimbă `currency={currency}` în `currency="GBP"`. Vezi ce eroare îți arată TypeScript în editor, apoi pune codul înapoi.
2. În `SummaryCards.tsx`, șterge `accent` de la primul `<Card ... />`. Primul card nu mai e mov. Ai înțeles ce face un prop opțional.
3. În `Header.tsx`, schimbă textul „Track your expenses…”.

### Exercițiu 1: adaugă categoria „Education” 📚

Vrei o categorie nouă, **Education**, cu emoji 📚 și o culoare la alegere. Trebuie să apară în formular, în filtre și în graficul pe categorii.

**Indicii:**

- Ai nevoie să schimbi **un singur fișier**: `src/types.ts`.
- Mai întâi adaugă valoarea în tipul-uniune `Category`.
- Apoi adaugă un obiect în lista `CATEGORIES`, la fel ca celelalte.
- Observă că dacă adaugi obiectul în listă **fără** să schimbi tipul, TypeScript îți arată eroare. Asta e protecția pe care o oferă!
- Verifică: adaugă o cheltuială „Curs online” la Education și uită-te la grafic.

---

## Lecția 2: state (`useState`), formulare și evenimente

### Concepte

**1. State-ul** e „memoria” unei componente. Când state-ul se schimbă, React **redesenează** automat componenta.

```tsx
const [title, setTitle] = useState('');
//     ↑ valoarea  ↑ funcția care o schimbă   ↑ valoarea de start
```

- Nu modifici niciodată direct (`title = 'x'` e greșit). Folosești mereu `setTitle('x')`.
- TypeScript ghicește tipul din valoarea de start. Când nu poate, i-l spui tu: `useState<Category>('food')` sau `useState<string | null>(null)`.

**2. Input controlat:** valoarea câmpului vine din state, iar fiecare tastă actualizează state-ul.

```tsx
<input value={title} onChange={(e) => setTitle(e.target.value)} />
```

Așa React știe mereu ce e scris în formular.

**3. Evenimente:** `onClick`, `onChange`, `onSubmit`. Le dai o funcție. Atenție: scrii `onClick={handleClick}`, nu `onClick={handleClick()}`, pentru că varianta a doua o apelează imediat.

**4. Trimiterea formularului:** `e.preventDefault()` oprește browserul să reîncarce pagina (comportamentul vechi din HTML/PHP).

**5. Validare:** verifici datele înainte să le folosești și afișezi un mesaj de eroare dacă e cazul.

**6. Randare condiționată:** `{error && <p>{error}</p>}` afișează paragraful doar dacă există o eroare.

### Unde e în cod

| Ce | Fișier | Rânduri |
|---|---|---|
| 5 bucăți de state pentru formular | `src/components/ExpenseForm.tsx` | 11–15 |
| `handleSubmit` + `preventDefault` | `src/components/ExpenseForm.tsx` | 17–36 |
| Validarea (titlu gol, sumă invalidă) | `src/components/ExpenseForm.tsx` | 20–28 |
| Trimite cheltuiala către părinte cu `onAdd(...)` | `src/components/ExpenseForm.tsx` | 30 |
| Resetarea formularului | `src/components/ExpenseForm.tsx` | 33–35 |
| Input controlat (titlul) | `src/components/ExpenseForm.tsx` | 43–49 |
| Mesajul de eroare (randare condiționată) | `src/components/ExpenseForm.tsx` | 82 |

### Încearcă

1. Apasă „Add expense” cu formularul gol și citește mesajul de eroare.
2. Adaugă temporar `console.log(title)` în `onChange` și deschide consola browserului (F12). Vezi cum se schimbă state-ul la fiecare tastă.
3. Schimbă categoria de start din `'food'` în `'fun'`.

### Exercițiu 2: limită de 40 de caractere pentru titlu, cu contor

Sub câmpul **Title** afișează un contor de forma `12/40`. Titlul nu are voie să treacă de 40 de caractere. Bonus: contorul devine roșu când ajungi la 40.

**Indicii:**

- Fă o constantă `const MAX_TITLE = 40;` deasupra componentei.
- Ai deja lungimea textului: `title.length`.
- Inputul HTML are atributul `maxLength`.
- Contorul e un simplu `<small>{...}/{...}</small>` pus sub input.
- Pentru culoare: dă-i o clasă diferită când `title.length >= MAX_TITLE` și adaug-o în `index.css`.
- Adaugă și o regulă de validare în `handleSubmit`, ca siguranță.

---

## Lecția 3: liste, `key`, „ridicarea state-ului” și imutabilitate

### Concepte

**1. Liste:** transformi un array de date într-un array de componente cu `.map()`:

```tsx
{expenses.map((expense) => (
  <ExpenseItem key={expense.id} expense={expense} ... />
))}
```

**2. `key`** e un identificator unic pentru fiecare element. React îl folosește ca să știe ce element s-a adăugat, s-a mutat sau s-a șters. Folosește un **id**, nu poziția (`index`).

**3. Ridicarea state-ului (*lifting state up*):** lista de cheltuieli e folosită de formular, listă, carduri și grafic. De aceea stă în **părintele comun**, `App`. Datele **coboară** prin props, iar acțiunile **urcă** prin funcții (`onAdd`, `onDelete`).

```
App (ține expenses)
 ├── ExpenseForm   ── onAdd(expense) ──▶ App adaugă
 ├── ExpenseList   ◀── expenses (props)
 │    └── ExpenseItem ── onDelete(id) ──▶ App șterge
 └── SummaryCards  ◀── total, count...
```

**4. Imutabilitate:** nu modifici array-ul vechi, ci creezi unul nou. Așa React își dă seama că s-a schimbat ceva.

```ts
// adăugare: array nou = elementul nou + toate cele vechi
setExpenses((prev) => [expense, ...prev]);
// ștergere: array nou fără elementul cu id-ul dat
setExpenses((prev) => prev.filter((e) => e.id !== id));
```

`prev => ...` (forma cu funcție) îți dă mereu valoarea cea mai nouă a state-ului.

**5. Randare condiționată cu `return`:** dacă lista e goală, `ExpenseList` returnează direct un mesaj prietenos.

### Unde e în cod

| Ce | Fișier | Rânduri |
|---|---|---|
| `addExpense` (imutabil, cu `...prev`) | `src/App.tsx` | 21–24 |
| `deleteExpense` (cu `.filter`) | `src/App.tsx` | 26–28 |
| `clearAll` (cu confirmare) | `src/App.tsx` | 30–34 |
| Mesaj pentru lista goală | `src/components/ExpenseList.tsx` | 12–20 |
| `.map()` + `key` | `src/components/ExpenseList.tsx` | 23–26 |
| Butonul de ștergere apelează `onDelete(expense.id)` | `src/components/ExpenseItem.tsx` | butonul `btn-icon` |
| Stil dinamic (culoarea categoriei) | `src/components/ExpenseItem.tsx` | `style={{ ... }}` |

### Încearcă

1. Șterge `key={expense.id}` și uită-te în consolă la avertismentul lui React. Apoi pune-l la loc.
2. În `addExpense`, schimbă `[expense, ...prev]` în `[...prev, expense]`. Unde apare acum cheltuiala nouă? (Indiciu: sortarea „Newest first” o mută oricum după dată.)

### Exercițiu 3: buton „Duplicate” pe fiecare cheltuială

Pe fiecare rând pune un buton ⧉. La apăsare se creează o **copie** a cheltuielii, cu **id nou** și data de **azi**. E util pentru cheltuieli care se repetă, de exemplu abonamentul de autobuz.

**Indicii:**

- Urmează exact drumul lui `onDelete`: `App` → `ExpenseList` → `ExpenseItem`.
- În `App`, scrie `duplicateExpense(id: string)`. Găsește originalul cu `prev.find(...)`, apoi creează copia cu `{ ...original, id: createId(), date: todayISO() }`.
- `createId` și `todayISO` există deja în `src/utils/format.ts`.
- Adaugă `onDuplicate: (id: string) => void;` în interfețele de props ale ambelor componente. TypeScript îți arată unde ai uitat să-l trimiți.

---

## Lecția 4: date derivate, filtre, sortare și `useMemo`

### Concepte

**1. Date derivate:** nu salvezi în state ce poți **calcula** din alt state. Totalul, media și lista filtrată se calculează din `expenses` + `filters`. Dacă le-ai salva separat, ar putea să se „desincronizeze”.

**2. Metode de array** pe care le vei folosi zilnic la job:

- `.filter()` păstrează doar elementele care trec un test.
- `.map()` transformă fiecare element.
- `.reduce()` adună totul într-o singură valoare (de exemplu totalul).
- `.sort()` sortează. **Atenție:** modifică array-ul original, de aceea facem întâi o copie cu `[...filtered]`.
- `.some()`, `.find()`, `.includes()`.

**3. `useMemo`** ține minte rezultatul unui calcul și îl refolosește până se schimbă una dintre dependențe:

```ts
const visibleExpenses = useMemo(() => { /* filtrare + sortare */ }, [expenses, filters]);
```

**4. Un singur obiect de state pentru filtre**, actualizat cu *spread*:

```ts
onChange({ ...filters, [key]: value });  // copiază tot și schimbă doar un câmp
```

**5. Generice TypeScript (introducere):** `update<K extends keyof Filters>(key: K, value: Filters[K])` înseamnă că `key` poate fi doar un nume de câmp din `Filters`, iar `value` trebuie să aibă tipul acelui câmp. Dacă scrii `update('sort', 'abc')`, primești eroare.

**6. `switch`** pentru alegerea modului de sortare.

### Unde e în cod

| Ce | Fișier | Rânduri |
|---|---|---|
| State-ul pentru filtre + valorile implicite | `src/App.tsx` | 12 și 19 |
| Lista lunilor (fără dubluri, cu `Set`) | `src/App.tsx` | 37–40 |
| Filtrare + sortare cu `useMemo` | `src/App.tsx` | 42–65 |
| Total, număr, medie, maxim (derivate) | `src/App.tsx` | 67–70 |
| Funcția generică `update` | `src/components/FilterBar.tsx` | 12–14 |
| Calcul procente pe categorii | `src/components/CategoryBreakdown.tsx` | 12–19 |

### Încearcă

1. Filtrează după „Food”. Observă că și cardurile și graficul se schimbă, pentru că folosesc `visibleExpenses`.
2. Adaugă `console.log('recalculez')` în `useMemo` și vezi când rulează.

### Exercițiu 4: buton „Reset filters”

Lângă titlul **Expenses** apare un buton **Reset filters**, dar **doar** când cel puțin un filtru e diferit de valoarea implicită. La apăsare, filtrele revin la valorile de start.

**Indicii:**

- Valorile implicite sunt deja în `DEFAULT_FILTERS` (rândul 12 din `App.tsx`).
- Calculează o variabilă derivată `filtersActive` (de tip `boolean`), comparând fiecare câmp din `filters` cu `DEFAULT_FILTERS`.
- Folosește randare condiționată: `{filtersActive && <button ...>}`.
- Pentru stil, refolosește clasa `btn-ghost`.

---

## Lecția 5: `useEffect`, `localStorage` și hook-uri proprii

### Concepte

**1. `useEffect`** rulează cod **după** ce componenta apare pe ecran. Îl folosești pentru lucruri „din afara” React-ului: `localStorage`, titlul paginii, cereri către un API, timere.

```ts
useEffect(() => {
  // cod care rulează după randare
}, [dependente]);
```

- `[]` înseamnă că rulează o singură dată, la pornire.
- `[value]` înseamnă că rulează la pornire și de fiecare dată când se schimbă `value`.
- Fără array, rulează după **fiecare** randare (de obicei greșit).

**2. `localStorage`:** un mic „sertar” în browser, unde datele rămân și după refresh. Salvează doar text, de aceea folosim:

- `JSON.stringify(obiect)` → text, la salvare
- `JSON.parse(text)` → obiect, la citire

**3. Inițializare leneșă (*lazy*):** `useState(() => ...)` rulează funcția **doar o dată**, la prima randare. Așa nu citim `localStorage` la fiecare tastă.

**4. Hook propriu (*custom hook*):** o funcție care începe cu `use` și folosește alte hook-uri. Împachetezi logica o dată și o refolosești oriunde:

```ts
const [currency, setCurrency] = useLocalStorage<Currency>('spendly:currency', 'RON');
```

Se folosește exact ca `useState`, dar datele se și salvează.

**5. Generice (`<T>`):** `useLocalStorage<T>` funcționează pentru orice tip, fie `Expense[]`, fie `Currency`. `T` e un „tip-variabilă”.

**6. `try / catch`:** dacă datele salvate sunt stricate, nu crapă aplicația, ci folosim valoarea de start.

**7. `as const`:** returnează `[value, setValue]` ca **tuplu** (exact 2 elemente cu tipuri fixe), nu ca array oarecare.

### Unde e în cod

| Ce | Fișier | Rânduri |
|---|---|---|
| Hook-ul generic `useLocalStorage<T>` | `src/hooks/useLocalStorage.ts` | 7–24 |
| Inițializare leneșă + `try/catch` | `src/hooks/useLocalStorage.ts` | 9–16 |
| `useEffect` care salvează la fiecare schimbare | `src/hooks/useLocalStorage.ts` | 19–21 |
| Folosirea hook-ului pentru cheltuieli și monedă | `src/App.tsx` | 16–17 |

### Încearcă

1. Adaugă o cheltuială și dă refresh: ea rămâne.
2. Deschide F12 → *Application* → *Local Storage* și vezi cheia `spendly:expenses`.
3. Șterge cheia din F12 și dă refresh. Revin datele de exemplu.

### Exercițiu 5: salvează și filtrele + titlul paginii cu totalul

**a)** Filtrele să rămână alese și după refresh.
**b)** Titlul tab-ului din browser să arate totalul, de exemplu `RON 2,184.05 · Spendly`.

**Indicii:**

- **a)** E o schimbare de **un singur rând** în `App.tsx`: înlocuiești `useState` cu hook-ul tău, cu o cheie nouă (de exemplu `'spendly:filters'`). Dacă nu mai folosești `useState` în fișier, scoate-l din `import`.
- **b)** Ai nevoie de un `useEffect` în `App` care setează `document.title`. La ce valori trebuie să „asculte”? (La total și la monedă.) Pentru formatare ai deja `formatMoney` în `utils/format.ts`.
- Pune `useEffect`-ul **după** ce e calculat `total`.

---

## Lecția 6: build, export CSV, Git și pregătirea pentru publicare

### Concepte

**1. `npm run build`** face două lucruri:

- `tsc -b` verifică **toate** tipurile. Dacă ai o eroare TypeScript, build-ul se oprește.
- `vite build` creează în `dist/` fișiere mici și optimizate, gata de pus pe internet.

**2. `base: './'`** în `vite.config.ts`: căile devin relative, ca site-ul să meargă și pe GitHub Pages, într-un sub-folder.

**3. Lucrul cu fișiere în browser:** `Blob` (un fișier creat în memorie) și `URL.createObjectURL` (un link temporar către el). Așa poți oferi un download fără server.

**4. Git, pașii de bază** (doar local, nu publicăm încă):

```bash
git init
git add .
git commit -m "feat: expense tracker with filters and localStorage"
```

Mesaje bune de commit, în engleză: `feat: ...` (funcție nouă), `fix: ...` (reparație), `style: ...` (design), `docs: ...` (documentație).

**5. README în engleză:** e „vitrina” proiectului pe GitHub. Angajatorii citesc README-ul înainte de cod.

### Unde e în cod

| Ce | Fișier |
|---|---|
| Configurarea Vite (`base: './'`) | `vite.config.ts` |
| Scripturile `dev`, `build`, `preview` | `package.json` |
| Ce nu urcăm pe GitHub (`node_modules`, `dist`) | `.gitignore` |
| README-ul pentru GitHub | `README.md` |

### Încearcă

1. Rulează `npm run build`, apoi `npm run preview` și deschide linkul.
2. Introdu intenționat o greșeală de tip (de exemplu `amount: 'abc'` în `data/sample.ts`) și rulează `npm run build`. Vezi că se oprește. Apoi repară.

### Exercițiu 6: buton „Export CSV”

Adaugă un buton **Export CSV** care descarcă cheltuielile **vizibile** (după filtre) într-un fișier `expenses.csv`, cu coloanele Date, Title, Category, Amount. Fișierul trebuie să se deschidă corect în Excel.

**Indicii:**

- Creează `src/utils/csv.ts` cu o funcție `exportToCsv(expenses: Expense[])`.
- Construiește un array de rânduri: întâi capul de tabel, apoi câte un rând pentru fiecare cheltuială (`.map`).
- Fiecare valoare se pune între ghilimele `"..."`, iar ghilimelele din interior se dublează (`"` devine `""`). Așa o virgulă din titlu nu strică coloanele.
- Unești valorile cu `,` și rândurile cu `\n`.
- Pentru download: `new Blob([csv], { type: 'text/csv' })` → `URL.createObjectURL(blob)` → creezi un `<a>` cu `href` și `download`, apoi îi dai `.click()`.
- Butonul îl pui în `App.tsx`, lângă „Clear all”, și îi dai `visibleExpenses`.

---

## După proiect: verifică-te singur

Dacă poți răspunde la acestea cu cuvintele tale (în română, apoi încearcă în engleză), ai terminat cu adevărat proiectul 1:

1. Ce diferență e între **props** și **state**?
2. De ce trebuie `key` într-o listă?
3. De ce nu facem `expenses.push(nou)`?
4. Când rulează un `useEffect` cu `[]`? Dar cu `[value]`?
5. De ce totalul **nu** e salvat în state?
6. Ce face `useMemo`?
7. Ce e un hook propriu și de ce începe cu `use`?
8. Ce diferență e între `interface` și un `type` cu uniune?

**Următorul pas:** README-ul îl completăm împreună cu screenshot, apoi publicăm pe GitHub + GitHub Pages (doar cu acordul tău) și trecem la **Proiectul 2: SkyCast**.

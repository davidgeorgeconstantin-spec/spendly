import type { Currency } from '../types';

interface HeaderProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export function Header({ currency, onCurrencyChange }: HeaderProps) {
  return (
    <header className="header">
      <div className="brand">
        <span className="brand-logo" aria-hidden="true">S</span>
        <div>
          <h1>Spendly</h1>
          <p className="muted">Track your expenses. Stay in control.</p>
        </div>
      </div>

      <label className="currency">
        <span className="sr-only">Currency</span>
        <select
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value as Currency)}
        >
          <option value="RON">RON (lei)</option>
          <option value="EUR">EUR (€)</option>
          <option value="USD">USD ($)</option>
        </select>
      </label>
    </header>
  );
}

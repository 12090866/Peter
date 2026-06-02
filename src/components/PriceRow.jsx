import { formatCurrency, formatNumber } from '../utils/format';

export default function PriceRow({
  label,
  value,
  unit = '',
  formula = '',
  showFormula = false,
  highlight = false,
  isCurrency = false,
}) {
  const displayValue = isCurrency
    ? formatCurrency(value)
    : typeof value === 'number'
      ? formatNumber(value, Number.isInteger(value) ? 0 : 2)
      : value;

  return (
    <div className={`price-row ${highlight ? 'price-row-highlight' : ''}`}>
      <div className="price-row-main">
        <span className="price-row-label">{label}</span>
        <span className="price-row-value">
          {displayValue}
          {unit && <span className="price-row-unit"> {unit}</span>}
        </span>
      </div>
      {showFormula && formula && <div className="price-row-formula">{formula}</div>}
    </div>
  );
}

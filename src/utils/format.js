export function formatCurrency(amount, showPrefix = true, decimals = 0) {
  const value = Number.isFinite(Number(amount)) ? Number(amount) : 0;
  const formatted = value.toLocaleString('zh-TW', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return showPrefix ? `NT$ ${formatted}` : formatted;
}

export function formatNumber(value, decimals = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '-';

  return number.toLocaleString('zh-TW', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatDate(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}/${m}/${d}`;
}

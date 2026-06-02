export function getBillingKiloRuns(runs) {
  return Math.max(1, Number(runs) / 1000);
}

export function roundToInt(value) {
  return Math.round(Number(value) || 0);
}

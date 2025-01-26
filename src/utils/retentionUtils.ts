/**
 * Calculate expiry date based on years from index date
 */
export function calculateExpiryDate(indexDate: Date, years: number): Date {
  const expiryDate = new Date(indexDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + years);
  return expiryDate;
}

/**
 * Format retention period for display
 */
export function formatRetentionPeriod(years: number): string {
  if (years === 1) return '1 year';
  return `${years} years`;
}

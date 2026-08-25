export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatCurrencyFromCents(cents: number): string {
  return new Intl.NumberFormat('en-us', {
    style: 'currency',
    currency: 'usd',
  }).format(cents / 100);
}

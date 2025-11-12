/**
 * Get current day key in format YYYY-MM-DD for a specific timezone
 * @param tz - Timezone string (default: 'Europe/Lisbon')
 * @returns Date string in format YYYY-MM-DD
 */
export function getDayKey(tz: string = 'Europe/Lisbon'): string {
  const now = new Date();
  
  // Get timezone offset in minutes
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  
  const parts = formatter.formatToParts(now);
  const year = parts.find(p => p.type === 'year')?.value || '';
  const month = parts.find(p => p.type === 'month')?.value || '';
  const day = parts.find(p => p.type === 'day')?.value || '';
  
  return `${year}-${month}-${day}`;
}

/**
 * Simple djb2 hash function
 * @param str - String to hash
 * @returns Non-negative integer hash
 */
export function hashStr(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  // Ensure non-negative
  return Math.abs(hash);
}

/**
 * Get today's date as YYYY-MM-DD in LOCAL timezone (not UTC).
 * Using toISOString() returns UTC which can be wrong near midnight in BST/other timezones.
 */
export function getLocalDateStr(date?: Date): string {
  const d = date || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get the start of the current week (Sunday) as YYYY-MM-DD in local timezone.
 * Workouts run Sunday-to-Sunday.
 */
export function getWeekStartStr(date?: Date): string {
  const d = date || new Date();
  const dayOfWeek = d.getDay(); // 0 = Sunday
  const sunday = new Date(d);
  sunday.setDate(d.getDate() - dayOfWeek);
  return getLocalDateStr(sunday);
}

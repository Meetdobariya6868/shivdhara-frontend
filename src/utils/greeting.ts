/**
 * Returns a time-of-day greeting for the given hour (defaults to now).
 * Pure and hour-injectable so it can be unit-tested deterministically.
 */
export function getGreeting(hour: number = new Date().getHours()): string {
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

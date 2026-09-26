import site from '../data/site.json';

const MS_PER_DAY = 86_400_000;

/** Calendar date (YYYY-MM-DD) today in Africa/Juba, as a UTC-midnight timestamp. */
export function jubaToday(now: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: site.commitment.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  return Date.parse(`${parts}T00:00:00Z`);
}

export type DayState =
  | { kind: 'before' }
  | { kind: 'during'; day: number; daysToGo: number; percent: number }
  | { kind: 'after' };

/** Day 1 is 21 September 2026; Day 3,000 is 7 December 2034 (Juba time). */
export function commitmentDay(now: Date = new Date()): DayState {
  const start = Date.parse(`${site.commitment.start}T00:00:00Z`);
  const total = site.commitment.totalDays;
  const day = Math.floor((jubaToday(now) - start) / MS_PER_DAY) + 1;
  if (day < 1) return { kind: 'before' };
  if (day > total) return { kind: 'after' };
  return { kind: 'during', day, daysToGo: total - day, percent: (day / total) * 100 };
}

export const fmt = (n: number) => n.toLocaleString('en-GB');

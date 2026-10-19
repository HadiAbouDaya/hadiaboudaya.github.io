/** Calendar dates are editorial values, not timestamps in a visitor's timezone. */
export function parseDate(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`Expected a YYYY-MM-DD calendar date, received ${JSON.stringify(value)}`);
  }
  const date = new Date(`${value}T12:00:00.000Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`Invalid calendar date: ${value}`);
  }
  return date;
}

export function parseMonth(value: string): Date {
  if (!/^\d{4}-\d{2}$/.test(value)) {
    throw new Error(`Expected a YYYY-MM calendar month, received ${JSON.stringify(value)}`);
  }
  return parseDate(`${value}-01`);
}

export function formatDate(value: string, options: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric", month: "long", day: "numeric", ...options, timeZone: "UTC",
  }).format(parseDate(value));
}

export function formatMonth(value: string, options: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric", month: "short", ...options, timeZone: "UTC",
  }).format(parseMonth(value));
}

/** An omitted end is a single month, never an inferred current engagement. */
export function formatMonthPeriod(start: string, end?: string): string {
  const first = parseMonth(start);
  if (!end || start === end) return formatMonth(start);
  const last = parseMonth(end);
  if (last < first) throw new Error(`Period ends before it starts: ${start} to ${end}`);
  return `${formatMonth(start)} – ${formatMonth(end)}`;
}

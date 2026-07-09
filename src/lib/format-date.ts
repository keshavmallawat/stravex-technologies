/**
 * Deterministic date formatting for the admin panel. `toLocaleDateString()`
 * and friends read the runtime's locale/timezone, which differs between the
 * Node SSR pass and the browser — causing hydration mismatches. These use an
 * explicit locale and timezone so server and client always render identical
 * text.
 */
const LOCALE = "en-GB";
const TIME_ZONE = "Asia/Kolkata";

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  }).format(new Date(date));
}

/** Keep the editor's calendar day, regardless of server timezone. */
export function publicationDate(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value)) return undefined;
  const day = value.slice(0, 10);
  const date = new Date(`${day}T12:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== day || !Number.isFinite(Date.parse(value))) return undefined;
  return { day, label: new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date) };
}

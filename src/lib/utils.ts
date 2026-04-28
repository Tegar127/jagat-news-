import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes with clsx support */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Strip HTML tags from a string for plain text excerpts */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return ''
  // Safe server-side strip (no DOMParser)
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

/** Format a date string to Indonesian locale */
export function formatDate(
  dateString: string | null | undefined,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
): string {
  if (!dateString) return '-'
  try {
    return new Date(dateString).toLocaleDateString('id-ID', options)
  } catch {
    return '-'
  }
}

/** Format short date: 12 Jun */
export function formatShortDate(dateString: string | null | undefined): string {
  return formatDate(dateString, { day: 'numeric', month: 'short' })
}

/** Truncate text to a maximum length */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

/** Get initials from a name (e.g. "John Doe" → "JD") */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
}

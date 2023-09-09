import { formatRelativeDate } from './format-relative-date.js';

export function toString(value: string | number | string[] | null) {
  if (Array.isArray(value)) {
    return value.join(', ');
  } else if (typeof value === 'string' && Date.parse(value)) {
    return formatRelativeDate(new Date(value));
  }

  return value?.toString() ?? '';
}

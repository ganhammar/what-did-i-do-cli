import { describe, it, expect } from 'vitest';
import { formatRelativeDate } from './format-relative-date.js';

describe('format-relative-date', () => {
    const fiveSecondsAgo = new Date(new Date().getTime() - 5 * 1000);
    const fiveMinAgo = new Date(new Date().getTime() - 5 * 60000);
    const fiveHoursAgo = new Date(new Date().getTime() - 5 * 60 * 60000);
    const fiveDaysAgo = new Date(new Date().getTime() - 5 * 60 * 24 * 60000);
    const fiveWeeksAgo = new Date(new Date().getTime() - 5 * 60 * 24 * 7 * 60000);

    [
      [fiveSecondsAgo, '5 seconds ago'],
      [fiveMinAgo, '5 minutes ago'],
      [fiveHoursAgo, '5 hours ago'],
      [fiveDaysAgo, '5 days ago'],
      [fiveWeeksAgo, '5 weeks ago'],
    ].forEach(([value, expected]) => {
      it(`formats ${value} as ${expected}`, () => {
        const result = formatRelativeDate(value as Date);
        expect(result).toBe(expected);
      });
    });
});

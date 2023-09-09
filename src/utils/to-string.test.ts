import { describe, it, expect } from 'vitest';
import { toString } from './to-string.js';

describe('to-string', () => {
  const fiveMinAgo = new Date(new Date().getTime() - 5 * 60000).toISOString();

  [
    [['1', '2', '3'], '1, 2, 3'],
    ['test', 'test'],
    [fiveMinAgo, '5 minutes ago'],
    [null, ''],
    [undefined, ''],
  ].forEach(([value, expected]) => {
    it(`formats ${value} as ${
      expected !== '' ? expected : 'empty string'
    }`, () => {
      const result = toString(value as string | number | string[]);
      expect(result).toBe(expected);
    });
  });
});

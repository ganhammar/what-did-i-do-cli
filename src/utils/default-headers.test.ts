import { describe, it, expect, vi } from 'vitest';
import { getDefaultHeaders } from './default-headers.js';

vi.mock('../auth/auth.js', () => ({
  getAccessToken: () => Promise.resolve('123'),
}));

describe('default-headers', () => {
  it('adds headers as expected', async () => {
    const expected = new Headers();
    expected.append('Authorization', 'Bearer 123');
    expected.append('Content-Type', 'application/json');

    const result = await getDefaultHeaders();

    expect(result).toEqual(expected);
  });
});

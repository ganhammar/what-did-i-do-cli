import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCurrentAccount } from './get-current-account.js';

vi.mock('node-netrc', () => ({
  default: vi.fn(),
}));

// @ts-ignore
import netrc from 'node-netrc';

const updateMock = vi.fn();
netrc.update = updateMock;

vi.mock('./list.js', () => ({
  list: vi.fn(),
}));

import { list } from './list.js';

vi.mock('@inquirer/prompts', () => ({
  select: vi.fn(),
}));

import { select } from '@inquirer/prompts';

describe('get-current-account', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns account if one is already set', async () => {
    (netrc as any).mockImplementation(() => ({
      account: '123',
    }));

    const result = await getCurrentAccount();

    expect(result).toBe('123');
  });

  it('throws when list of accounts is empty', async () => {
    (netrc as any).mockImplementation(() => ({}));
    (list as any).mockResolvedValueOnce(undefined);

    await expect(() => getCurrentAccount()).rejects.toThrow(
      'Something unexpected happened, try logging in again'
    );
  });

  it('returns id of first account if there are only one', async () => {
    (netrc as any).mockImplementation(() => ({}));
    (list as any).mockResolvedValueOnce([
      {
        id: '123',
      },
    ]);

    const result = await getCurrentAccount();
    expect(result).toBe('123');
    expect(updateMock).toHaveBeenCalledOnce();
  });

  it('returns id of selected account if there are more than one', async () => {
    (netrc as any).mockImplementation(() => ({}));
    (list as any).mockResolvedValueOnce([
      {
        id: '123',
      },
      {
        id: '456',
      },
    ]);
    (select as any).mockResolvedValueOnce('456');

    const result = await getCurrentAccount();
    expect(result).toBe('456');
    expect(updateMock).toHaveBeenCalledOnce();
    expect(select as any).toHaveBeenCalledOnce();
  });
});

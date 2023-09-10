import { describe, it, expect, vi, beforeEach } from 'vitest';
import { create } from './create.js';
import chalk from 'chalk';

const fetchMock = vi.fn();
global.fetch = fetchMock;

const consoleMock = vi
  .spyOn(console, 'log')
  .mockImplementation(() => undefined);

vi.mock('../utils/default-headers.js', () => ({
  getDefaultHeaders: () => Promise.resolve({}),
}));

vi.mock('../account/get-current-account.js', () => ({
  getCurrentAccount: () => Promise.resolve('123'),
}));

describe('create', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('calls the correct endpoint and logs the result', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });
    const title = 'testing';
    const date = '2023-09-10 09:11:33';

    await create(title, { date });

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith('https://www.wdid.fyi/api/event', {
      method: 'POST',
      headers: {},
      body: JSON.stringify({
        accountId: '123',
        title,
        description: undefined,
        date: new Date(date).toISOString(),
        tags: undefined,
      }),
    });
    expect(consoleMock).toHaveBeenCalled();
    expect(consoleMock).toHaveBeenCalledWith(
      chalk.green('Event created!'),
      '\n'
    );
  });

  it('throws error when response is not ok', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
    });
    const title = 'testing';

    await expect(async () => await create(title, {})).rejects.toThrow(
      'Something unexpected happened, try logging in again'
    );

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith('https://www.wdid.fyi/api/event', {
      method: 'POST',
      headers: {},
      body: JSON.stringify({
        accountId: '123',
        title,
        description: undefined,
        date: undefined,
        tags: undefined,
      }),
    });
  });

  it('throws error when id is not valid', async () => {
    await expect(async () => await create('', {})).rejects.toThrow(
      'Title is required'
    );

    expect(fetchMock).not.toHaveBeenCalled();
  });
});

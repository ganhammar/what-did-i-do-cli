import { describe, it, expect, vi, beforeEach } from 'vitest';
import { list } from './list.js';

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

vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn(),
  },
}));

import inquirer from 'inquirer';

describe('list', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  [
    [
      { limit: '20', fromDate: '', toDate: '', tag: '' },
      'https://www.wdid.fyi/api/event?accountid=123&limit=20',
    ],
    [
      { limit: '20', fromDate: '', toDate: '', tag: 'test' },
      'https://www.wdid.fyi/api/event?accountid=123&limit=20&tag=test',
    ],
    [
      { limit: '20', fromDate: '2023-09-10 10:00:00', toDate: '', tag: '' },
      'https://www.wdid.fyi/api/event?accountid=123&limit=20&fromdate=2023-09-10T08:00:00.000Z',
    ],
    [
      { limit: '20', fromDate: '', toDate: '2023-09-10 10:00:00', tag: '' },
      'https://www.wdid.fyi/api/event?accountid=123&limit=20&todate=2023-09-10T08:00:00.000Z',
    ],
  ].forEach(([data, url], index) => {
    it(`calls the correct endpoint and logs the result (${index})`, async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ items: [] }),
      });

      await list(
        data as { limit: string; fromDate: string; toDate: string; tag: string }
      );

      expect(fetchMock).toHaveBeenCalledOnce();
      expect(fetchMock).toHaveBeenCalledWith(url, {
        method: 'GET',
        headers: {},
      });
      expect(consoleMock).toHaveBeenCalled();
      expect(consoleMock).toHaveBeenCalledWith(
        '\n',
        'That was all, found 0 matching events!'
      );
    });
  });

  it('prompts the user to load more items when response contains pagination token', async () => {
    const paginationToken = '123';
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          items: [
            {
              title: 'test',
              description: 'test',
              date: '2023-09-10T08:00:00.000Z',
              tags: 'test',
              id: '123',
              accountId: '456',
            },
          ],
          paginationToken,
        }),
    });
    (inquirer.prompt as any).mockResolvedValueOnce({
      shouldFetchMore: false,
    });

    await list({ limit: '20', fromDate: '', toDate: '', tag: '' });

    expect(inquirer.prompt as any).toHaveBeenCalledOnce();
    expect(consoleMock).toHaveBeenCalledWith(
      '\n',
      'Aborted listing events, found at least 1 matching events!'
    );
  });

  it('loads more items when user answers yes to the prompt', async () => {
    const paginationToken = '123';
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ items: [], paginationToken }),
    });
    (inquirer.prompt as any).mockResolvedValueOnce({
      shouldFetchMore: true,
    });
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ items: [] }),
    });

    await list({ limit: '20', fromDate: '', toDate: '', tag: '' });

    expect(inquirer.prompt as any).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(consoleMock).toHaveBeenCalledWith(
      '\n',
      'That was all, found 0 matching events!'
    );
  });

  it('throws error when response is not ok', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
    });

    await expect(
      async () => await list({ limit: '20', fromDate: '', toDate: '', tag: '' })
    ).rejects.toThrow('Something unexpected happened, try logging in again');

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://www.wdid.fyi/api/event?accountid=123&limit=20',
      {
        method: 'GET',
        headers: {},
      }
    );
  });

  it('throws error when id is not valid', async () => {
    await expect(
      async () =>
        await list({ limit: 'NaN', fromDate: '', toDate: '', tag: '' })
    ).rejects.toThrow(
      `Invalid value for limit supplied, got "NaN", it needs to be a number`
    );

    expect(fetchMock).not.toHaveBeenCalled();
  });
});

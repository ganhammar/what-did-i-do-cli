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

describe('list', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('calls the correct endpoint and logs the result', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: '1',
            name: 'test',
            createDate: '2023-09-12T18:54:01.296Z',
          },
        ]),
    });

    await list(true);

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith('https://www.wdid.fyi/api/account', {
      method: 'GET',
      headers: {},
    });
    expect(consoleMock).toHaveBeenCalled();
  });

  it('calls the correct endpoint and returns the result when print is false', async () => {
    const result = [
      {
        id: '1',
        name: 'test',
        createDate: '2023-09-12T18:54:01.296Z',
      },
    ];
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(result),
    });

    const response = await list(false);

    expect(response).toEqual(result);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith('https://www.wdid.fyi/api/account', {
      method: 'GET',
      headers: {},
    });
    expect(consoleMock).not.toHaveBeenCalled();
  });

  it('throws error when response is not ok', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
    });

    await expect(async () => await list(true)).rejects.toThrow(
      'Something unexpected happened, try logging in again'
    );

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith('https://www.wdid.fyi/api/account', {
      method: 'GET',
      headers: {},
    });
  });
});

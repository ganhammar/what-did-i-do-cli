import { describe, it, expect, vi, beforeEach } from 'vitest';
import { remove } from './delete.js';
import chalk from 'chalk';

const fetchMock = vi.fn();
global.fetch = fetchMock;

const consoleMock = vi
  .spyOn(console, 'log')
  .mockImplementation(() => undefined);

vi.mock('../utils/default-headers.js', () => ({
  getDefaultHeaders: () => Promise.resolve({}),
}));

describe('delete', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('calls the correct endpoint and logs the result', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
    });
    const id = 'testing';

    await remove(id);

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      `https://www.wdid.fyi/api/event?id=${id}`,
      {
        method: 'DELETE',
        headers: {},
      }
    );
    expect(consoleMock).toHaveBeenCalledOnce();
    expect(consoleMock).toHaveBeenCalledWith(
      chalk.green('Event was successfully deleted.')
    );
  });

  it('throws error when response is not ok', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
    });
    const id = 'testing';

    await expect(async () => await remove(id)).rejects.toThrow(
      'Something unexpected happened, try logging in again'
    );

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      `https://www.wdid.fyi/api/event?id=${id}`,
      {
        method: 'DELETE',
        headers: {},
      }
    );
  });

  it('throws error when id is not valid', async () => {
    const id = '';

    await expect(async () => await remove(id)).rejects.toThrow(
      `Invalid id supplied, got "${id}"`
    );

    expect(fetchMock).not.toHaveBeenCalled();
  });
});

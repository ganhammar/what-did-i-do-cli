import { describe, it, expect, vi } from 'vitest';
import { objectToTable } from './object-to-table.js';
import chalk from 'chalk';

const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => undefined);

describe('object-to-table', () => {
  it('formats the input as expected', () => {
    objectToTable({
      test: 'test',
    });

    expect(consoleMock).toHaveBeenCalled();
    expect(consoleMock).toHaveBeenCalledWith(`${chalk.gray('test     ')}test`);
  })
});
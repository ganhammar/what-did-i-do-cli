import { describe, it, expect, vi, beforeEach } from 'vitest';
import { arrayToTable } from './array-to-table.js';
import chalk from 'chalk';

const consoleMock = vi
  .spyOn(console, 'log')
  .mockImplementation(() => undefined);

describe('array-to-table', () => {
  beforeEach(() => {
    consoleMock.mockReset();
  });

  it('formats the input as expected', () => {
    arrayToTable([
      {
        test: 'test',
      },
    ]);

    expect(consoleMock).toHaveBeenCalledTimes(2);
    expect(consoleMock).toHaveBeenCalledWith(chalk.bold('test     '));
    expect(consoleMock).toHaveBeenCalledWith('test     ');
  });

  it('adapts the column width after the values', () => {
    arrayToTable([
      {
        test: 'testing',
      },
    ]);

    expect(consoleMock).toHaveBeenCalledTimes(2);
    expect(consoleMock).toHaveBeenCalledWith(chalk.bold('test        '));
    expect(consoleMock).toHaveBeenCalledWith('testing     ');
  });

  it('changes the header if it is included in the format input', () => {
    arrayToTable(
      [
        {
          test: 'test',
        },
      ],
      { columns: [{ key: 'test', name: 'Testing' }] }
    );

    expect(consoleMock).toHaveBeenCalledTimes(2);
    expect(consoleMock).toHaveBeenCalledWith(chalk.bold('Testing     '));
    expect(consoleMock).toHaveBeenCalledWith('test        ');
  });

  it('grays the input if it is configured to be silent', () => {
    arrayToTable(
      [
        {
          test: 'test',
        },
      ],
      { columns: [{ key: 'test', format: 'silent' }] }
    );

    expect(consoleMock).toHaveBeenCalledTimes(2);
    expect(consoleMock).toHaveBeenCalledWith(
      chalk.bold(chalk.grey('test     '))
    );
    expect(consoleMock).toHaveBeenCalledWith(chalk.grey('test     '));
  });

  it('does nothing when data is empty', () => {
    arrayToTable([]);

    expect(consoleMock).not.toHaveBeenCalled();
  });
});

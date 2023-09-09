import chalk from 'chalk';
import { toString } from './to-string.js';

const SPACE_BETWEEN_VALUES = 5;

type FormatOptions = {
  format?: 'silent' | 'none';
};

export type FormatInput = {
  columns?: {
    key: string;
    name?: string;
    format?: 'silent' | 'none';
  }[];
};

export function arrayToTable(
  data: Record<string, string | number | string[] | null>[],
  { columns }: FormatInput = {}
) {
  if (!data?.length) {
    return;
  }

  const headers = Object.keys(data[0]);
  const rows = data.map((row) => Object.values(row));
  const columnWidths = headers.map(
    (header) =>
      (columns?.find(({ key }) => key === header)?.name ?? header).length
  );

  const indexOptions = headers.map((header) => ({
    format: columns?.find(({ key }) => header === key)?.format ?? 'none',
  }));

  rows.forEach((row) => {
    row.forEach((cell, index) => {
      const width = toString(cell).length;

      if (!columnWidths[index] || columnWidths[index] < width) {
        columnWidths[index] = width;
      }
    });
  });

  console.log(
    chalk.bold(
      arrayToPaddedString(
        headers.map(
          (header) => columns?.find(({ key }) => key === header)?.name ?? header
        ),
        columnWidths,
        indexOptions
      )
    )
  );

  rows.forEach((row) => {
    console.log(arrayToPaddedString(row, columnWidths, indexOptions));
  });
}

function arrayToPaddedString(
  row: (string | number | string[] | null)[],
  columnWidths: number[],
  options: FormatOptions[]
) {
  return row
    .map((value, index) =>
      formatValue(
        toString(value).padEnd(columnWidths[index] + SPACE_BETWEEN_VALUES, ' '),
        index,
        options
      )
    )
    .join('');
}

function formatValue(
  value: string | number | string[] | null,
  index: number,
  options: FormatOptions[]
) {
  if (options[index].format === 'silent') {
    return chalk.gray(value);
  }

  return value;
}

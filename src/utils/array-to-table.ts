import chalk from 'chalk';

const SPACE_BETWEEN_VALUES = 5;

export function arrayToTable(data: Record<string, string | number | string[] | null>[]) {
  if (!data?.length) {
    return;
  }

  const headers = Object.keys(data[0]);
  const rows = data.map((row) => Object.values(row));
  const columnWidths: number[] = [];

  rows.forEach((row) => {
    row.forEach((cell, index) => {
      const width = cell?.toString().length ?? 0;

      if (!columnWidths[index] || columnWidths[index] < width) {
        columnWidths[index] = width;
      }
    });
  });

  console.log(chalk.bold(arrayToPaddedString(headers, columnWidths)));

  rows.forEach((row) => {
    console.log(arrayToPaddedString(row, columnWidths));
  });
}

function arrayToPaddedString(row: (string | number | string[] | null)[], columnWidths: number[]) {
  return row
    .map((value, index) => (value
      ?.toString() ?? '')
      .padEnd(columnWidths[index] + SPACE_BETWEEN_VALUES, ' '))
    .join('')
}
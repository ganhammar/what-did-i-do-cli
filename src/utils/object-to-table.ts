import chalk from 'chalk';
import { toString } from './to-string.js';

const EXTRA_SPACE = 5;

export function objectToTable(data: Record<string, string | number | string[] | null>) {
  let width = 0;

  Object.keys(data).forEach((key) => {
    if (key.length > width) {
      width = key.length;
    }
  });

  Object.entries(data).forEach(([key, value]) => {
    console.log(`${chalk.gray(key.padEnd(width + EXTRA_SPACE))}${toString(value)}`);
  });
}

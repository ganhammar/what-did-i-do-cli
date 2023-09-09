import chalk from 'chalk';
import { getCurrentAccount } from '../account/get-current-account.js';
import { objectToTable } from '../utils/object-to-table.js';
import { getDefaultHeaders } from '../utils/default-headers.js';

type Options = {
  description?: string;
  date?: string;
  tags?: string[];
};

export async function create(
  title: string,
  { description, date, tags }: Options
) {
  const headers = await getDefaultHeaders();
  const accountId = await getCurrentAccount();

  const eventEndpoint = 'https://www.wdid.fyi/api/event';

  const response = await fetch(eventEndpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      accountId,
      title,
      description,
      date: date ? new Date(date).toISOString() : undefined,
      tags,
    }),
  });

  if (!response.ok) {
    throw new Error('Something unexpected happened, try logging in again');
  }

  const result = await response.json();

  console.log(chalk.green('Event created!'), '\n');
  objectToTable(result);
}

import chalk from 'chalk';
import { getDefaultHeaders } from '../utils/default-headers.js';

export async function remove(id: string) {
  const headers = await getDefaultHeaders();

  if (!id) {
    throw new Error(`Invalid id supplied, got "${id}"`);
  }

  const eventEndpoint = 'https://www.wdid.fyi/api/event';

  const response = await fetch(`${eventEndpoint}?id=${id}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    throw new Error('Something unexpected happened, try logging in again');
  }

  console.log(chalk.green('Event was successfully deleted.'));
}

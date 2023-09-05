import { getCurrentAccount } from '../account/get-current-account.js';
import { getAccessToken } from '../auth/auth.js';
import { arrayToTable } from '../utils/array-to-table.js';

export type Event = {
  id: string;
  accountId: string;
  date: string;
  description: string;
  tags: string[];
  title: string;
};

export async function list() {
  const token = await getAccessToken();
  const account = await getCurrentAccount();

  const eventEndpoint = 'https://www.wdid.fyi/api/event';

  const headers = new Headers();
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Content-Type', 'application/json');

  const response = await fetch(`${eventEndpoint}?accountId=${account}&limit=20`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Something unexpected happened, try logging in again');
  }

  const events: { items: Event[] } = await response.json();

  arrayToTable(events.items);
}

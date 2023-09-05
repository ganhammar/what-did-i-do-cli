import { getAccessToken } from '../auth/auth.js';
import { arrayToTable } from '../utils/array-to-table.js';

export type Account = {
  id: string;
  name: string;
  createDate: string;
};

export async function list(print = true) {
  const token = await getAccessToken();
  const accountEndpoint = 'https://www.wdid.fyi/api/account';

  const headers = new Headers();
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Content-Type', 'application/json');

  const response = await fetch(accountEndpoint, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Something unexpected happened, try logging in again');
  }

  const result: Account[] = await response.json();

  if (print) {
    arrayToTable(result);
  } else {
    return result;
  }
}

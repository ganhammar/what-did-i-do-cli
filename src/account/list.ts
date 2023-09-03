import { getAccessToken } from '../auth/auth.js';

export async function list() {
  const token = await getAccessToken();
  const accountEndpoint = 'https://www.wdid.fyi/api/account';

  const headers = new Headers();
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Content-Type', 'application/json');

  const response = await fetch(accountEndpoint, {
    method: 'GET',
    headers,
  });

  const result = await response.json();

  console.table(result);
}

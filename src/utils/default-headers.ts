import { getAccessToken } from '../auth/auth.js';

export async function getDefaultHeaders() {
  const token = await getAccessToken();

  const headers = new Headers();
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Content-Type', 'application/json');

  return headers;
}

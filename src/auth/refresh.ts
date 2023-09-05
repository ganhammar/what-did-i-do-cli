import { AuthResponse, get, update } from './auth.js';

export async function refresh() {
  const { refreshToken } = get();

  if (!refreshToken) {
    throw new Error('RefreshToken not found');
  }

  const tokenEndpoint = 'https://www.wdid.fyi/api/login/connect/token';

  const requestBody = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: 'what-did-i-do.cli',
    scope: 'offline_access offline_access openid profile email account event',
  });

  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      body: requestBody,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      throw new Error('Unexpected response');
    }

    const data: AuthResponse = await response.json();

    update(data);
  } catch {
    throw new Error('Could not refresh the access token');
  }
}

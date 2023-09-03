// @ts-ignore
import netrc from 'node-netrc';

const HOST = 'wdid.fyi';

type Auth = {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

export function get() : Auth {
  const auth = netrc(HOST);

  return {
    accessToken: auth?.accessToken,
    refreshToken: auth?.refreshToken,
  };
}

export function accessTokenHasExpired() {
  const auth = get();

  if (!auth.expiresAt) {
    return true;
  }

  return new Date(auth.expiresAt) <= new Date();
}

export function update({ access_token, refresh_token, expires_in }: AuthResponse) {
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);

  netrc.update(HOST, {
    accessToken: access_token,
    refreshToken: refresh_token,
    expiresAt: expiresAt.toISOString(),
  });
}

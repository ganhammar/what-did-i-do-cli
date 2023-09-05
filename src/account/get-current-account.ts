// @ts-ignore
import netrc from 'node-netrc';
import { select } from '@inquirer/prompts';
import { list } from './list.js';

const HOST = 'wdid.fyi/account';

export async function getCurrentAccount() {
  let { account } = netrc(HOST);

  if (account) {
    return account;
  }

  const accounts = await list(false);

  if (!accounts) {
    throw new Error('Something unexpected happened, try logging in again');
  }

  if (accounts.length > 1) {
    account = await select({
      message: 'What account are you working with?',
      choices: accounts.map(({ id, name }) => ({
        name,
        value: id,
      })),
    });
  } else {
    account = accounts[0].id;
  }

  netrc.update(HOST, { account });
}

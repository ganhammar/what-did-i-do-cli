import { Command } from 'commander';
import { list } from './list.js';

export const account = new Command('account');

account.command('list')
  .description('List accounts')
  .action(async () => { await list() });

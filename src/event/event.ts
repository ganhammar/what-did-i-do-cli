import { Command } from 'commander';
import { list } from './list.js';

export const event = new Command('event');

event.command('list')
  .description('List events')
  .option('-f, --from-date <date>', 'from date to display events for')
  .option('-e, --to-date <date>', 'to date to display events for')
  .option('-l, --limit <number>', 'number of events to fetch', '20')
  .option('-t, --tag <string>', 'only fetch events with the given tag')
  .action(list);

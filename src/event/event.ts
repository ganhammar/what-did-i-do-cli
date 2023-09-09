import { Command } from 'commander';
import { list } from './list.js';
import { create } from './create.js';
import { remove } from './delete.js';

export const event = new Command('event');

event
  .command('list')
  .description('List events')
  .option('-f, --from-date <date>', 'from date to display events for')
  .option('-e, --to-date <date>', 'to date to display events for')
  .option('-l, --limit <number>', 'number of events to fetch', '20')
  .option('-t, --tag <string>', 'only fetch events with the given tag')
  .action(list);

event
  .command('create')
  .description('Creates a new event')
  .argument('<string>', 'The title of the event')
  .option(
    '-e, --description <string>',
    'Descriptive text to add additional context'
  )
  .option(
    '-d, --date <string>',
    'The date when the event happened or will happen'
  )
  .option('-t, --tags [string...]', 'Tags for the event')
  .action(create);

event
  .command('delete')
  .description('Deletes an event')
  .argument('<string>', 'The id of the event')
  .action(remove);

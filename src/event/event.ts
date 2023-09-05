import { Command } from 'commander';
import { list } from './list.js';

export const event = new Command('event');

event.command('list')
  .description('List events')
  .action(list);

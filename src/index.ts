import { Command } from 'commander';
import { login } from './auth/login.js';

const program = new Command();

program
  .version('0.0.1')
  .name('what-did-i-do-cli')
  .description('What Did I Do CLI - log events, to remember what you have done');

program.command('login')
  .description('Login to What Did I Do')
  .action(login);

program.parse();

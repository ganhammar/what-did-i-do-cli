import express, { Request } from 'express';
import inquirer from 'inquirer';
import { exec } from 'child_process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { AuthResponse, get, update, accessTokenHasExpired } from './auth.js';
import { refresh } from './refresh.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface AuthRequest extends Request {
  body: AuthResponse;
}

export async function login() {
  const port = 3124;
  const app = express();

  const { refreshToken } = get();

  if (refreshToken) {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldReAuthenticate',
        message: 'It seems like you\'re already logged in. Do you want to re-authenticate?',
      },
    ]);

    if (answers.shouldReAuthenticate === false) {
      if (accessTokenHasExpired()) {
        try {
          refresh();

          return;
        } catch { }
      }

      return;
    }
  }

  app.listen(port, () => {
    console.info('Complete the login in your browser...');

    const url = `http://127.0.0.1:${port}`;
    const start =
      process.platform == 'darwin'
        ? 'open'
        : process.platform == 'win32'
        ? 'start'
        : 'xdg-open';
    exec(`${start} ${url}`);
  });

  app.use(express.json());

  app.get('/', (_, res) => {
    res.sendFile(`${__dirname}/login.html`);
  });

  app.post('/', ({ body }: AuthRequest, res) => {
    update(body);

    res.sendStatus(200);

    setImmediate(() => {
      console.log('All good, you can close the browser window now.');
      process.exit(0);
    });
  });
}

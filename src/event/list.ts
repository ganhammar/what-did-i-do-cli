import inquirer from 'inquirer';
import { getCurrentAccount } from '../account/get-current-account.js';
import { FormatInput, arrayToTable } from '../utils/array-to-table.js';
import { getDefaultHeaders } from '../utils/default-headers.js';

export type Event = {
  id: string;
  accountId: string;
  date: string;
  description: string;
  tags: string[];
  title: string;
};

type Options = {
  limit: string;
  fromDate: string;
  toDate: string;
  tag: string;
};

export function list(options: Options) {
  return fetchEvents(options);
}

async function fetchEvents({ limit, fromDate, toDate, tag }: Options, paginationToken?: string, eventsFound = 0) {
  const headers = await getDefaultHeaders();
  const account = await getCurrentAccount();

  const eventEndpoint = 'https://www.wdid.fyi/api/event';

  let url = `${eventEndpoint}?accountid=${account}&limit=${limit}`;

  if (fromDate) {
    url += `&fromdate=${new Date(fromDate).toISOString()}`;
  }
  if (toDate) {
    url += `&todate=${new Date(toDate).toISOString()}`;
  }
  if (tag) {
    url += `&tag=${tag}`;
  }
  if (paginationToken) {
    url += `&paginationToken=${paginationToken}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Something unexpected happened, try logging in again');
  }

  const events: { items: Event[], paginationToken: string | null } = await response.json();
  const formatOptions: FormatInput = { columns: [
    { key: 'id', name: 'Id', format: 'silent' },
    { key: 'title', name: 'Title' },
    { key: 'description', name: 'Description' },
    { key: 'tags', name: 'Tags' },
    { key: 'date', name: 'Date' },
  ]};

  arrayToTable(events.items.map(({ title, description, date, tags, id }) =>
    ({ title, description, date, tags, id  })), formatOptions);

  const eventsFoundCurrent = eventsFound + events.items.length;

  if (events.paginationToken) {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldFetchMore',
        message: 'There are more events matching your query, do you want to load more?',
      },
    ]);

    if (answers.shouldFetchMore) {
      await fetchEvents({ limit, fromDate, toDate, tag }, events.paginationToken, eventsFoundCurrent);
    } else {
      console.log('\n', `Aborted listing events, found at least ${eventsFoundCurrent} matching events!`);
    }
  } else {
    console.log('\n', `That was all, found ${eventsFoundCurrent} matching events!`);
  }
}

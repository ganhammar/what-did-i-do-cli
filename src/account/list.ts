import { FormatInput, arrayToTable } from '../utils/array-to-table.js';
import { getDefaultHeaders } from '../utils/default-headers.js';

export type Account = {
  id: string;
  name: string;
  createDate: string;
};

export async function list(print = true) {
  const headers = await getDefaultHeaders();
  const accountEndpoint = 'https://www.wdid.fyi/api/account';

  const response = await fetch(accountEndpoint, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Something unexpected happened, try logging in again');
  }

  const result: Account[] = await response.json();
  const formatOptions: FormatInput = { columns: [
    { key: 'id', name: 'Id', format: 'silent' },
    { key: 'name', name: 'Name' },
    { key: 'createDate', name: 'Created At' },
  ]};

  if (print) {
    arrayToTable(result.map(({ id, name, createDate }) => ({ name, createDate, id })), formatOptions);
  } else {
    return result;
  }
}

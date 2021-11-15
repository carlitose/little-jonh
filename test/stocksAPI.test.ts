import { expect } from 'chai';
import { getActualPrice, getHistoryPrice } from '../lib/stocksAPI';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import fs from 'fs';
import path from 'path';

describe('stockApi', ()=>{

  const history = fs.readFileSync(path.join(__dirname, 'fixtures/v-history.json'));
  const actual = fs.readFileSync(path.join(__dirname, 'fixtures/v-actual.json'));

  const server = setupServer(
    rest.get('https://yh-finance.p.rapidapi.com/market/v2/get-quotes', (req, res, ctx) => {
      // Respond with a mocked user token that gets persisted
      // in the `sessionStorage` by the `Login` component.
      return res(ctx.body(actual));
    }),
    rest.get('https://yh-finance.p.rapidapi.com/stock/v3/get-historical-data', (req, res, ctx) => {
      // Respond with a mocked user token that gets persisted
      // in the `sessionStorage` by the `Login` component.
      return res(ctx.body(history));
    }),
  );
    // Enable API mocking before tests.

  server.listen();

  afterEach(() => server.resetHandlers());

  it('getActualPrice', async ()=>{
    const response = await getActualPrice({ key:'12345', symbol:'V' });
    expect(response).to.deep.equals({ price:213.46, symbol:'V' });
  });

  it('getHistoryPrice', async () => {
    const response = await getHistoryPrice({ key:'12345', symbol:'V' });
    expect(response).to.have.length(90);
    expect(response[0]).to.deep.equals({ price:214.46, date:'2021-11-15' });
  });
});
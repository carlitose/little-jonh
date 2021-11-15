import axios, { AxiosRequestConfig } from 'axios';
import { convertData } from './utils';

const generateOptions = (
  url: string,
  key: string,
  symbol: string,
): AxiosRequestConfig => ({
  method: 'GET',
  url,
  params: { symbol, region: 'US' },
  headers: {
    'x-rapidapi-host': 'yh-finance.p.rapidapi.com',
    'x-rapidapi-key': key,
  },
});

export const getHistoryPrice = async ({
  key,
  symbol,
}: {
  key: string;
  symbol: string;
}) => {
  const options = generateOptions(
    'https://yh-finance.p.rapidapi.com/stock/v3/get-historical-data',
    key,
    symbol,
  );
  const response = await axios.request(options);
  return [...response.data.prices.filter(({ close }: { close:number })=>close).splice(0, 90)].map((el) => convertData(el));
};

export const getActualPrice = async ({
  key,
  symbol,
}: {
  key: string;
  symbol: string;
}) => {
  const options = generateOptions(
    'https://yh-finance.p.rapidapi.com/market/v2/get-quotes',
    key,
    symbol,
  );
  const response = await axios.request(options);
  return {
    price: Number(response.data.quoteResponse.result[0].regularMarketPrice.toFixed(2)),
    symbol,
  };
};

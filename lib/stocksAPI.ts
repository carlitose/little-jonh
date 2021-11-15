import axios, { AxiosRequestConfig } from 'axios';
import { convertData, generatorPorfolio } from './utils';
import logger from 'winston';

const generateOptions = (
  url: string,
  key: string,
  symbol: string,
): AxiosRequestConfig => ({
  method: 'GET',
  url,
  params: { symbol, region: 'US', symbols:symbol },
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
  try {
    const response = await axios.request(options);
    return [...response.data.prices.filter(({ close }: { close:number })=>close).splice(0, 90)].map((el) => convertData(el));
  } catch (err){
    logger.error(err);
  }
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
  try {
    const response = await axios.request(options);
    return {
      price: Number(response.data.quoteResponse.result[0].regularMarketPrice.toFixed(2)),
      symbol,
    };
  } catch (err){
    logger.error(err);
  }
};

export const getPorfolio = async ({
  key,
  username,
}: {
  key: string;
  username: string;
})=>{
  logger.info('PIPPO', username);
  const porfolio = generatorPorfolio(username);
  logger.info(porfolio);
  const porfolioCompleted:{ price:number, symbol:string }[]  = [];
  for (let i = 0; i < porfolio.length; i++){
    logger.info({ key, symbol:porfolio[i] });
    const actualPrice = await getActualPrice({ key, symbol:porfolio[i] });
    logger.info(actualPrice);
    if (actualPrice)
      porfolioCompleted.push(actualPrice);
  }
  return porfolioCompleted;
};
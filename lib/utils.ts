import { stocks } from './consts';
import { totalmem } from 'os';

type RapidApiData = {
  date: number
  close:number
};

export const convertData = (rapidApiData:RapidApiData) => ({ date:new Date(rapidApiData.date * 1000).toISOString().split('T')[0], price:Number(rapidApiData.close.toFixed(2)) });

const selectStoks = (number : number)=> stocks[number % stocks.length];

export const generatorPorfolio = (username:string) : string[] => {
  const length = username.length;
  const porfolio = new Set<string>();
  const day = new Date().getUTCDay();
  const month = new Date().getMonth();
  porfolio.add(selectStoks(month)); 
  porfolio.add(selectStoks(day));
  porfolio.add(selectStoks(length));
  porfolio.add(selectStoks(totalmem() / (1024 * 1024) ));
  for (let i = 0; i < length; i++){
    porfolio.add(selectStoks(username.charCodeAt(i)));
  }
  return Array.from(porfolio);
};
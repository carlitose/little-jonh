type RapidApiData = {
  date: number
  close:number
};

export const convertData = (rapidApiData:RapidApiData) => ({ date:new Date(rapidApiData.date * 1000).toISOString().split('T')[0], price:Number(rapidApiData.close.toFixed(2)) });
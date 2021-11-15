import { stocks } from './consts';
import { Request, Response, NextFunction } from 'express';
export const isItInlcluded = ({ params:{ symbol } } : Request, res: Response, next: NextFunction) => {
  if (stocks.includes(symbol)){
    return next();
  }
  res.status(404).end();
};
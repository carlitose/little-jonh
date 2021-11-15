import express from 'express';
import passport from 'passport';
import { basicStrategy } from './lib/passportStrategies';
import { getHistoryPrice } from './lib/stocksAPI';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

const app = express();
const port = 8080;

const key = '050f13546fmsha0487ca147d4d91p1e7ba0jsnc003443716bc';
passport.use(basicStrategy);

app.use(passport.initialize());

app.get('/', passport.authenticate('basic', { session: false }), (req, res) => {
  res.send('Hello world!');
});

app.get(
  '/tickers/:symbol/history',
  passport.authenticate('basic', { session: false }),
  async ({ params:{ symbol } }, res) => {
    logger.info(symbol);
    const response = await getHistoryPrice({ key, symbol });
    res.json(response);
    res.end();
  },
);

app.listen(port, () => {
  logger.info(`server started at http://localhost:${port}`);
});

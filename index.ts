import express from 'express';
import passport from 'passport';
import { basicStrategy } from './lib/passportStrategies';
import { getHistoryPrice, getPorfolio } from './lib/stocksAPI';
import winston from 'winston';
import { isItInlcluded } from './lib/middleware';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

const app = express();
const port = 8080;

const key = '123';
passport.use(basicStrategy);

app.use(passport.initialize());

app.get('/', passport.authenticate('basic', { session: false }), (req, res) => {
  res.send('Hello world!');
});

app.get(
  '/tickers',
  passport.authenticate('basic', { session: false }),
  async (req : any, res) => {
    const response = await getPorfolio({ key, username:req.user.username });
    res.json(response);
    res.end();
  },
);

app.get(
  '/tickers/:symbol/history',
  passport.authenticate('basic', { session: false }),
  isItInlcluded,
  async ({ params:{ symbol } }, res) => {
    const response = await getHistoryPrice({ key, symbol });
    res.json(response);
    res.end();
  },
);

app.listen(port, () => {
  logger.info(`server started at http://localhost:${port}`);
});

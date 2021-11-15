import { BasicStrategy } from 'passport-http';
import logger from 'winston';
import { users } from './consts';

export const serializeUser = (username:string, _password:string, done:any) => {
  logger.info('username:', username);
  if (!users.includes(username)) {
    logger.info('user not found');
    return done(null, false);
  }
  return done(null, { username: username });
};

export const basicStrategy = new BasicStrategy(
  serializeUser,
);

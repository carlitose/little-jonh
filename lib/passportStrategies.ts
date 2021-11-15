import { BasicStrategy } from 'passport-http';
import { users } from './consts';

export const serializeUser = (username:string, _password:string, done:any) => {
  if (!users.includes(username)) {
    return done(null, false);
  }
  return done(null, { username: username });
};

export const basicStrategy = new BasicStrategy(
  serializeUser,
);

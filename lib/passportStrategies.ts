import { BasicStrategy } from 'passport-http';
import { users } from './consts';

export const serializeUser = (username:string, _password:string, done:any) => {
  console.log('username:', username);
  if (!users.includes(username)) {
    console.log('user not found');
    return done(null, false);
  }
  return done(null, { username: username });
};

export const basicStrategy = new BasicStrategy(
  serializeUser,
);

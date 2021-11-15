import express from 'express';
import passport from 'passport';
import { basicStrategy } from './lib/passportStrategies';

const app = express();
const port = 8080;

const key = '050f13546fmsha0487ca147d4d91p1e7ba0jsnc003443716bc';

passport.use(basicStrategy);

app.use(passport.initialize());

app.get( '/', passport.authenticate('basic', { session: false }), ( req, res ) => {
  res.send( 'Hello world!' );
} );

app.listen( port, () => {
  console.log( `server started at http://localhost:${ port }` );
} );
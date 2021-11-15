import { expect } from 'chai';
import { serializeUser } from '../lib/passportStrategies';
import sinon from 'sinon';
describe('passportStrategies', ()=>{

  it('user right', () => {
    const done = sinon.spy();
    serializeUser('topolino', '', done);
    expect(done.called).to.be.equals(true);
    expect(done.getCall(0).lastArg).to.deep.equal({ username:'topolino' });
  });
  it('user fails', () => {
    const done = sinon.spy();
    serializeUser('nessuno', '', done);
    expect(done.called).to.be.equals(true);
    expect(done.getCall(0).lastArg).to.be.equals(false);
  });

});
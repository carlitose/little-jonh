import chai, { expect } from 'chai';
import sinon from 'sinon';
import { isItInlcluded } from '../lib/middleware';
import { mockReq, mockRes } from 'sinon-express-mock';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

describe('isItInlcluded', ()=>{
  it('it is included', () =>{
    const request = {
      params: {
        symbol: 'V',
      },
    };
    const req = mockReq(request);
    const res = mockRes();
    const next = sinon.spy();
    isItInlcluded(req, res, next);
    expect(next.calledOnce).to.be.equals(true);
  });
  it('it is NOT included', () =>{
    const request = {
      params: {
        symbol: 'NOONE',
      },
    };
    const req = mockReq(request);
    const res = mockRes();
    isItInlcluded(req, res, sinon.spy());
    expect(res.status).to.be.calledWith(404);
  });
});

import { expect } from 'chai';
import { convertData } from '../lib/utils';
import fs from 'fs';
import path from 'path';

describe('utils', ()=>{
  const rawdData = fs.readFileSync(path.join(__dirname, 'fixtures/v-history.json'));
  const response = JSON.parse(rawdData.toString('utf8')).prices[0];
  it('convertData', ()=>{
    const conversion = convertData(response);
    expect(conversion).to.deep.equals(    
      { 'date': '2021-11-15',
        'price': 214.46 });
  });

});
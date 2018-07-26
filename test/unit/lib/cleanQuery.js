const chai = require('chai');

const cleanQuery = require('../../../app/lib/utils/cleanQuery');

const expect = chai.expect;

describe('cleanQuery', () => {
  it('should remove leading whitespace', () => {
    const term = 'term';
    expect(cleanQuery(`   ${term}`)).to.equal(term);
  });

  it('should remove trailing whitespace', () => {
    const term = 'term';
    expect(cleanQuery(`${term}   `)).to.equal(term);
  });

  it('should reduce multiple whitespace instances to a single character when between terms', () => {
    const term = 'term';
    expect(cleanQuery(`${term}   ${term}`)).to.equal(`${term} ${term}`);
  });
});

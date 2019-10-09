const chai = require('chai');

const cleanQuery = require('../../../app/lib/utils/cleanQuery');

const { expect } = chai;

describe('cleanQuery', () => {
  it('should remove leading whitespace', () => {
    const term = 'term';
    const query = `   ${term}`;

    expect(cleanQuery(query)).to.equal(term);
  });

  it('should remove trailing whitespace', () => {
    const term = 'term';
    const query = `${term}    `;

    expect(cleanQuery(query)).to.equal(term);
  });

  it('should reduce multiple whitespace instances to a single character when between terms', () => {
    const term = 'term';
    const query = `${term}   ${term}`;

    expect(cleanQuery(query)).to.equal(`${term} ${term}`);
  });
});

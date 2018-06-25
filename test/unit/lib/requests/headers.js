const chai = require('chai');

const headers = require('../../../../app/lib/requests/headers');

const expect = chai.expect;

describe('headers', () => {
  it('should return \'Content-Type\' header as \'application/json\'', () => {
    expect(headers['Content-Type']).to.be.equal('application/json');
  });

  it('should return \'api-key\' header as value from env var', () => {
    // notARealKey is default value in docker-compose.yml
    expect(headers['api-key']).to.be.equal('notARealKey');
  });
});

const chai = require('chai');
const VError = require('verror');

const processResults = require('../../../app/lib/processResults');

const expect = chai.expect;

describe('processResults', () => {
  describe('valid input', () => {
    it('should return an empty array when there is no \'value\' property', () => {
      const noValue = '{}';
      const results = processResults(noValue);

      expect(results).to.be.an('array').that.is.empty;
    });

    it('should return the contents of the \'value\' property when there is one', () => {
      const noValue = '{ "value": [] }';
      const results = processResults(noValue);

      expect(results).to.be.an('array').that.is.empty;
    });

    it('should add a property with the combined address information for each item within the \'value\' property', () => {
      const noValue = '{ "value": [{},{}] }';
      const results = processResults(noValue);

      expect(results).to.be.an('array');
      expect(results.length).to.equal(2);
      results.forEach(item => expect(item.Address).to.equal(''));
      // )).to.have.all.keys('Address');
    });
  });

  describe('invalid input', () => {
    it('should throw VError when the input is invalid JSON', () => {
      const invalidJson = 'invalid JSON';

      expect(() => processResults(invalidJson)).to.throw(VError, 'Problem parsing results');
    });
  });
});

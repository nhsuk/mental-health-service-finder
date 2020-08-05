const chai = require('chai');
const VError = require('verror');

const createBody = require('../../../../app/lib/requests/createBody');

const { expect } = chai;

describe('createBody', () => {
  describe('unknown type', () => {
    it('should throw VError', () => {
      const unknownType = 'unknown';
      expect(() => createBody(unknownType, {})).to.throw(VError, `Unable to create body for unknown type: ${unknownType}`);
    });
  });
});

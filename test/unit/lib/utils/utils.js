const chai = require('chai');
const utils = require('../../../../app/lib/utils/utils');

const { expect } = chai;

describe('utils', () => {
  describe('joinTruthyValues', () => {
    it('should return a string containing only truthy values', () => {
      const falseyValues = [null, undefined, 0, '', false];
      const truthyValues = ['a', 1, true];
      const input = falseyValues.concat(truthyValues);

      const output = utils.joinTruthyValues(input);

      expect(output).to.be.a('string');
      expect(output).to.equal('a, 1, true');
    });
  });

  describe('trim', () => {
    it('should remove leading and trailing whitespace', () => {
      const result = utils.trim('  test  ');
      expect(result).to.equal('test');
    });
    it('should gracefully handled undefined values', () => {
      const result = utils.trim(undefined);
      expect(result).to.equal(undefined);
    });
  });
});

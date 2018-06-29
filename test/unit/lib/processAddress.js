const chai = require('chai');

const deepClone = require('../../../app/lib/utils/utils').deepClone;
const processAddress = require('../../../app/lib/processAddress');

const expect = chai.expect;

describe('processAddress', () => {
  it('should return an empty string when there is no address information', () => {
    const input = {
      Address1: '',
      Address2: '',
      Address3: '',
      City: '',
      County: '',
      Postcode: '',
    };
    const expectedOutput = deepClone(input);
    expectedOutput.Address = '';

    const result = processAddress(input);

    expect(result).to.deep.equal(expectedOutput);
  });

  it('should return a comma separated string of all address information', () => {
    const input = {
      Address1: 'Address1',
      Address2: 'Address2',
      Address3: 'Address3',
      City: 'City',
      County: 'County',
      Postcode: 'Postcode',
    };

    const result = processAddress(input);

    const expectedOutput = deepClone(input);
    expectedOutput.Address = 'Address1, Address2, Address3, City, County, Postcode';

    expect(result).to.deep.equal(expectedOutput);
  });

  it('should return a comma separated string of all available address information', () => {
    const input = {
      Address1: 'Address1',
      Address2: null,
      Address3: 'Address3',
      City: '',
      County: 'County',
      Postcode: 'Postcode',
    };

    const result = processAddress(input);

    const expectedOutput = deepClone(input);
    expectedOutput.Address = 'Address1, Address3, County, Postcode';

    expect(result).to.deep.equal(expectedOutput);
  });
});

const chai = require('chai');

const mapGPResults = require('../../../app/lib/mapGPResults');

const expect = chai.expect;

describe('mapGPResults', () => {
  it('should return undefined when there is no address information', () => {
    const input = {
      Address1: '',
      Address2: '',
      Address3: '',
      City: '',
      County: '',
      Postcode: '',
    };

    mapGPResults(input);

    expect(input.fullAddress).to.be.undefined;
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

    mapGPResults(input);

    const expectedAddress = 'Address1, Address2, Address3, City, County, Postcode';

    expect(input.fullAddress).to.equal(expectedAddress);
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

    mapGPResults(input);

    const expectedAddress = 'Address1, Address3, County, Postcode';

    expect(input.fullAddress).to.equal(expectedAddress);
  });
});

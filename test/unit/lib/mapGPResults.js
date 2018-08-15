const chai = require('chai');

const searchHighlightsKey = 's';
const { post, pre } = require('../../../app/lib/constants').highlights;
const mapGPResults = require('../../../app/lib/mapGPResults');

const expect = chai.expect;

describe('mapGPResults', () => {
  describe('with no matches', () => {
    describe('\'fullAddress\'', () => {
      it('should be undefined when there is no address information', () => {
        const input = [{
          Address1: null,
          Address2: null,
          Address3: null,
          City: null,
          County: null,
          Postcode: null,
        }];

        mapGPResults(input, 'nomatch');

        expect(input[0].fullAddress).to.be.undefined;
      });

      it('should be a comma separated string of all address information when no terms have been highlighted', () => {
        const input = [{
          Address1: 'Address1',
          Address2: 'Address2',
          Address3: 'Address3',
          City: 'City',
          County: 'County',
          Postcode: 'Postcode',
        }];

        mapGPResults(input, 'nomatch');

        const expectedAddress = 'Address1, Address2, Address3, City, County, Postcode';

        expect(input[0].fullAddress).to.equal(expectedAddress);
      });
    });
  });

  describe('organisationNameHighlight', () => {
    it('should be highlighted when there is a match with OrganisationName', () => {
      const input = [{
        OrganisationName: 'OrganisationName',
      }];

      mapGPResults(input, 'org');

      expect(input[0].organisationNameHighlight).to.equal(`${pre}Org${post}anisationName`);
    });

    describe('fullAddress', () => {
      it('should be undefined when there is no address information', () => {
        const input = [{
          Address1: null,
          Address2: null,
          Address3: null,
          City: null,
          County: null,
          Postcode: null,
        }];

        mapGPResults(input, 'nomatch');

        expect(input[0].fullAddress).to.be.undefined;
      });

      it('should be a comma separated string of all address information with highlighted terms', () => {
        const input = [{
          Address1: 'Address1',
          Address2: 'Address2',
          Address3: 'Address3',
          City: 'City',
          County: 'County',
          Postcode: 'Postcode',
        }];

        mapGPResults(input, 'Address');

        const expectedAddress = `${pre}Address${post}1, ${pre}Address${post}2, ${pre}Address${post}3, City, County, Postcode`;

        expect(input[0].fullAddress).to.equal(expectedAddress);
      });

      it('should be a comma separated string of all address information when no terms have been highlighted', () => {
        const input = [{
          Address1: 'Address1',
          Address2: 'Address2',
          Address3: 'Address3',
          City: 'City',
          County: 'County',
          Postcode: 'Postcode',
        }];

        mapGPResults(input, 'nomatch');

        const expectedAddress = 'Address1, Address2, Address3, City, County, Postcode';

        expect(input[0].fullAddress).to.equal(expectedAddress);
      });

      it('should be a comma separated string of all available address information', () => {
        const input = [{
          Address1: 'Address1',
          Address2: null,
          Address3: 'Address3',
          City: '',
          County: 'County',
          Postcode: 'Postcode',
        }];
        input[searchHighlightsKey] = {};

        mapGPResults(input, 'nomatch');

        const expectedAddress = 'Address1, Address3, County, Postcode';

        expect(input[0].fullAddress).to.equal(expectedAddress);
      });
    });
  });
});

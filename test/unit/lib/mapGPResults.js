const chai = require('chai');

const mapGPResults = require('../../../app/lib/mapGPResults');
const searchHighlightsKey = require('../../../app/lib/constants').searchHighlightsKey;

const expect = chai.expect;

describe('mapGPResults', () => {
  describe('without highlights', () => {
    describe('\'organisationNameHighlight\'', () => {
      it('should be undefined when there is no \'OrganisationName\'', () => {
        const input = {
          OrganisationName: null,
        };

        mapGPResults(input);

        expect(input.organisationNameHighlight).to.equal(input.OrganisationName);
      });
    });

    describe('\'fullAddress\'', () => {
      it('should be undefined when there is no address information', () => {
        const input = {
          Address1: null,
          Address2: null,
          Address3: null,
          City: null,
          County: null,
          Postcode: null,
        };

        mapGPResults(input);

        expect(input.fullAddress).to.be.undefined;
      });

      it('should be a comma separated string of all address information when no terms have been highlighted', () => {
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
    });
  });

  describe('with highlights', () => {
    describe('\'organisationNameHighlight\'', () => {
      it('should be undefined when there is no \'OrganisationName\'', () => {
        const input = {
          OrganisationName: null,
        };
        input[searchHighlightsKey] = {};

        mapGPResults(input);

        expect(input.organisationNameHighlight).to.equal(input.OrganisationName);
      });

      it('should be the highlight when there is one', () => {
        const input = {
          OrganisationName: 'OrganisationName',
        };
        input[searchHighlightsKey] = {
          OrganisationName: 'Highlighted OrganisationName',
        };

        mapGPResults(input);

        expect(input.organisationNameHighlight)
          .to.equal(input[searchHighlightsKey].OrganisationName);
      });

      it('should be \'OrganisationName\' when there is no highlight', () => {
        const input = {
          OrganisationName: 'OrganisationName',
        };
        input[searchHighlightsKey] = {};

        mapGPResults(input);

        expect(input.organisationNameHighlight).to.equal(input.OrganisationName);
      });
    });

    describe('\'fullAddress\'', () => {
      it('should be undefined when there is no address information', () => {
        const input = {
          Address1: null,
          Address2: null,
          Address3: null,
          City: null,
          County: null,
          Postcode: null,
        };
        input[searchHighlightsKey] = {};

        mapGPResults(input);

        expect(input.fullAddress).to.be.undefined;
      });

      it('should be a comma separated string of all address information with highlighted terms', () => {
        const input = {
          Address1: 'Address1',
          Address2: 'Address2',
          Address3: 'Address3',
          City: 'City',
          County: 'County',
          Postcode: 'Postcode',
        };
        input[searchHighlightsKey] = {
          Address1: 'Highlighted Address1',
          Address2: 'Highlighted Address2',
          Address3: 'Highlighted Address3',
          Postcode: 'Highlighted Postcode',
        };

        mapGPResults(input);

        const expectedAddress = 'Highlighted Address1, Highlighted Address2, Highlighted Address3, City, County, Highlighted Postcode';

        expect(input.fullAddress).to.equal(expectedAddress);
      });

      it('should be a comma separated string of all address information when no terms have been highlighted', () => {
        const input = {
          Address1: 'Address1',
          Address2: 'Address2',
          Address3: 'Address3',
          City: 'City',
          County: 'County',
          Postcode: 'Postcode',
        };
        input[searchHighlightsKey] = {};

        mapGPResults(input);

        const expectedAddress = 'Address1, Address2, Address3, City, County, Postcode';

        expect(input.fullAddress).to.equal(expectedAddress);
      });

      it('should be a comma separated string of all available address information', () => {
        const input = {
          Address1: 'Address1',
          Address2: null,
          Address3: 'Address3',
          City: '',
          County: 'County',
          Postcode: 'Postcode',
        };
        input[searchHighlightsKey] = {};

        mapGPResults(input);

        const expectedAddress = 'Address1, Address3, County, Postcode';

        expect(input.fullAddress).to.equal(expectedAddress);
      });
    });
  });
});

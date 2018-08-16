const chai = require('chai');
const VError = require('verror');

const config = require('../../../../config/config');
const constants = require('../../../../app/lib/constants');
const buildOptions = require('../../../../app/lib/requests/buildOptions');

const apiVersion = config.api.version;
const apiHost = config.api.host;
const apiOrgIndex = config.api.indexes.orgLookup;

const expect = chai.expect;

describe('buildOptions', () => {
  describe('for all types', () => {
    const types = constants.types;

    Object.keys(types).forEach((type) => {
      const locals = { query: 'search term' };
      const options = buildOptions(type, locals);

      describe(`response for type: ${type}`, () => {
        it('should include expected keys', () => {
          expect(Object.keys(options)).to.deep.equal(['body', 'headers', 'url']);
        });

        it('should include required headers', () => {
          expect(Object.keys(options.headers)).to.deep.equal(['Content-Type', 'api-key']);
        });

        it('should return \'Content-Type\' header as \'application/json\'', () => {
          expect(options.headers['Content-Type']).to.be.equal('application/json');
        });

        it('should return \'api-key\' header as value from env var', () => {
          // notARealKey is default value in docker-compose.yml
          expect(options.headers['api-key']).to.be.equal('notARealKey');
        });
      });
    });
  });

  describe('for GP type', () => {
    describe('multi term query', () => {
      const locals = { query: 'search by this' };
      const options = buildOptions(constants.types.GP, locals);
      const body = JSON.parse(options.body);

      describe('body', () => {
        const searchFields = 'OrganisationName,Address1,Address2,Address3,Postcode';

        it('should only include expected keys', () => {
          expect(Object.keys(body)).to.deep.equal(['count', 'filter', 'search', 'searchFields', 'select', 'top']);
        });

        it('should filter by \'GPB\'', () => {
          expect(body.filter).to.equal('OrganisationTypeID eq \'GPB\'');
        });

        it('should add an asterix to the end of each search term', () => {
          expect(body.search).to.equal('search* by* this*');
        });

        it('should search the expected fields', () => {
          expect(body.searchFields).to.equal(searchFields);
        });

        it('should select appropriate properties', () => {
          expect(body.select).to.equal('OrganisationName,Address1,Address2,Address3,City,County,Postcode,CCG,Longitude,Latitude');
        });

        it('should request a count of results', () => {
          expect(body.count).to.equal(true);
        });

        it('should return the top 25 results', () => {
          expect(body.top).to.equal(25);
        });
      });

      describe('url', () => {
        it('should return the search URL', () => {
          expect(options.url).to.equal(`${apiHost}/indexes/${apiOrgIndex}/docs/search?api-version=${apiVersion}`);
        });
      });
    });
  });

  describe('for IAPT type', () => {
    const locals = { lat: 50, lon: -1, query: '123456' };
    const options = buildOptions(constants.types.IAPT, locals);
    const body = JSON.parse(options.body);

    describe('body', () => {
      it('should only include expected keys', () => {
        expect(Object.keys(body)).to.deep.equal(['filter', 'orderby']);
      });

      it('should filter by \'CCG\'', () => {
        expect(body.filter).to.equal(`ServiceCodesProvided/any(c:search.in(c, '${constants.IAPTServiceCode}')) and OrganisationTypeID ne 'TRU' and RelatedIAPTCCGs/any(c: c eq '${locals.query}')`);
      });

      it('should order by distance from GP', () => {
        expect(body.orderby).to.equal(`geo.distance(Geocode, geography'Point(${locals.lon} ${locals.lat})')`);
      });
    });

    describe('url', () => {
      it('should return the suggest URL', () => {
        expect(options.url).to.equal(`${apiHost}/indexes/${apiOrgIndex}/docs/search?api-version=${apiVersion}`);
      });
    });
  });

  describe('unknown type', () => {
    it('should throw VError', () => {
      const unknownType = 'unknown';
      expect(() => buildOptions(unknownType, {})).to.throw(VError, `Unable to build options for unknown type: ${unknownType}`);
    });
  });
});

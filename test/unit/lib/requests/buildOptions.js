const chai = require('chai');

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
      const query = 'search term';
      const options = buildOptions(type, query);

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
    const query = 'search by this';
    const options = buildOptions(constants.types.GP, query);
    const pbody = JSON.parse(options.body);

    describe('body', () => {
      it('should only include expected keys', () => {
        expect(Object.keys(pbody)).to.deep.equal(['filter', 'search', 'searchFields', 'select', 'suggesterName', 'top']);
      });

      it('should filter by \'GPB\'', () => {
        expect(pbody.filter).to.equal('OrganisationTypeID eq \'GPB\'');
      });

      it('should search by the input', () => {
        expect(pbody.search).to.equal(query);
      });

      it('should search the expected fields', () => {
        expect(pbody.searchFields).to.equal('OrganisationName,OrganisationAliases,City,Postcode');
      });

      it('should select appropriate properties', () => {
        expect(pbody.select).to.equal('OrganisationName,OrganisationAliases,Address1,Address2,Address3,City,County,Postcode,CCG');
      });

      it('should run against the organisation suggester', () => {
        expect(pbody.suggesterName).to.equal('orgname-suggester');
      });

      it('should return the top 10 results', () => {
        expect(pbody.top).to.equal(10);
      });
    });

    describe('url', () => {
      it('should return the suggest URL', () => {
        expect(options.url).to.equal(`${apiHost}/indexes/${apiOrgIndex}/docs/suggest?api-version=${apiVersion}`);
      });
    });
  });

  describe('for IAPT type', () => {
    const query = '123456';
    const options = buildOptions(constants.types.IAPT, query);
    const pbody = JSON.parse(options.body);

    describe('body', () => {
      it('should only include expected keys', () => {
        expect(Object.keys(pbody)).to.deep.equal(['filter']);
      });

      it('should filter by \'CCG\'', () => {
        expect(pbody.filter).to.equal(`ServiceCodesProvided/any(c:search.in(c,'SRV0339')) and OrganisationTypeID ne 'TRU' and RelatedCCGs/any(g: g eq '${query}')`);
      });
    });

    describe('url', () => {
      it('should return the suggest URL', () => {
        expect(options.url).to.equal(`${apiHost}/indexes/${apiOrgIndex}/docs/search?api-version=${apiVersion}`);
      });
    });
  });
});

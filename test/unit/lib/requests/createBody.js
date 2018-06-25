const chai = require('chai');
const createBody = require('../../../../app/lib/requests/createBody');

const expect = chai.expect;

describe('createBody', () => {
  describe('forGPRequest', () => {
    const query = 'search by this';
    const body = createBody.forGPRequest(query);

    it('should only include expected keys', () => {
      expect(Object.keys(body)).to.deep.equal(['filter', 'search', 'searchFields', 'select', 'suggesterName', 'top']);
    });

    it('should filter by \'GPD\'', () => {
      expect(body.filter).to.equal('OrganisationTypeID eq \'GPB\'');
    });

    it('should search by the input', () => {
      expect(body.search).to.equal(query);
    });

    it('should search the expected fields', () => {
      expect(body.searchFields).to.equal('OrganisationName,OrganisationAliases,City,Postcode');
    });

    it('should select appropriate properties', () => {
      expect(body.select).to.equal('OrganisationName,OrganisationAliases,Address1,Address2,Address3,City,County,Postcode,CCG');
    });

    it('should run against the organisation suggester', () => {
      expect(body.suggesterName).to.equal('orgname-suggester');
    });

    it('should return the top 10 results', () => {
      expect(body.top).to.equal(10);
    });
  });

  describe('forIAPTRequest', () => {
    const ccg = '123456';
    const body = createBody.forIAPTRequest(ccg);

    it('should only include expected keys', () => {
      expect(Object.keys(body)).to.deep.equal(['filter']);
    });

    it('should filter by \'GPD\'', () => {
      expect(body.filter).to.equal(`ServiceCodesProvided/any(c:search.in(c,'SRV0339')) and OrganisationTypeID ne 'TRU' and RelatedCCGs/any(g: g eq '${ccg}')`);
    });
  });
});

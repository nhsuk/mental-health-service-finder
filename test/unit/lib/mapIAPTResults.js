const chai = require('chai');

const deepClone = require('../../../app/lib/utils/utils').deepClone;
const mapIAPTResults = require('../../../app/lib/mapIAPTResults');

const expect = chai.expect;

describe('mapIAPTResults', () => {
  describe('unhappy path', () => {
    [null, ''].forEach((testCase) => {
      let result;
      before(`execute function for ${testCase}`, () => {
        const input = { Contacts: testCase };
        result = mapIAPTResults(input);
      });

      it('should return undefined when there is no website address', () => {
        expect(result.website).to.equal(undefined);
      });

      it('should return undefined when there is no telephone number', () => {
        expect(result.telephone).to.equal(undefined);
      });

      it('should return undefined when there is no email address', () => {
        expect(result.email).to.equal(undefined);
      });
    });
  });

  describe('happy path', () => {
    let result;

    const email = 'name@domain.com';
    const telephone = '0800 123 456';
    const website = 'https://a.web.site';
    const contacts = `[
          {
            "OrganisationContactType": "Primary",
            "OrganisationContactAvailabilityType": "Office hours",
            "OrganisationContactMethodType": "Telephone",
            "OrganisationContactValue": "0800 123 456"
          },
          {
            "OrganisationContactType": "Primary",
            "OrganisationContactAvailabilityType": "Office hours",
            "OrganisationContactMethodType": "Email",
            "OrganisationContactValue": "name@domain.com"
          },
          {
            "OrganisationContactType": "Primary",
            "OrganisationContactAvailabilityType": "Office hours",
            "OrganisationContactMethodType": "Website",
            "OrganisationContactValue": "https://a.web.site"
          }
        ]`;

    before('execute function', () => {
      const input = { Contacts: contacts };

      result = mapIAPTResults(input);
    });

    it('should return the email address', () => {
      expect(result.email).to.equal(email);
    });

    it('should return the telephone number', () => {
      expect(result.telephone).to.equal(telephone);
    });

    it('should return the website address', () => {
      expect(result.website).to.equal(website);
    });
  });
});

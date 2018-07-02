const chai = require('chai');

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
    const contacts = [
      { OrganisationContactMethodType: 'Telephone', OrganisationContactValue: telephone },
      { OrganisationContactMethodType: 'Email', OrganisationContactValue: email },
      { OrganisationContactMethodType: 'Website', OrganisationContactValue: website },
    ];

    before('execute function', () => {
      const input = { Contacts: JSON.stringify(contacts) };

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

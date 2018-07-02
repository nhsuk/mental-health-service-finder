const chai = require('chai');

const mapIAPTResults = require('../../../app/lib/mapIAPTResults');

const expect = chai.expect;

describe('mapIAPTResults', () => {
  describe('unhappy path', () => {
    [null, '', JSON.stringify([])].forEach((testCase) => {
      let input;

      before(`execute function for ${testCase}`, () => {
        input = { Contacts: testCase, Metrics: testCase };
        mapIAPTResults(input);
      });

      it('should return undefined when contacts has no website address', () => {
        expect(input.website).to.equal(undefined);
      });

      it('should return undefined when contacts has no telephone number', () => {
        expect(input.telephone).to.equal(undefined);
      });

      it('should return undefined when contacts has no email address', () => {
        expect(input.email).to.equal(undefined);
      });

      it('should return undefined when metrics does not contain self-referral', () => {
        expect(input.selfReferral).to.equal(undefined);
      });
    });
  });

  describe('happy path', () => {
    let input;

    const email = 'name@domain.com';
    const telephone = '0800 123 456';
    const website = 'https://a.web.site';
    const linkUrl = 'https://self.referral.com';
    const contacts = [
      { OrganisationContactMethodType: 'Telephone', OrganisationContactValue: telephone },
      { OrganisationContactMethodType: 'Email', OrganisationContactValue: email },
      { OrganisationContactMethodType: 'Website', OrganisationContactValue: website },
    ];
    const metrics = [{
      LinkUrl: linkUrl,
      MetricID: 6265,
    }];

    before('execute function', () => {
      input = { Contacts: JSON.stringify(contacts), Metrics: JSON.stringify(metrics) };

      mapIAPTResults(input);
    });

    it('should return the email address', () => {
      expect(input.email).to.equal(email);
    });

    it('should return the telephone number', () => {
      expect(input.telephone).to.equal(telephone);
    });

    it('should return the website address', () => {
      expect(input.website).to.equal(website);
    });

    it('should return the self-referral', () => {
      expect(input.selfReferral).to.equal(linkUrl);
    });
  });
});

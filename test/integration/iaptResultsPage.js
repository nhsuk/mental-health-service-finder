const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const constants = require('../../app/lib/constants');
const createBody = require('../../app/lib/requests/createBody');
const getHrefFromA = require('../lib/helpers').getHrefFromA;
const iExpect = require('../lib/expectations');
const nockRequests = require('../lib/nockRequests');
const routes = require('../../config/routes');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('IAPT results page', () => {
  const organisationLookupIndex = 'organisationlookup3-index';
  const path = `/indexes/${organisationLookupIndex}/docs/search`;
  const type = constants.types.IAPT;

  describe('happy path', () => {
    let $;
    let response;

    describe('multiple results', () => {
      const gpQuery = 'pim';
      const gpname = 'gpname';
      const expectedResultsCount = 3;

      before('make request', async () => {
        const query = 123456;
        const body = createBody(constants.types.IAPT, query);

        nockRequests.withResponseBody(path, body, 200, 'search/threeResults.json');

        response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&ccgid=${query}&gpquery=${gpQuery}&gpname=${gpname}`);
        $ = cheerio.load(response.text);
        iExpect.htmlWithStatus(response, 200);
      });

      it('has a back link to the GP results page', () => {
        iExpect.backLinkContent($, `${constants.siteRoot}${routes.results.path}?type=gp&query=${gpQuery}`);
      });

      it('should have a title of \'Find IAPT services - NHS.UK\'', () => {
        expect($('head title').text()).to.equal('Find IAPT services - NHS.UK');
      });

      it('should have an H1 of \'Psychological therapies services\'', () => {
        expect($('h1').text()).to.equal('Psychological therapies services');
      });

      it('the breadcrumbs should have 2 levels of links', () => {
        iExpect.breadcrumbContent($);
      });

      it('the banner should link back to Choices IAPT service search', () => {
        expect($('.back-to-choices').attr('href'))
          .to.equal('https://www.nhs.uk/service-search/Psychological-therapies-(IAPT)/LocationSearch/10008');
      });

      it('should display all of the results that were returned', () => {
        expect($('.results__count').text()).to.equal(expectedResultsCount.toString());
        expect($('.results__item').length).to.equal(expectedResultsCount);
      });

      it('should report number of services plurally', () => {
        expect($('.nhsuk-body-l').text().trim()).to.equal(`3 services are available for '${gpname}'.`);
      });

      it('should display contact information for each result', () => {
        $('.results__item').each((i, item) => {
          const email = $(item).find('.results__email');
          expect(email.text()).to.equal(`Email: email@result.${i}`);
          const emailHref = getHrefFromA(email);
          expect(emailHref).to.equal(`mailto:email@result.${i}`);

          const tel = $(item).find('.results__telephone');
          expect(tel.text()).to.equal(`Tel: result ${i} telephone`);
          const telHref = getHrefFromA(tel);
          expect(telHref).to.equal(`tel:result ${i} telephone`);

          const website = $(item).find('.results__website');
          expect(website.text()).to.equal(`https://website.result.${i}`);
          const websiteHref = getHrefFromA(website);
          expect(websiteHref).to.equal(`https://website.result.${i}`);
        });
      });

      it('should display a button to \'Refer yourself online\' for results with that option', () => {
        const selfReferralElements = $('.results__self_referral');
        expect(selfReferralElements.length).to.equal(2);
        const selfReferralElement0Href = getHrefFromA(selfReferralElements.eq(0));
        const selfReferralElement2Href = getHrefFromA(selfReferralElements.eq(1));
        expect(selfReferralElement0Href).to.equal('https://self.referral.0');
        expect(selfReferralElement2Href).to.equal('https://self.referral.2');
      });

      it('should display a display a message about online referrals not being available when there is no available option', () => {
        const noSelfReferral = $('.results__no_self_referral');
        expect(noSelfReferral.length).to.equal(1);
        expect(noSelfReferral.text()).to.equal('Online referrals not available');
      });
    });

    describe('request directly from typeahead', () => {
      const gpName = 'gpName';
      const query = 'zero results';
      before('make request', async () => {
        const body = createBody(constants.types.IAPT, query);

        nockRequests.withResponseBody(path, body, 200, 'search/zeroResults.json');

        response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&ccgid=${query}&gpquery=${gpName}&gpname=${gpName}&origin=search`);
        $ = cheerio.load(response.text);
        iExpect.htmlWithStatus(response, 200);
        expect($('.results__item').length).to.equal(0);
      });

      it('has a back link to the search page', () => {
        iExpect.backLinkContent($, `${constants.siteRoot}${routes.search.path}?query=${gpName}`);
      });
    });

    describe('zero results', () => {
      const gpName = 'gpName';
      before('make request', async () => {
        const query = 'zero results';
        const body = createBody(constants.types.IAPT, query);

        nockRequests.withResponseBody(path, body, 200, 'search/zeroResults.json');

        response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&ccgid=${query}&gpname=${gpName}`);
        $ = cheerio.load(response.text);
        iExpect.htmlWithStatus(response, 200);
        expect($('.results__item').length).to.equal(0);
      });

      it('should display a message for zero results', () => {
        expect($('.nhsuk-body-l').text().trim()).to.equal(`There are no services available for '${gpName}'.`);
      });
    });

    describe('one result', () => {
      const gpName = 'gpName';
      before('make request', async () => {
        const query = 'one result';
        const body = createBody(constants.types.IAPT, query);

        nockRequests.withResponseBody(path, body, 200, 'search/oneResult.json');

        response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&ccgid=${query}&gpname=${gpName}`);
        $ = cheerio.load(response.text);
        iExpect.htmlWithStatus(response, 200);
        expect($('.results__item').length).to.equal(1);
      });

      it('should report number of services singularly', () => {
        expect($('.nhsuk-body-l').text().trim()).to.equal(`1 service is available for '${gpName}'.`);
      });

      it('has a meta tag for WebTrends', () => {
        expect($('meta[name="WT.si_p"]').prop('content')).to.equal('IAPT Results');
      });
    });
  });

  describe('no results', () => {
    it('should display message when no results returned', async () => {
      const query = 'noresults';
      const body = createBody(constants.types.IAPT, query);

      nockRequests.withResponseBody(path, body, 200, 'search/zeroResults.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&ccgid=${query}`);
      iExpect.htmlWithStatus(response, 200);

      const $ = cheerio.load(response.text);

      expect($('.no-results').text()).to.equal('No results');
    });
  });

  describe('bad api responses', () => {
    it('should display an error page for a 400 response', async () => {
      const query = '400response';
      const body = createBody(constants.types.IAPT, query);

      nockRequests.withResponseBody(path, body, 400, 'search/400.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&ccgid=${query}`);

      iExpect.errorPageContent(response);
    });

    it('should display an error page for a 403 response', async () => {
      const query = '403response';
      const body = createBody(constants.types.IAPT, query);

      nockRequests.withNoResponseBody(path, body, 403);

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&ccgid=${query}`);

      iExpect.errorPageContent(response);
    });

    it('should display an error page for a 404 response', async () => {
      const query = '404response';
      const body = createBody(constants.types.IAPT, query);

      nockRequests.withResponseBody(path, body, 404, 'search/404.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&ccgid=${query}`);

      iExpect.errorPageContent(response);
    });

    it('should display an error page for a 415 response', async () => {
      const query = '415response';
      const body = createBody(constants.types.IAPT, query);

      nockRequests.withResponseBody(path, body, 415, 'search/415.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&ccgid=${query}`);

      iExpect.errorPageContent(response);
    });

    it('should display an error page when an error is returned from the API', async () => {
      const query = 'error';
      const body = createBody(constants.types.IAPT, query);
      const error = { message: 'something went wrong' };

      nockRequests.withError(path, body, error);

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&ccgid=${query}`);
      iExpect.errorPageContent(response);
    });
  });
});

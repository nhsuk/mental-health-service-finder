const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const config = require('../../config/config');
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
  const organisationLookupIndex = config.api.indexes.orgLookup;
  const path = `/indexes/${organisationLookupIndex}/docs/search`;
  const type = constants.types.IAPT;

  describe('happy path', () => {
    let $;
    let response;
    const lat = 50;
    const lon = -1;

    describe('multiple results', () => {
      const gpQuery = 'pim';
      const gpname = 'gpname';
      const resultCount = 3;

      before('make request', async () => {
        const query = '123456';
        const locals = { lat, lon, query };
        const body = createBody(constants.types.IAPT, locals);

        nockRequests.withResponseBody(path, body, 200, 'search/threeResults.json');

        response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&ccgid=${query}&gpquery=${gpQuery}&gpname=${gpname}&lat=${lat}&lon=${lon}`);
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
        expect($('h1').text()).to.equal('Your psychological therapies services');
      });

      it('the breadcrumbs should have 2 levels of links', () => {
        iExpect.breadcrumbContent($);
      });

      it('the banner should link back to Choices IAPT service search', () => {
        expect($('.back-to-choices').attr('href'))
          .to.equal('https://www.nhs.uk/service-search/Psychological-therapies-(IAPT)/LocationSearch/10008');
      });

      it('should display all of the results that were returned', () => {
        expect($('.results__count').text()).to.equal(resultCount.toString());
        expect($('.results__item').length).to.equal(resultCount);
        expect($('meta[name="DCSext.NumberOfResults"]').prop('content')).to.equal(resultCount.toString());
      });

      it('should report number of services plurally', () => {
        expect($('.nhsuk-body-l').text().trim()).to.equal(`${resultCount} services are available for '${gpname}'.`);
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
        const selfReferralElements = $('.results__self__referral');
        expect(selfReferralElements.length).to.equal(2);
        const selfReferralElement0Href = getHrefFromA(selfReferralElements.eq(0));
        const selfReferralElement2Href = getHrefFromA(selfReferralElements.eq(1));
        expect(selfReferralElement0Href).to.equal('https://self.referral.0');
        expect(selfReferralElement2Href).to.equal('https://self.referral.2');
      });

      it('should display no message about online referrals not being available when there is no available option', () => {
        const resultItems = $('.results__item');
        expect(resultItems.eq(1).find('p').length).to.equal(3);
      });
    });

    describe('request directly from typeahead', () => {
      const gpName = 'gpName';
      const query = 'zero results';
      const locals = { lat, lon, query };

      before('make request', async () => {
        const body = createBody(constants.types.IAPT, locals);

        nockRequests.withResponseBody(path, body, 200, 'search/zeroResults.json');

        response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&ccgid=${query}&gpquery=${gpName}&gpname=${gpName}&origin=search&lat=${lat}&lon=${lon}`);
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
        const locals = { lat, lon, query };
        const body = createBody(constants.types.IAPT, locals);

        nockRequests.withResponseBody(path, body, 200, 'search/zeroResults.json');

        response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&ccgid=${query}&gpname=${gpName}&lat=${lat}&lon=${lon}`);
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
      const resultCount = 1;

      before('make request', async () => {
        const query = 'one result';
        const locals = { lat, lon, query };
        const body = createBody(constants.types.IAPT, locals);

        nockRequests.withResponseBody(path, body, 200, 'search/oneResult.json');

        response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&ccgid=${query}&gpname=${gpName}&lat=${lat}&lon=${lon}`);
        $ = cheerio.load(response.text);
        iExpect.htmlWithStatus(response, 200);
        expect($('.results__item').length).to.equal(resultCount);
      });

      it('should report number of services singularly', () => {
        expect($('.nhsuk-body-l').text().trim()).to.equal(`${resultCount} service is available for '${gpName}'.`);
      });

      it('has a meta tag for WebTrends', () => {
        expect($('meta[name="WT.si_p"]').prop('content')).to.equal('IAPT Results');
        expect($('meta[name="DCSext.NumberOfResults"]').prop('content')).to.equal(resultCount.toString());
      });
    });
  });

  describe('no results', () => {
    const lat = 50;
    const lon = -1;

    it('should display message when no results returned', async () => {
      const query = 'noresults';
      const locals = { lat, lon, query };
      const body = createBody(constants.types.IAPT, locals);

      nockRequests.withResponseBody(path, body, 200, 'search/zeroResults.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&ccgid=${query}&lat=${lat}&lon=${lon}`);
      iExpect.htmlWithStatus(response, 200);

      const $ = cheerio.load(response.text);

      expect($('.no-results').text()).to.equal('No results');
    });
  });

  describe('bad api responses', () => {
    const lat = 50;
    const lon = -1;

    it('should display an error page for a 400 response', async () => {
      const query = '400response';
      const locals = { lat, lon, query };
      const body = createBody(constants.types.IAPT, locals);

      nockRequests.withResponseBody(path, body, 400, 'search/400.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&ccgid=${query}&lat=${lat}&lon=${lon}`);

      iExpect.errorPageContent(response);
    });

    it('should display an error page for a 403 response', async () => {
      const query = '403response';
      const locals = { lat, lon, query };
      const body = createBody(constants.types.IAPT, locals);

      nockRequests.withNoResponseBody(path, body, 403);

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&ccgid=${query}&lat=${lat}&lon=${lon}`);

      iExpect.errorPageContent(response);
    });

    it('should display an error page for a 404 response', async () => {
      const query = '404response';
      const locals = { lat, lon, query };
      const body = createBody(constants.types.IAPT, locals);

      nockRequests.withResponseBody(path, body, 404, 'search/404.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&ccgid=${query}&lat=${lat}&lon=${lon}`);

      iExpect.errorPageContent(response);
    });

    it('should display an error page for a 415 response', async () => {
      const query = '415response';
      const locals = { lat, lon, query };
      const body = createBody(constants.types.IAPT, locals);

      nockRequests.withResponseBody(path, body, 415, 'search/415.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&ccgid=${query}&lat=${lat}&lon=${lon}`);

      iExpect.errorPageContent(response);
    });

    it('should display an error page when an error is returned from the API', async () => {
      const query = 'error';
      const locals = { lat, lon, query };
      const body = createBody(constants.types.IAPT, locals);
      const error = { message: 'something went wrong' };

      nockRequests.withError(path, body, error);

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&ccgid=${query}&lat=${lat}&lon=${lon}`);
      iExpect.errorPageContent(response);
    });
  });
});

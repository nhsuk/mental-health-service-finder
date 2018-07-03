const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const constants = require('../../app/lib/constants');
const createBody = require('../../app/lib/requests/createBody');
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
      before('make request', async () => {
        const query = 123456;
        const body = createBody(constants.types.IAPT, query);

        nockRequests.withResponseBody(path, body, 200, 'search/threeResults.json');

        response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}&gpquery=${gpQuery}&gpname=${gpname}`);
        $ = cheerio.load(response.text);
        iExpect.htmlWithStatus(response, 200);
      });

      it('has a back link to the start page', () => {
        expect($('.link-back').prop('href')).to.equal(`${constants.siteRoot}${routes.results.path}?type=gp&query=${gpQuery}`);
      });

      it('should have a title of \'Find IAPT services - NHS.UK\'', () => {
        expect($('title').text()).to.equal('Find IAPT services - NHS.UK');
      });

      it('should have an H1 of \'Psychological therapies services\'', () => {
        expect($('h1.local-header--title--question').text()).to.equal('Psychological therapies services');
      });

      it('the breadcrumb should have a link back to Choices \'Services near you\'', () => {
        expect($('div.breadcrumb a').eq(1).attr('href')).to.equal('https://www.nhs.uk/service-search');
      });

      it('the banner should link back to Choices IAPT service search', () => {
        expect($('.back-to-choices').attr('href'))
          .to.equal('https://www.nhs.uk/service-search/Psychological-therapies-(IAPT)/LocationSearch/10008');
      });

      it('should display all of the results that were returned', () => {
        expect($('.results__item').length).to.equal(3);
      });

      it('should report number of services plurally', () => {
        expect($('p.local-header--title--question').text().trim()).to.equal(`3 services are available for '${gpname}'.`);
      });

      it('should display contact information for each result', () => {
        $('.results__item').each((i, item) => {
          expect($(item).find('.results__email').text()).to.equal(`Email: email@result.${i}`);
          expect($(item).find('.results__telephone').text()).to.equal(`Tel: result ${i} telephone`);
          expect($(item).find('.results__website').text()).to.equal(`https://website.result.${i}`);
        });
      });

      it('should display a button to \'Refer yourself online\' for results with that option', () => {
        const selfReferralElements = $('.results__self_referral');
        expect(selfReferralElements.length).to.equal(2);
        expect(selfReferralElements.eq(0).find('a').prop('href')).to.equal('https://self.referral.0');
        expect(selfReferralElements.eq(1).find('a').prop('href')).to.equal('https://self.referral.2');
      });

      it('should display a display a message about online referrals not being available when there is no available option', () => {
        const noSelfReferral = $('.results__no_self_referral');
        expect(noSelfReferral.length).to.equal(1);
        expect(noSelfReferral.text()).to.equal('Online referrals not available');
      });

      it('should display a metric referring to the waiting time for first session', () => {
        // TODO: When the data is coming through test where the href is for...
      });
    });

    describe('zero results', () => {
      const gpName = 'gpName';
      before('make request', async () => {
        const query = 'zero results';
        const body = createBody(constants.types.IAPT, query);

        nockRequests.withResponseBody(path, body, 200, 'search/zeroResults.json');

        response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}&gpname=${gpName}`);
        $ = cheerio.load(response.text);
        iExpect.htmlWithStatus(response, 200);
        expect($('.results__item').length).to.equal(0);
      });

      it('should display a message for zero results', () => {
        expect($('p.local-header--title--question').text().trim()).to.equal(`There are no services available for '${gpName}'.`);
      });
    });

    describe('one result', () => {
      const gpName = 'gpName';
      before('make request', async () => {
        const query = 'one result';
        const body = createBody(constants.types.IAPT, query);

        nockRequests.withResponseBody(path, body, 200, 'search/oneResult.json');

        response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}&gpname=${gpName}`);
        $ = cheerio.load(response.text);
        iExpect.htmlWithStatus(response, 200);
        expect($('.results__item').length).to.equal(1);
      });

      it('should report number of services singularly', () => {
        expect($('p.local-header--title--question').text().trim()).to.equal(`1 service is available for '${gpName}'.`);
      });
    });
  });

  describe('no results', () => {
    it('should display message when no results returned', async () => {
      const query = 'noresults';
      const body = createBody(constants.types.IAPT, query);

      nockRequests.withResponseBody(path, body, 200, 'search/zeroResults.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}`);
      iExpect.htmlWithStatus(response, 200);

      const $ = cheerio.load(response.text);

      expect($('.no-results').text()).to.equal('No results');
    });

    it('should display \'please enter something to search by\' page when no input is given', async () => {
      // This be dealt with by the search page
    });
  });

  describe('bad api responses', () => {
    it('should display an error page for a 400 response', async () => {
      const query = '400response';
      const body = createBody(constants.types.IAPT, query);

      nockRequests.withResponseBody(path, body, 400, 'search/400.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}`);
      iExpect.htmlWithStatus(response, 500);

      const $ = cheerio.load(response.text);

      expect($('.local-header--title--question').text()).to.equal('Sorry, we are experiencing technical problems.');
    });

    it('should display an error page for a 403 response', async () => {
      const query = '403response';
      const body = createBody(constants.types.IAPT, query);

      nockRequests.withNoResponseBody(path, body, 403);

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}`);
      iExpect.htmlWithStatus(response, 500);

      const $ = cheerio.load(response.text);

      expect($('.local-header--title--question').text()).to.equal('Sorry, we are experiencing technical problems.');
    });

    it('should display an error page for a 404 response', async () => {
      const query = '404response';
      const body = createBody(constants.types.IAPT, query);

      nockRequests.withResponseBody(path, body, 404, 'search/404.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}`);
      iExpect.htmlWithStatus(response, 500);

      const $ = cheerio.load(response.text);

      expect($('.local-header--title--question').text()).to.equal('Sorry, we are experiencing technical problems.');
    });

    it('should display an error page for a 415 response', async () => {
      const query = '415response';
      const body = createBody(constants.types.IAPT, query);

      nockRequests.withResponseBody(path, body, 415, 'search/415.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}`);
      iExpect.htmlWithStatus(response, 500);

      const $ = cheerio.load(response.text);

      expect($('.local-header--title--question').text()).to.equal('Sorry, we are experiencing technical problems.');
    });
  });
});

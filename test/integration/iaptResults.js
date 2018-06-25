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

  describe('happy path', () => {
    let $;
    let response;

    before('make request', async () => {
      const query = 123456;
      const body = createBody(constants.types.IAPT, query);

      console.log(body);
      nockRequests.withResponseBody(path, body, 200, 'search/threeResults.json');

      response = await chai.request(server).get(`${constants.siteRoot}${routes.iaptResults.path}?query=${query}`);
      $ = cheerio.load(response.text);
      iExpect.htmlWith200Status(response);
    });

    it('should have a title of \'Find IAPT services - NHS.UK\'', () => {
      expect($('title').text()).to.equal('Find IAPT services - NHS.UK');
    });

    it('should have an H1 of \'Psychological therapies services\'', () => {
      expect($('h1.local-header--title--question').text()).to.equal('Psychological therapies services');
    });

    it('the breadcrumb should have a link back to Choices \'Services near you\'', () => {
      expect($($('div.breadcrumb a')[1]).attr('href')).to.equal('https://www.nhs.uk/service-search');
    });

    it('the banner should link back to Choices IAPT service search', () => {
      expect($('.back-to-choices').attr('href'))
        .to.equal('https://www.nhs.uk/service-search/Psychological-therapies-(IAPT)/LocationSearch/10008');
    });

    it('should display the number of results returned for the practice searched for', () => {
      // TODO:
    });

    it('should display contact information for each result', () => {
      // TODO: Includes the website, the tel and email
    });

    it('should display a button to \'Refer yourself online\' for results with that option', () => {
      // TODO: need to do this
    });
  });

  describe('no results', () => {
    it('should display message when no results returned', async () => {
      const query = 'noresults';
      const body = createBody(constants.types.IAPT, query);

      nockRequests.withResponseBody(path, body, 200, 'search/zeroResults.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.iaptResults.path}?query=${query}`);
      iExpect.htmlWith200Status(response);

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

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.iaptResults.path}?query=${query}`);
      iExpect.htmlWith200Status(response);

      const $ = cheerio.load(response.text);

      expect($('.local-header--title--question').text()).to.equal('Sorry, we are experiencing technical problems.');
    });

    it('should display an error page for a 403 response', async () => {
      const query = '403response';
      const body = createBody(constants.types.IAPT, query);

      nockRequests.withNoResponseBody(path, body, 403);

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.iaptResults.path}?query=${query}`);
      iExpect.htmlWith200Status(response);

      const $ = cheerio.load(response.text);

      expect($('.local-header--title--question').text()).to.equal('Sorry, we are experiencing technical problems.');
    });

    it('should display an error page for a 404 response', async () => {
      const query = '404response';
      const body = createBody(constants.types.IAPT, query);

      nockRequests.withResponseBody(path, body, 404, 'search/404.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.iaptResults.path}?query=${query}`);
      iExpect.htmlWith200Status(response);

      const $ = cheerio.load(response.text);

      expect($('.local-header--title--question').text()).to.equal('Sorry, we are experiencing technical problems.');
    });

    it('should display an error page for a 415 response', async () => {
      const query = '415response';
      const body = createBody(constants.types.IAPT, query);

      nockRequests.withResponseBody(path, body, 415, 'search/415.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.iaptResults.path}?query=${query}`);
      iExpect.htmlWith200Status(response);

      const $ = cheerio.load(response.text);

      expect($('.local-header--title--question').text()).to.equal('Sorry, we are experiencing technical problems.');
    });
  });
});

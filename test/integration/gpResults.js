const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const constants = require('../../app/lib/constants');
const createBody = require('../../app/lib/requests/createBody').forGPRequest;
const iExpect = require('../lib/expectations');
const nockRequests = require('../lib/nockRequests');
const routes = require('../../config/routes');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('GP results page', () => {
  const organisationLookupIndex = 'organisationlookup3-index';
  const path = `/indexes/${organisationLookupIndex}/docs/suggest`;

  describe('happy path', () => {
    let $;
    let response;

    before('make request', async () => {
      const query = 'ls1';
      const body = createBody(query);

      nockRequests.withResponseBody(path, body, 200, 'suggest/tenResults.json');

      response = await chai.request(server).get(`${constants.siteRoot}${routes.gpResults.path}?query=${query}`);
      $ = cheerio.load(response.text);
      iExpect.htmlWith200Status(response);
    });

    it('should have a title of \'Find IAPT services - NHS.UK\'', () => {
      expect($('title').text()).to.equal('Find IAPT services - NHS.UK');
    });

    it('should have an H1 of \'GP Surgeries\'', () => {
      expect($('h1.local-header--title--question').text()).to.equal('GP surgeries');
    });

    it('the breadcrumb should have a link back to Choices \'Services near you\'', () => {
      expect($($('div.breadcrumb a')[1]).attr('href')).to.equal('https://www.nhs.uk/service-search');
    });

    it('the banner should link back to Choices IAPT service search', () => {
      expect($('.back-to-choices').attr('href'))
        .to.equal('https://www.nhs.uk/service-search/Psychological-therapies-(IAPT)/LocationSearch/10008');
    });

    it('should display the number of results returned', () => {
      expect($('.results__item').length).to.equal(10);
    });

    it('should display an address for each result', () => {
      // TODO: Could do with extending this
      expect($('.results__address').length).to.equal(10);
    });

    it('should display a button to select the GP', () => {
      expect($('.button').length).to.equal(10);
    });
  });

  describe('no results', () => {
    it('should display message when no results returned', async () => {
      const query = 'noresults';
      const body = createBody(query);

      nockRequests.withResponseBody(path, body, 200, 'suggest/zeroResults.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.gpResults.path}?query=${query}`);
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
      const body = createBody(query);

      nockRequests.withResponseBody(path, body, 400, 'suggest/400.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.gpResults.path}?query=${query}`);
      iExpect.htmlWith200Status(response);

      const $ = cheerio.load(response.text);

      expect($('.local-header--title--question').text()).to.equal('Sorry, we are experiencing technical problems.');
    });

    it('should display an error page for a 403 response', async () => {
      const query = '403response';
      const body = createBody(query);

      nockRequests.withNoResponseBody(path, body, 403);

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.gpResults.path}?query=${query}`);
      iExpect.htmlWith200Status(response);

      const $ = cheerio.load(response.text);

      expect($('.local-header--title--question').text()).to.equal('Sorry, we are experiencing technical problems.');
    });

    it('should display an error page for a 404 response', async () => {
      const query = '404response';
      const body = createBody(query);

      nockRequests.withResponseBody(path, body, 404, 'suggest/404.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.gpResults.path}?query=${query}`);
      iExpect.htmlWith200Status(response);

      const $ = cheerio.load(response.text);

      expect($('.local-header--title--question').text()).to.equal('Sorry, we are experiencing technical problems.');
    });

    it('should display an error page for a 415 response', async () => {
      const query = '415response';
      const body = createBody(query);

      nockRequests.withResponseBody(path, body, 415, 'suggest/415.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.gpResults.path}?query=${query}`);
      iExpect.htmlWith200Status(response);

      const $ = cheerio.load(response.text);

      expect($('.local-header--title--question').text()).to.equal('Sorry, we are experiencing technical problems.');
    });
  });
});

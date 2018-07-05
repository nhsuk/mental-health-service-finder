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

describe('GP results page', () => {
  const organisationLookupIndex = 'organisationlookup3-index';
  const path = `/indexes/${organisationLookupIndex}/docs/search`;
  const type = constants.types.GP;

  describe('happy path', () => {
    let $;
    let response;

    before('make request', async () => {
      const query = 'ls1';
      const body = createBody(constants.types.GP, query);

      nockRequests.withResponseBody(path, body, 200, 'suggest/tenResults.json');

      response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}`);
      $ = cheerio.load(response.text);
      iExpect.htmlWithStatus(response, 200);
    });

    it('has a back link to the start page', () => {
      expect($('.link-back').prop('href')).to.equal(`${constants.siteRoot}${routes.search.path}`);
    });

    it('should have a title of \'Find IAPT services - NHS.UK\'', () => {
      expect($('title').text()).to.equal('Find IAPT services - NHS.UK');
    });

    it('should have an H1 of \'Select your GP to get you to the right service\'', () => {
      expect($('h1.local-header--title--question').text()).to.equal('Select your GP to see available services');
    });

    it('the breadcrumb should have a link back to Choices \'Services near you\'', () => {
      expect($($('div.breadcrumb a')[1]).attr('href')).to.equal('https://www.nhs.uk/service-search');
    });

    it('the banner should link back to Choices IAPT service search', () => {
      expect($('.back-to-choices').attr('href'))
        .to.equal('https://www.nhs.uk/service-search/Psychological-therapies-(IAPT)/LocationSearch/10008');
    });

    it('should display all of the results that were returned', () => {
      expect($('.results__item').length).to.equal(10);
    });

    it('should display an address for each result', () => {
      expect($('.results__address').length).to.equal(10);
    });

    it('should display all available address elements', () => {
      expect($('.results__address').first().text().trim())
        .to.equal('Balcony Level 7, The Light, The Headrow, Leeds, West Yorkshire, LS1 8TL');
    });

    it('should display a button to select the GP', () => {
      expect($('p a:contains("This is my GP")').length).to.equal(10);
    });
  });

  describe('no results', () => {
    it('should display message when no results returned', async () => {
      const query = 'noresults';
      const body = createBody(constants.types.GP, query);

      nockRequests.withResponseBody(path, body, 200, 'suggest/zeroResults.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}`);
      iExpect.htmlWithStatus(response, 200);

      const $ = cheerio.load(response.text);

      expect($('.no-results').text()).to.equal('No results');
    });
  });

  describe('bad api responses', () => {
    it('should display an error page for a 400 response', async () => {
      const query = '400response';
      const body = createBody(constants.types.GP, query);

      nockRequests.withResponseBody(path, body, 400, 'suggest/400.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}`);
      iExpect.htmlWithStatus(response, 500);

      const $ = cheerio.load(response.text);

      expect($('.local-header--title--question').text()).to.equal('Sorry, we are experiencing technical problems.');
    });

    it('should display an error page for a 403 response', async () => {
      const query = '403response';
      const body = createBody(constants.types.GP, query);

      nockRequests.withNoResponseBody(path, body, 403);

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}`);
      iExpect.htmlWithStatus(response, 500);

      const $ = cheerio.load(response.text);

      expect($('.local-header--title--question').text()).to.equal('Sorry, we are experiencing technical problems.');
    });

    it('should display an error page for a 404 response', async () => {
      const query = '404response';
      const body = createBody(constants.types.GP, query);

      nockRequests.withResponseBody(path, body, 404, 'suggest/404.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}`);
      iExpect.htmlWithStatus(response, 500);

      const $ = cheerio.load(response.text);

      expect($('.local-header--title--question').text()).to.equal('Sorry, we are experiencing technical problems.');
    });

    it('should display an error page for a 415 response', async () => {
      const query = '415response';
      const body = createBody(constants.types.GP, query);

      nockRequests.withResponseBody(path, body, 415, 'suggest/415.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}`);
      iExpect.htmlWithStatus(response, 500);

      const $ = cheerio.load(response.text);

      expect($('.local-header--title--question').text()).to.equal('Sorry, we are experiencing technical problems.');
    });

    it('should display an error page for a response that can not be parsed', async () => {
      const query = 'notJSON';
      const body = createBody(constants.types.GP, query);

      nockRequests.withNoResponseBody(path, body, 500);

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}`);
      iExpect.htmlWithStatus(response, 500);

      const $ = cheerio.load(response.text);

      expect($('.local-header--title--question').text()).to.equal('Sorry, we are experiencing technical problems.');
    });
  });

  describe('no query', () => {
    it('should display an error message when no query is entered', async () => {
      const query = '';

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}`);
      iExpect.htmlWithStatus(response, 200);

      const $ = cheerio.load(response.text);

      expect($('.error-summary-heading').text().trim()).to.equal('Please enter something to find a GP');
    });
  });
});

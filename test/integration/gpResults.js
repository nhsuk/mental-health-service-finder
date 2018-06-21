const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const nock = require('nock');

const config = require('../../config/config');
const constants = require('../../app/lib/constants');
const createBody = require('../../app/lib/requests/createBody');
const getSampleResponse = require('../resources/getSampleResponse');
const headers = require('../../app/lib/requests/headers');
const iExpect = require('../lib/expectations');
const routes = require('../../config/routes');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('GP results page', () => {
  const host = process.env.API_HOSTNAME;
  const orgnameSuggesterIndex = 'organisationlookup3-index';
  const path = `/indexes/${orgnameSuggesterIndex}/docs/suggest`;
  // after('clean nock', () => {
  //   nock.cleanAll();
  // });
  describe('happy path', () => {
    let $;
    let response;

    before('make request', async () => {
      const query = 'ls1';
      const body = createBody(query);

      const tenResultsResponse = getSampleResponse('suggest-responses/tenResults.json');

      nock(host, { encodedQueryParams: true, reqheaders: headers })
        .post(path, body)
        .query({ 'api-version': config.api.version })
        .reply(200, tenResultsResponse);

      response = await chai.request(server).get(`${constants.siteRoot}${routes.gpResults.path}?query=${query}`);
      $ = cheerio.load(response.text);
    });

    it('should generate the correct request', () => {
      iExpect.htmlWith200Status(response);
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

  describe('bad api responses', () => {
    it('should display \'try again\' page when no results returned', async () => {
      const query = 'noresults';
      const zeroResultsResponse = getSampleResponse('suggest-responses/zeroResults.json');
      const body = createBody(query);
      nock(host, { encodedQueryParams: true, reqheaders: headers })
        .post(path, body)
        .query({ 'api-version': config.api.version })
        .reply(200, zeroResultsResponse);

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.gpResults.path}?query=${query}`);
      iExpect.htmlWith200Status(response);
    });

    it('should display \'error page\' page when an error has occured', async () => {
    });

    it('should display \'please enter something to search by\' page when no input is given', async () => {
      // This be dealt with by the search page
    });
  });

  // TODO: Extend the tests to include no results, 1 result, error input, failure at API, etc.
  it('displays matched GPs', async () => {
    // TODO: Mock request to API
    // Check the correct information is being displayed
    // Check there is a link to the IAPT results page for the CCG of the GP
    // const res = await chai.request(server).get(`${constants.siteRoot}${routes.gpResults.path}`);

    // const $ = cheerio.load(res.text);

    // expect($('.button').text()).to.equal('Find services');
    // expect($('.form').prop('action')).to.equal(`${constants.siteRoot}${routes.gpResults.path}`);
  });
});

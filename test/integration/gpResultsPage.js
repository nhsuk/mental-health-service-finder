const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const URL = require('url').URL;

const config = require('../../config/config');
const constants = require('../../app/lib/constants');
const createBody = require('../../app/lib/requests/createBody');
const iExpect = require('../lib/expectations');
const nockRequests = require('../lib/nockRequests');
const routes = require('../../config/routes');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('GP results page', () => {
  const organisationLookupIndex = config.api.indexes.orgLookup;
  const path = `/indexes/${organisationLookupIndex}/docs/search`;
  const type = constants.types.GP;

  describe('searches returning results', () => {
    describe('basic, happy path', () => {
      let $;
      let response;
      const query = 'ls1 & extra';
      const locals = { query };
      const encodedQuery = encodeURIComponent(query);
      const resultCount = 10;

      before('make request', async () => {
        const body = createBody(constants.types.GP, locals);

        nockRequests.withResponseBody(path, body, 200, 'search/multiSearchTermResults.json');

        response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${encodedQuery}`);
        $ = cheerio.load(response.text);
        iExpect.htmlWithStatus(response, 200);
      });

      it('has a back link to the start page with the previously entered query', () => {
        iExpect.backLinkContent($, `${constants.siteRoot}${routes.search.path}?query=${encodedQuery}`);
      });

      it('has a \'search again\' link to the start page with the previously entered query', () => {
        iExpect.backLinkContent($, `${constants.siteRoot}${routes.search.path}?query=${encodedQuery}`, 'search again', '.results__search__again');
      });

      it('should have a title of \'Find IAPT services - NHS.UK\'', () => {
        expect($('head title').text()).to.equal('Find IAPT services - NHS.UK');
      });

      it('should have an H1 of \'Select your GP to get you to the right service\'', () => {
        expect($('.nhsuk-page-heading h1').text()).to.equal('Select your GP to see available services');
      });

      it('the breadcrumbs should have 2 levels of links', () => {
        iExpect.breadcrumbContent($);
      });

      it('the banner should link back to Choices IAPT service search', () => {
        expect($('.back-to-choices').attr('href'))
          .to.equal('https://www.nhs.uk/service-search/Psychological-therapies-(IAPT)/LocationSearch/10008');
      });

      it('should display all of the results that were returned', () => {
        expect($('.results__item').length).to.equal(resultCount);
      });

      it('should display an address for each result', () => {
        expect($('.results__address').length).to.equal(resultCount);
      });

      it('should display the number of results returned', () => {
        expect($('.results__count').text()).to.equal(resultCount.toString());
        expect($('meta[name="DCSext.NumberOfResults"]').prop('content')).to.equal(resultCount.toString());
      });

      it('should display the search term', () => {
        expect($('.results__search__term').text()).to.equal(`'${query}'`);
      });

      it('should display all available address elements', () => {
        expect($('.results__address').first().text().trim())
          .to.equal('Balcony Level 7, The Light, The Headrow, Leeds, West Yorkshire, LS1 8TL');
      });

      it('should display a link to select the GP', () => {
        expect($('.results__gp__selection').length).to.equal(10);
      });

      it('should construct the link to select the GP with the name of the gp and the query used to get the gp results', () => {
        const results = $('.results__item');
        expect(results.length).to.equal(resultCount);
        results.each((i, elem) => {
          const href = $(elem).find('.results__gp__selection').prop('href');
          const searchParams = new URL(`http://domain.dummy${href}`).searchParams;
          const gpName = $(elem).find('.results__name').text();
          const ccgid = searchParams.get('ccgid');

          expect(ccgid).is.not.null;
          expect(parseInt(ccgid, 10)).is.a('number');
          expect(searchParams.get('type')).to.equal('iapt');
          expect(searchParams.get('gpquery')).to.equal(query);
          expect(searchParams.get('gpname')).to.equal(gpName);
        });
      });

      it('highlights should begin with the term searched for', () => {
        const highlights = $('.highlight');
        expect(highlights.length).is.equal(10);
        highlights.each((i, elem) => {
          expect($(elem).text()).to.match(new RegExp(query.split(' ')[0], 'i'));
        });
      });

      it('has a meta tag for WebTrends', () => {
        expect($('meta[name="WT.si_p"]').prop('content')).to.equal('GP Search Results');
      });
    });

    describe('multi term searches with additional whitespace', () => {
      let $;
      let response;
      const cleanedQuery = 'a b c';

      before('make request', async () => {
        const query = '   a   b   c   ';
        const locals = { query: cleanedQuery };
        const body = createBody(constants.types.GP, locals);

        nockRequests.withResponseBody(path, body, 200, 'search/tenResults.json');

        response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}`);
        $ = cheerio.load(response.text);
        iExpect.htmlWithStatus(response, 200);
      });

      it('should display the search term', () => {
        expect($('.results__search__term').text()).to.equal(`'${cleanedQuery}'`);
      });

      it('should reduce multiple character white space sequences to a single character', () => {
        expect($('.results__item').length).to.equal(10);
      });
    });

    describe('a single result', () => {
      let $;
      let response;
      const resultCount = 1;

      before('make request', async () => {
        const query = 'one result';
        const locals = { query };
        const body = createBody(constants.types.GP, locals);

        nockRequests.withResponseBody(path, body, 200, 'search/oneResult.json');

        response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}`);
        $ = cheerio.load(response.text);
        iExpect.htmlWithStatus(response, 200);
      });

      it('should have an H1 of \'Select your GP to get you to the right service\'', () => {
        expect($('.nhsuk-page-heading h1').text()).to.equal('Select your GP to see available services');
      });

      it('should display all of the results that were returned', () => {
        expect($('.results__item').length).to.equal(resultCount);
      });

      it('should display the number of results returned', () => {
        expect($('.results__count').text()).to.equal(resultCount.toString());
        expect($('meta[name="DCSext.NumberOfResults"]').prop('content')).to.equal(resultCount.toString());
      });
    });
  });

  describe('no results', () => {
    const query = 'this & that';
    const encodedQuery = encodeURIComponent(query);
    let $;

    before('make request', async () => {
      const locals = { query };
      const body = createBody(constants.types.GP, locals);
      nockRequests.withResponseBody(path, body, 200, 'search/zeroResults.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${encodedQuery}`);
      iExpect.htmlWithStatus(response, 200);
      $ = cheerio.load(response.text);
    });

    it('should display no results message when no results returned', () => {
      expect($('.nhsuk-page-heading h1').text())
        .to.equal(`Sorry, we couldn't find any GP surgeries matching '${query}'`);
    });

    it('has a \'search again\' link to the start page with the previously entered query', () => {
      iExpect.backLinkContent($, `${constants.siteRoot}${routes.search.path}?query=${encodedQuery}`, 'searching again using different search terms', '.results__search__again');
    });

    it('has an encoded back link to the start page with the previously entered query', () => {
      iExpect.backLinkContent($, `${constants.siteRoot}${routes.search.path}?query=${encodedQuery}`);
    });

    it('has a meta tag for WebTrends', () => {
      expect($('meta[name="WT.si_p"]').prop('content')).to.equal('GP Search Results');
      expect($('meta[name="DCSext.NumberOfResults"]').prop('content')).to.equal('0');
    });
  });

  describe('bad api responses', () => {
    it('should display an error page for a 400 response', async () => {
      const query = '400response';
      const locals = { query };
      const body = createBody(constants.types.GP, locals);

      nockRequests.withResponseBody(path, body, 400, 'search/400.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}`);
      iExpect.errorPageContent(response);
    });

    it('should display an error page for a 403 response', async () => {
      const query = '403response';
      const locals = { query };
      const body = createBody(constants.types.GP, locals);

      nockRequests.withNoResponseBody(path, body, 403);

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}`);
      iExpect.errorPageContent(response);
    });

    it('should display an error page for a 404 response', async () => {
      const query = '404response';
      const locals = { query };
      const body = createBody(constants.types.GP, locals);

      nockRequests.withResponseBody(path, body, 404, 'search/404.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}`);
      iExpect.errorPageContent(response);
    });

    it('should display an error page for a 415 response', async () => {
      const query = '415response';
      const locals = { query };
      const body = createBody(constants.types.GP, locals);

      nockRequests.withResponseBody(path, body, 415, 'search/415.json');

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}`);
      iExpect.errorPageContent(response);
    });

    it('should display an error page for a response that can not be parsed', async () => {
      const query = 'notJSON';
      const locals = { query };
      const body = createBody(constants.types.GP, locals);

      nockRequests.withNoResponseBody(path, body, 500);

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}`);
      iExpect.errorPageContent(response);
    });

    it('should display an error page when an error is returned from the API', async () => {
      const query = 'error';
      const locals = { query };
      const body = createBody(constants.types.GP, locals);
      const error = { message: 'something went wrong' };

      nockRequests.withError(path, body, error);

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}`);
      iExpect.errorPageContent(response);
    });
  });

  describe('undesirable queries', () => {
    const errorMessage = 'Please enter a surgery or street name to find your GP surgery.';

    it('should display an error message when no query is entered', async () => {
      const query = '';

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}`);
      iExpect.htmlWithStatus(response, 200);

      const $ = cheerio.load(response.text);

      expect($('.error-message').text()).to.equal(errorMessage);
      expect($('head title').text()).to.equal(`${errorMessage} - Find IAPT services - NHS.UK`);
    });

    it('should display an error message when the query only consists of white space', async () => {
      const query = '%20';

      const response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&query=${query}`);
      iExpect.htmlWithStatus(response, 200);

      const $ = cheerio.load(response.text);

      expect($('.error-message').text()).to.equal(errorMessage);
      expect($('head title').text()).to.equal(`${errorMessage} - Find IAPT services - NHS.UK`);
    });
  });
});

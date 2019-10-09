const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const nock = require('nock');

const {
  app: {
    description, locale, siteName, title,
  },
  siteRoot,
  types: {
    GP,
  },
} = require('../../app/lib/constants');
const createBody = require('../../app/lib/requests/createBody');
const iExpect = require('../lib/expectations');
const nockRequests = require('../lib/nockRequests');
const routes = require('../../config/routes');
const server = require('../../server');

const { expect } = chai;

chai.use(chaiHttp);

function expectStandardMetadata($) {
  const canonicalUrl = `https://127.0.0.1${siteRoot}/`;
  expect($('link[rel="canonical"]').attr('href')).to.equal(canonicalUrl);
  expect($('meta[property="og:description"]').attr('content')).to.equal(description);
  expect($('meta[property="og:image"]').attr('content')).to.equal(`${canonicalUrl}images/opengraph-image.png`);
  expect($('meta[property="og:image:alt"]').attr('content')).to.equal('nhs.uk');
  expect($('meta[property="og:image:height"]').attr('content')).to.equal('630');
  expect($('meta[property="og:image:width"]').attr('content')).to.equal('1200');
  expect($('meta[property="og:locale"]').attr('content')).to.equal(locale);
  expect($('meta[property="og:site_name"]').attr('content')).to.equal(siteName);
  expect($('meta[property="og:title"]').attr('content')).to.equal(`${title} - NHS`);
  expect($('meta[property="og:type"]').attr('content')).to.equal('website');
  expect($('meta[property="og:url"]').attr('content')).to.equal(`https://127.0.0.1${siteRoot}/`);
  expect($('meta[property="twitter:card"]').attr('content')).to.equal('summary_large_image');
  expect($('meta[property="twitter:creator"]').attr('content')).to.equal('@nhsuk');
  expect($('meta[property="twitter:site"]').attr('content')).to.equal('@nhsuk');
}

describe('Metadata', () => {
  const query = 'ls1 & extra';
  const locals = { query };
  const path = '/service-search/search';
  const encodedQuery = encodeURIComponent(query);

  afterEach('clean nock', () => {
    nock.cleanAll();
  });

  describe('the start page', () => {
    it('should include the standard properties', async () => {
      const res = await chai.request(server).get(`${siteRoot}${routes.start.path}`);
      iExpect.htmlWithStatus(res, 200);
      const $ = cheerio.load(res.text);

      expectStandardMetadata($);
    });
  });

  describe('the check page', () => {
    it('should include the standard properties', async () => {
      const res = await chai.request(server).get(`${siteRoot}${routes.check.path}`);
      iExpect.htmlWithStatus(res, 200);
      const $ = cheerio.load(res.text);

      expectStandardMetadata($);
    });
  });

  describe('the search page', () => {
    it('should include the standard properties', async () => {
      const res = await chai.request(server).get(`${siteRoot}${routes.search.path}`);
      iExpect.htmlWithStatus(res, 200);
      const $ = cheerio.load(res.text);

      expectStandardMetadata($);
    });
  });

  describe('the GP results page', () => {
    it('should include the standard properties', async () => {
      const body = createBody(GP, locals);

      nockRequests.withResponseBody(path, body, 200, 'search/multiSearchTermResults.json');

      const res = await chai.request(server).get(`${siteRoot}${routes.results.path}?type=${GP}&query=${encodedQuery}`);

      iExpect.htmlWithStatus(res, 200);
      const $ = cheerio.load(res.text);

      expectStandardMetadata($);
    });
  });

  describe('the IAPT results page', () => {
    it('should include the standard properties', async () => {
      const lat = 50;
      const lon = -1;
      const gpQuery = 'pim';
      const gpname = 'gpname';
      const body = createBody(GP, locals);

      nockRequests.withResponseBody(path, body, 200, 'search/threeResults.json');

      const res = await chai.request(server).get(`${siteRoot}${routes.results.path}?type=${GP}&ccgid=${query}&gpquery=${gpQuery}&gpname=${gpname}&lat=${lat}&lon=${lon}`);

      iExpect.htmlWithStatus(res, 200);
      const $ = cheerio.load(res.text);

      expectStandardMetadata($);
    });
  });
});

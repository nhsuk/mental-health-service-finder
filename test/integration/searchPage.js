const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');
const routes = require('../../config/routes');
const server = require('../../server');

const { expect } = chai;

chai.use(chaiHttp);

describe('Search page', () => {
  describe('basic functionality', () => {
    let $;

    before('request page', async () => {
      const res = await chai.request(server).get(`${constants.siteRoot}${routes.search.path}`);

      $ = cheerio.load(res.text);
    });

    it('has a link to the next page', () => {
      expect($('.button__search').val()).to.equal('Find');
      expect($('.form').prop('action')).to.equal(`${constants.siteRoot}${routes.results.path}`);
      expect($('.form input[name=type]').val().toUpperCase()).to.equal(`${constants.types.GP}`);
    });

    it('has a back link to the check page', () => {
      iExpect.backLinkContent($, `${constants.siteRoot}${routes.check.path}`);
    });
  });

  describe('visit from results page via back button', () => {
    const query = 'query';
    let $;

    before('request page', async () => {
      const res = await chai.request(server).get(`${constants.siteRoot}${routes.search.path}?query=${query}`);

      $ = cheerio.load(res.text);
    });

    it('pre-populates the search box with the query', () => {
      expect($('#query').val()).to.equal(query);
    });
  });
});

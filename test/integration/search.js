const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const constants = require('../../app/lib/constants');
const routes = require('../../config/routes');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Search page', () => {
  it('has a link to the next page', async () => {
    const res = await chai.request(server).get(`${constants.siteRoot}${routes.search.path}`);

    const $ = cheerio.load(res.text);

    expect($('.button').val()).to.equal('Find services');
    expect($('.form').prop('action')).to.equal(`${constants.siteRoot}${routes.results.path}`);
    expect($('.form input[name=type]').val().toUpperCase()).to.equal(`${constants.types.GP}`);
  });
});

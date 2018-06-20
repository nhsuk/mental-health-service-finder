const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const constants = require('../../app/lib/constants');
const routes = require('../../config/routes');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('GP results page', () => {
  // TODO: Extend the tests to include no results, 1 result, error input, failure at API, etc.
  it.skip('displays matched GPs', async () => {
    // TODO: Mock request to API
    // Check the correct information is being displayed
    // Check there is a link to the IAPT results page for the CCG of the GP
    const res = await chai.request(server).get(`${constants.siteRoot}${routes.gpResults.path}`);

    const $ = cheerio.load(res.text);

    expect($('.button').text()).to.equal('Find services');
    expect($('.form').prop('action')).to.equal(`${constants.siteRoot}${routes.gpResults.path}`);
  });
});

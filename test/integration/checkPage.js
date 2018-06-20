const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const constants = require('../../app/lib/constants');
const routes = require('../../config/routes');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Check page', () => {
  it('has a link to the next page', async () => {
    const res = await chai.request(server).get(`${constants.siteRoot}${routes.check.path}`);

    const $ = cheerio.load(res.text);

    expect($('.start-button').text()).to.equal('Continue');
    expect($('.start-button').prop('href')).to.equal(`${constants.siteRoot}${routes.search.path}`);
  });
});

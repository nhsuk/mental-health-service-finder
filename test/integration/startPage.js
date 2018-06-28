const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const constants = require('../../app/lib/constants');
const routes = require('../../config/routes');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Start page', () => {
  it('has a link to the next page', async () => {
    const res = await chai.request(server).get(`${constants.siteRoot}`);

    const $ = cheerio.load(res.text);

    expect($('.start-button').text()).to.equal('Find help');
    expect($('.start-button').prop('href')).to.equal(`${constants.siteRoot}${routes.check.path}`);
  });
});

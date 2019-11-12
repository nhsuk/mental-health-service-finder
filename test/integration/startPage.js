const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');
const routes = require('../../config/routes');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Start page', () => {
  let $;

  before('request page', async () => {
    const res = await chai.request(server).get(`${constants.siteRoot}${routes.start.path}`);

    $ = cheerio.load(res.text);
  });

  it('has a link to the next page', () => {
    expect($('.nhsuk-button').text()).to.contain('Start');
    expect($('.nhsuk-button').prop('href')).to.equal(`${constants.siteRoot}${routes.check.path}`);
  });

  it('has a link to the GP finder', () => {
    expect($('main').find('a').prop('href')).to.equal('https://www.nhs.uk/Service-Search/GP/LocationSearch/4');
  });

  it('the breadcrumbs should have correct levels of links', () => {
    iExpect.breadcrumbContent($, `${constants.siteRoot}${routes.start.path}`);
  });
});

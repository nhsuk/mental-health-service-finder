const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');
const routes = require('../../config/routes');
const server = require('../../server');

const { expect } = chai;

chai.use(chaiHttp);

describe('Check page', () => {
  let $;

  before('request page', async () => {
    const res = await chai.request(server).get(`${constants.siteRoot}${routes.check.path}`);

    $ = cheerio.load(res.text);
  });

  it('has a link to the next page', () => {
    expect($('.nhsuk-button').text()).to.contain('Continue');
    expect($('.nhsuk-button').prop('href')).to.contain(`${constants.siteRoot}${routes.search.path}`);
  });

  it('has a back link to the start page', () => {
    iExpect.backLinkContent($, constants.siteRoot + routes.start.path);
  });

  it('has an urgent help call out', () => {
    expect($('.samaritans__call').text()).to.equal('116 123');
  });
});

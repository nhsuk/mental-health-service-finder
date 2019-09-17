const chai = require('chai');
const chaiHttp = require('chai-http');
const cheeriload = require('../lib/helpers').cheeriload;

const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');
const routes = require('../../config/routes');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Check page', () => {
  let $;

  before('request page', async () => {
    const res = await chai.request(server).get(`${constants.siteRoot}${routes.check.path}`);
    $ = cheeriload(res);
  });

  it('has a link to the next page', () => {
    expect($('.nhsuk-button').text()).to.contain('Continue');
    expect($('.nhsuk-button').prop('href')).to.equal(`${constants.siteRoot}${routes.search.path}`);
  });

  it('has a back link to the start page', () => {
    iExpect.backLinkContent($, constants.siteRoot);
  });
});

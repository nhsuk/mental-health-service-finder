const chai = require('chai');
const chaiHttp = require('chai-http');
const cheeriload = require('../lib/helpers').cheeriload;

const constants = require('../../app/lib/constants');
const routes = require('../../config/routes');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Start page', () => {
  let $;

  before('request page', async () => {
    const res = await chai.request(server).get(`${constants.siteRoot}`);
    $ = cheeriload(res);
  });

  it('has a link to the next page', () => {
    expect($('.nhsuk-action-link').text().trim()).to.equal('Find help');
    expect($('.nhsuk-action-link a').prop('href')).to.equal(`${constants.siteRoot}${routes.check.path}`);
  });

  it('has an urgent help call out', () => {
    expect($('.nhsuk-care-card').text()).to.contain('116 123');
    expect($('.nhsuk-care-card').text()).to.contain('jo@samaritans.org');
  });
});

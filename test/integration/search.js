const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const constants = require('../../app/lib/constants');
const routes = require('../../config/routes');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Search page', () => {
  let $;

  before('request page', async () => {
    const res = await chai.request(server).get(`${constants.siteRoot}${routes.search.path}`);

    $ = cheerio.load(res.text);
  });

  it('has a link to the next page', () => {
    expect($('.button').val()).to.equal('Find your GP surgery');
    expect($('.form').prop('action')).to.equal(`${constants.siteRoot}${routes.results.path}`);
    expect($('.form input[name=type]').val().toUpperCase()).to.equal(`${constants.types.GP}`);
  });

  it('has a back link to the check page', () => {
    expect($('.link-back').prop('href')).to.equal(`${constants.siteRoot}${routes.check.path}`);
  });
});

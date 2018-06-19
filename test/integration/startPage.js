const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const constants = require('../../app/lib/constants');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Start page', () => {
  it('page title should be \'Find IAPT services - NHS.UK\'', async () => {
    const res = await chai.request(server).get(`${constants.siteRoot}`);

    const $ = cheerio.load(res.text);

    expect($('title').text()).to.equal('Find IAPT services - NHS.UK');
    expect($('.local-header--title--question').text()).to.equal('Get help with stress, anxiety or depression');
  });

  describe('return to Choices links', () => {
    it('the breadcrumb should have a link back to Choices \'Services near you\'', async () => {
      const res = await chai.request(server).get(`${constants.siteRoot}`);

      const $ = cheerio.load(res.text);

      expect($($('div.breadcrumb a')[1]).attr('href'))
        .to.equal('https://www.nhs.uk/service-search');
    });

    it('the banner should link back to Choices IAPT service search', async () => {
      const res = await chai.request(server).get(`${constants.siteRoot}`);

      const $ = cheerio.load(res.text);

      expect($('.back-to-choices').attr('href'))
        .to.equal('https://www.nhs.uk/service-search/Psychological-therapies-(IAPT)/LocationSearch/10008');
    });
  });
});

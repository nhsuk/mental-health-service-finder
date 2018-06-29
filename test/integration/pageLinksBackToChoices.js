const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const constants = require('../../app/lib/constants');
const routes = require('../../config/routes');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Page links back to Choices', () => {
  const testRoutes = Object.keys(delete routes[routes.results]);
  testRoutes.forEach(async (route) => {
    const path = routes[route].path;
    const res = await chai.request(server).get(`${constants.siteRoot}${path}`);

    describe(`for page ${path}`, () => {
      it('the breadcrumb should have a link back to Choices \'Services near you\'', () => {
        const $ = cheerio.load(res.text);

        expect($($('div.breadcrumb a')[1]).attr('href')).to.equal('https://www.nhs.uk/service-search');
      });

      it('the banner should link back to Choices IAPT service search', () => {
        const $ = cheerio.load(res.text);

        expect($('.back-to-choices').attr('href'))
          .to.equal('https://www.nhs.uk/service-search/Psychological-therapies-(IAPT)/LocationSearch/10008');
      });
    });
  });
});

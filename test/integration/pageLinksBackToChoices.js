const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');
const routes = require('../../config/routes');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Page links back to Choices', () => {
  delete routes[routes.results];
  const testRoutes = Object.keys(routes);
  expect(testRoutes).to.have.lengthOf.at.least(2);
  testRoutes.forEach(async (route) => {
    const path = routes[route].path;
    const res = await chai.request(server).get(`${constants.siteRoot}${path}`);

    describe(`for page ${path}`, () => {
      it('the breadcrumbs should have 2 levels of links', () => {
        const $ = cheerio.load(res.text);
        iExpect.breadcrumbContent($, path);
      });
    });
  });
});

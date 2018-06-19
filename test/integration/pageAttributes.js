const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');
const routes = require('../../config/routes');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Page attributes', () => {
  Object.keys(routes).forEach(async (route) => {
    const path = routes[route].path;

    const res = await chai.request(server).get(`${constants.siteRoot}${path}`);

    const $ = cheerio.load(res.text);

    describe(`for page ${path}`, () => {
      describe('status', () => {
        it('should be html and 200 response code', () => {
          iExpect.htmlWith200Status(res);
        });
      });

      describe('titles', () => {
        it('should be \'Find IAPT services - NHS.UK\'', () => {
          expect($('title').text()).to.equal('Find IAPT services - NHS.UK');
        });
      });

      describe('h1s', () => {
        it('should be correct', () => {
          const pageTitle = routes[route].title;

          expect($('h1.local-header--title--question').text()).to.equal(pageTitle);
        });
      });
    });
  });
});

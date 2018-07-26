const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const constants = require('../../app/lib/constants');
const deepClone = require('../../app/lib/utils/utils').deepClone;
const iExpect = require('../lib/expectations');
const routes = deepClone(require('../../config/routes'));
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
          iExpect.htmlWithStatus(res, 200);
        });
      });

      describe('titles', () => {
        if (path !== routes.results.path) {
          it('should be \'Find IAPT services - NHS.UK\'', () => {
            expect($('head title').text()).to.equal('Find IAPT services - NHS.UK');
          });
        }
      });

      describe('h1s', () => {
        if (path !== routes.results.path) {
          it('should be correct', () => {
            const pageTitle = routes[route].title;

            expect($('h1').text()).to.equal(pageTitle);
          });
        }
      });

      describe('meta tags', () => {
        if (path !== routes.start.path) {
          it('should include a robots noindex directive for all non \'start\' pages', () => {
            expect($('meta[name=robots]').prop('content')).to.equal('noindex');
          });
        } else {
          it('should include a robots nofollow directive for the \'start\' page', () => {
            expect($('meta[name=robots]').prop('content')).to.equal('nofollow');
          });
        }

        it('should have a meta tag for WebTrends', () => {
          expect($('meta[name="WT.si_n"]').prop('content')).to.equal('Mental Health Pilot');
        });

        if (path === routes.start.path || path === routes.check.path) {
          it('should have a meta tag for WebTrends', () => {
            expect($('meta[name="WT.si_p"]').prop('content')).to.equal('Content Page');
          });
        }
      });
    });
  });
});

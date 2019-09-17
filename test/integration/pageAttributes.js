const chai = require('chai');
const chaiHttp = require('chai-http');

const cheeriload = require('../lib/helpers').cheeriload;
const search = require('../../config/config').search;
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
    const $ = cheeriload(res);

    describe(`for page ${path}`, () => {
      describe('status', () => {
        it('should be html and 200 response code', () => {
          iExpect.htmlWithStatus(res, 200);
        });
      });

      describe('titles', () => {
        if (path !== routes.results.path) {
          const title = routes[route].title;
          it(`should be '${constants.app.title} - ${title} - NHS'`, () => {
            expect($('head title').text()).to.equal(`${constants.app.title} - ${title} - NHS`);
          });
        }
      });

      describe('h1s', () => {
        if (path !== routes.results.path) {
          it('should be correct', () => {
            const h1 = routes[route].h1;
            expect($('h1').text()).to.equal(h1);
          });
        }
      });

      describe('meta tags', () => {
        it('has meta tags for the api information', () => {
          const apiUrl = `https://${search.host}/service-search/suggest?api-version=${search.version}`;

          expect($('meta[name="api.key"]').prop('content')).to.equal(search.apiKey);
          expect($('meta[name="api.orgSuggester"]').prop('content')).to.equal(search.suggesters.organisation);
          expect($('meta[name="api.url"]').prop('content')).to.equal(apiUrl);
        });

        if (path !== routes.start.path) {
          it('should include a robots noindex directive for all non \'start\' pages', () => {
            expect($('meta[name=robots]').prop('content')).to.equal('noindex');
          });
        } else {
          it('should include a robots nofollow directive for the \'start\' page', () => {
            expect($('meta[name=robots]').prop('content')).to.equal('nofollow');
          });
        }
      });
    });
  });
});

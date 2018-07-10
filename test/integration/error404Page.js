const chai = require('chai');
const chaiHttp = require('chai-http');

const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');
const server = require('../../server');

chai.use(chaiHttp);

describe('An unknown page', () => {
  it('should return a 404', async () => {
    try {
      await chai.request(server).get(`${constants.siteRoot}/not-known`);
    } catch (err) {
      iExpect.notFoundPageContent(err);
    }
  });
});

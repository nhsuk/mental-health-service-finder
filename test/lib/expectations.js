const chai = require('chai');
const cheerio = require('cheerio');

const expect = chai.expect;

function htmlWithStatus(res, status) {
  expect(res).to.have.status(status);
  expect(res).to.be.html;
}

function errorPageContent(response) {
  htmlWithStatus(response, 500);

  const $ = cheerio.load(response.text);

  expect($('.nhsuk-page-heading h1').text().trim()).to.equal('Sorry, we are experiencing technical problems.');
  expect($('.nhsuk-page-intro').text().trim()).to.equal('Please try again later.');
}

module.exports = {
  errorPageContent,
  htmlWithStatus,
};

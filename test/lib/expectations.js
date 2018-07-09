const chai = require('chai');
const cheerio = require('cheerio');

const expect = chai.expect;

function htmlWithStatus(res, status) {
  expect(res).to.have.status(status);
  expect(res).to.be.html;
}

// eslint-disable-next-line no-script-url
function backLinkContent($, href = 'javascript:history.go(-1)', text = 'Back') {
  expect($('.link-back').prop('href')).to.equal(href);
  expect($('.link-back').text()).to.equal(text);
}

function checkPageContent($, h1, intro) {
  expect($('.nhsuk-page-heading h1').text().trim()).to.equal(h1);
  expect($('.nhsuk-page-intro').text().trim()).to.equal(intro);
}

function errorPageContent(response) {
  htmlWithStatus(response, 500);

  const $ = cheerio.load(response.text);

  checkPageContent($, 'Sorry, we are experiencing technical problems.', 'Please try again later.');
  backLinkContent($);
}

function notFoundPageContent(response) {
  htmlWithStatus(response, 404);

  const $ = cheerio.load(response.text);

  checkPageContent($, 'Page not found', 'If you have entered a web address check it was correct. You can browse from the NHS.UK home page');
  backLinkContent($);
}

module.exports = {
  backLinkContent,
  errorPageContent,
  htmlWithStatus,
  notFoundPageContent,
};

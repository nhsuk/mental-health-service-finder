const chai = require('chai');
const cheerio = require('cheerio');
const constants = require('../../app/lib/constants');

const { expect } = chai;

function htmlWithStatus(res, status) {
  expect(res).to.have.status(status);
  expect(res).to.be.html;
}

function breadcrumbContent($) {
  expect($('.nhsuk-breadcrumb__item').eq(0).text().trim()).to.equal('Home');
  expect($('.nhsuk-breadcrumb__item').eq(0).find('a').prop('href')).to.equal('https://www.nhs.uk');
  expect($('.nhsuk-breadcrumb__item').eq(1).text().trim()).to.equal('Services near you');
  expect($('.nhsuk-breadcrumb__item').eq(1).find('a').prop('href')).to.equal('https://www.nhs.uk/service-search');
}

// eslint-disable-next-line no-script-url
function backLinkContent($, href = 'javascript:history.go(-1)', text = 'Go back', selector = '.nhsuk-back-link__link') {
  expect($(selector).prop('href')).to.contain(href);
  expect($(selector).text()).to.contain(text);
}

function checkPageContent($, h1, intro) {
  expect($('h1').text().trim()).to.equal(h1);
  expect($('.nhsuk-page-intro').text().trim()).to.equal(intro);
}

function errorPageContent(response) {
  htmlWithStatus(response, 500);

  const $ = cheerio.load(response.text);

  checkPageContent($, 'Sorry, we are experiencing technical problems.', 'Please try again later.');
  backLinkContent($);
  expect($('head title').text()).to.equal(`${constants.app.title} - Sorry, we are experiencing technical problems - NHS`);
}

function notFoundPageContent(response) {
  htmlWithStatus(response, 404);

  const $ = cheerio.load(response.text);

  checkPageContent($, 'Page not found', 'If you have entered a web address check it was correct. You can browse from the NHS home page');
  backLinkContent($);
  expect($('head title').text()).to.equal(`${constants.app.title} - Page not found - NHS`);
}

module.exports = {
  backLinkContent,
  breadcrumbContent,
  errorPageContent,
  htmlWithStatus,
  notFoundPageContent,
};

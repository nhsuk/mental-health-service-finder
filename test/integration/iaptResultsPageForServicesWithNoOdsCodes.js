const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const constants = require('../../app/lib/constants');
const getHrefFromA = require('../lib/helpers').getHrefFromA;
const iExpect = require('../lib/expectations');
const routes = require('../../config/routes');
const server = require('../../server');

const northCumbriaData = require('../../data/northCumbriaCCG');
const redBridgeData = require('../../data/redBridgeCCG');
const towerHamletsData = require('../../data/towerHamletsCCG');

const expect = chai.expect;

chai.use(chaiHttp);

describe('IAPT results page for services with no ODS codes', () => {
  let $;
  let response;
  const type = constants.types.IAPT;
  const lat = 50;
  const lon = -1;
  const gpName = 'gpName';
  const resultCount = 1;

  describe('North Cumbria', () => {
    before('make request', async () => {
      const northCumbriaId = constants.ccgs.northCumbria;

      response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&ccgid=${northCumbriaId}&gpname=${gpName}&lat=${lat}&lon=${lon}`);

      $ = cheerio.load(response.text);
      iExpect.htmlWithStatus(response, 200);
      expect($('.results__item').length).to.equal(resultCount);
    });

    it('should display contact information for each result', () => {
      $('.results__item').each((i, item) => {
        const email = $(item).find('.results__email');
        expect(email.text()).to.equal(`Email: ${northCumbriaData.email}`);
        const emailHref = getHrefFromA(email);
        expect(emailHref).to.equal(`mailto:${northCumbriaData.email}`);

        const tel = $(item).find('.results__telephone');
        expect(tel.text()).to.equal(`Telephone: ${northCumbriaData.telephone}`);
        const telHref = getHrefFromA(tel);
        expect(telHref).to.equal(`tel:${northCumbriaData.telephone}`);

        const orgName = $(item).find('.results__name').text();
        const website = $(item).find('.results__website');
        expect(website.text()).to.equal(`Visit ${orgName}'s website`);
        const websiteHref = getHrefFromA(website);
        expect(websiteHref).to.equal(northCumbriaData.website);

        const selfReferral = $(item).find('.results__self__referral');
        const selfReferralHref = getHrefFromA(selfReferral);
        expect(selfReferralHref).to.equal(northCumbriaData.selfReferral);
      });
    });
  });

  describe('Red Bridge', () => {
    before('make request', async () => {
      const redBridgeId = constants.ccgs.redBridge;

      response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&ccgid=${redBridgeId}&gpname=${gpName}&lat=${lat}&lon=${lon}`);

      $ = cheerio.load(response.text);
      iExpect.htmlWithStatus(response, 200);
      expect($('.results__item').length).to.equal(resultCount);
    });

    it('should display contact information for each result', () => {
      $('.results__item').each((i, item) => {
        const email = $(item).find('.results__email');
        expect(email.text()).to.equal(`Email: ${redBridgeData.email}`);
        const emailHref = getHrefFromA(email);
        expect(emailHref).to.equal(`mailto:${redBridgeData.email}`);

        const tel = $(item).find('.results__telephone');
        expect(tel.text()).to.equal(`Telephone: ${redBridgeData.telephone}`);
        const telHref = getHrefFromA(tel);
        expect(telHref).to.equal(`tel:${redBridgeData.telephone}`);

        const orgName = $(item).find('.results__name').text();
        const website = $(item).find('.results__website');
        expect(website.text()).to.equal(`Visit ${orgName}'s website`);
        const websiteHref = getHrefFromA(website);
        expect(websiteHref).to.equal(redBridgeData.website);

        const selfReferral = $(item).find('.results__self__referral');
        const selfReferralHref = getHrefFromA(selfReferral);
        expect(selfReferralHref).to.equal(redBridgeData.selfReferral);
      });
    });
  });

  describe('Tower Hamlets', () => {
    before('make request', async () => {
      const towerHamletsIds = constants.ccgs.towerHamlets;

      response = await chai.request(server).get(`${constants.siteRoot}${routes.results.path}?type=${type}&ccgid=${towerHamletsIds}&gpname=${gpName}&lat=${lat}&lon=${lon}`);

      $ = cheerio.load(response.text);
      iExpect.htmlWithStatus(response, 200);
      expect($('.results__item').length).to.equal(resultCount);
    });

    it('should display contact information for each result', () => {
      $('.results__item').each((i, item) => {
        const email = $(item).find('.results__email');
        expect(email.text()).to.equal(`Email: ${towerHamletsData.email}`);
        const emailHref = getHrefFromA(email);
        expect(emailHref).to.equal(`mailto:${towerHamletsData.email}`);

        const tel = $(item).find('.results__telephone');
        expect(tel.text()).to.equal(`Telephone: ${towerHamletsData.telephone}`);
        const telHref = getHrefFromA(tel);
        expect(telHref).to.equal(`tel:${towerHamletsData.telephone}`);

        const orgName = $(item).find('.results__name').text();
        const website = $(item).find('.results__website');
        expect(website.text()).to.equal(`Visit ${orgName}'s website`);
        const websiteHref = getHrefFromA(website);
        expect(websiteHref).to.equal(towerHamletsData.website);

        const selfReferral = $(item).find('.results__self__referral');
        const selfReferralHref = getHrefFromA(selfReferral);
        expect(selfReferralHref).to.equal(towerHamletsData.selfReferral);
      });
    });
  });
});

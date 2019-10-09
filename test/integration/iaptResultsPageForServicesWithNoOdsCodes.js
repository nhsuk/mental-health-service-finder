const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const {
  ccgs: {
    northCumbria: northCumbriaId,
    redBridge: redBridgeId,
    towerHamlets: towerHamletsIds,
    westHampshire: westHampshireId,
  },
  siteRoot,
  types: {
    IAPT: type,
  },
} = require('../../app/lib/constants');
const { getHrefFromA } = require('../lib/helpers');
const iExpect = require('../lib/expectations');
const routes = require('../../config/routes');
const server = require('../../server');

const [northCumbriaData] = require('../../data/northCumbriaCCG');
const [redBridgeData] = require('../../data/redBridgeCCG');
const [towerHamletsData] = require('../../data/towerHamletsCCG');
const [westHampshireData] = require('../../data/westHampshireCCG');

const { expect } = chai;

chai.use(chaiHttp);

describe('IAPT results page for services with no ODS codes', () => {
  let $;
  let response;
  const lat = 50;
  const lon = -1;
  const gpName = 'gpName';
  const resultCount = 1;

  describe('North Cumbria', () => {
    before('make request', async () => {
      response = await chai.request(server).get(`${siteRoot}${routes.results.path}?type=${type}&ccgid=${northCumbriaId}&gpname=${gpName}&lat=${lat}&lon=${lon}`);

      $ = cheerio.load(response.text);
      iExpect.htmlWithStatus(response, 200);
      expect($('.results__item').length).to.equal(resultCount);
    });

    it('should display correct contact information', () => {
      const email = $('.results__email');
      expect(email.text()).to.equal(`Email: ${northCumbriaData.email}`);
      const emailHref = getHrefFromA(email);
      expect(emailHref).to.equal(`mailto:${northCumbriaData.email}`);

      const tel = $('.results__telephone');
      expect(tel.text()).to.equal(`Telephone: ${northCumbriaData.telephone}`);
      const telHref = getHrefFromA(tel);
      expect(telHref).to.equal(`tel:${northCumbriaData.telephone}`);

      const orgName = $('.results__name').text();
      const website = $('.results__website');
      expect(website.text()).to.equal(`Visit ${orgName}'s website`);
      const websiteHref = getHrefFromA(website);
      expect(websiteHref).to.equal(northCumbriaData.website);

      const selfReferral = $('.results__self__referral');
      const selfReferralHref = getHrefFromA(selfReferral);
      expect(selfReferralHref).to.equal(northCumbriaData.selfReferral);
    });
  });

  describe('Red Bridge', () => {
    before('make request', async () => {
      response = await chai.request(server).get(`${siteRoot}${routes.results.path}?type=${type}&ccgid=${redBridgeId}&gpname=${gpName}&lat=${lat}&lon=${lon}`);

      $ = cheerio.load(response.text);
      iExpect.htmlWithStatus(response, 200);
      expect($('.results__item').length).to.equal(resultCount);
    });

    it('should display correct contact information', () => {
      const email = $('.results__email');
      expect(email.text()).to.equal(`Email: ${redBridgeData.email}`);
      const emailHref = getHrefFromA(email);
      expect(emailHref).to.equal(`mailto:${redBridgeData.email}`);

      const tel = $('.results__telephone');
      expect(tel.text()).to.equal(`Telephone: ${redBridgeData.telephone}`);
      const telHref = getHrefFromA(tel);
      expect(telHref).to.equal(`tel:${redBridgeData.telephone}`);

      const orgName = $('.results__name').text();
      const website = $('.results__website');
      expect(website.text()).to.equal(`Visit ${orgName}'s website`);
      const websiteHref = getHrefFromA(website);
      expect(websiteHref).to.equal(redBridgeData.website);

      const selfReferral = $('.results__self__referral');
      const selfReferralHref = getHrefFromA(selfReferral);
      expect(selfReferralHref).to.equal(redBridgeData.selfReferral);
    });
  });

  describe('Tower Hamlets', () => {
    before('make request', async () => {
      response = await chai.request(server).get(`${siteRoot}${routes.results.path}?type=${type}&ccgid=${towerHamletsIds}&gpname=${gpName}&lat=${lat}&lon=${lon}`);

      $ = cheerio.load(response.text);
      iExpect.htmlWithStatus(response, 200);
      expect($('.results__item').length).to.equal(resultCount);
    });

    it('should display correct contact information', () => {
      const email = $('.results__email');
      expect(email.text()).to.equal('');

      const tel = $('.results__telephone');
      expect(tel.text()).to.equal(`Telephone: ${towerHamletsData.telephone}`);
      const telHref = getHrefFromA(tel);
      expect(telHref).to.equal(`tel:${towerHamletsData.telephone}`);

      const orgName = $('.results__name').text();
      const website = $('.results__website');
      expect(website.text()).to.equal(`Visit ${orgName}'s website`);
      const websiteHref = getHrefFromA(website);
      expect(websiteHref).to.equal(towerHamletsData.website);

      const selfReferral = $('.results__self__referral');
      const selfReferralHref = getHrefFromA(selfReferral);
      expect(selfReferralHref).to.equal(towerHamletsData.selfReferral);
    });
  });

  describe('West Hampshire', () => {
    before('make request', async () => {
      response = await chai.request(server).get(`${siteRoot}${routes.results.path}?type=${type}&ccgid=${westHampshireId}&gpname=${gpName}&lat=${lat}&lon=${lon}`);

      $ = cheerio.load(response.text);
      iExpect.htmlWithStatus(response, 200);
      expect($('.results__item').length).to.equal(resultCount);
    });

    it('should display correct contact information', () => {
      const email = $('.results__email');
      expect(email.text()).to.equal(`Email: ${westHampshireData.email}`);
      const emailHref = getHrefFromA(email);
      expect(emailHref).to.equal(`mailto:${westHampshireData.email}`);

      const tel = $('.results__telephone');
      expect(tel.text()).to.equal(`Telephone: ${westHampshireData.telephone}`);
      const telHref = getHrefFromA(tel);
      expect(telHref).to.equal(`tel:${westHampshireData.telephone}`);

      const orgName = $('.results__name').text();
      const website = $('.results__website');
      expect(website.text()).to.equal(`Visit ${orgName}'s website`);
      const websiteHref = getHrefFromA(website);
      expect(websiteHref).to.equal(westHampshireData.website);

      const selfReferral = $('.results__self__referral');
      const selfReferralHref = getHrefFromA(selfReferral);
      expect(selfReferralHref).to.equal(westHampshireData.selfReferral);
    });
  });
});

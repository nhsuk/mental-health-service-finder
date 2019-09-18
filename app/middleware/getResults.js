const VError = require('verror');

const constants = require('../lib/constants');
const log = require('../lib/logger');
const mapResults = require('../lib/mapResults');
const searchHistogram = require('../lib/prometheus/selectHistogram').search;
const searchRequest = require('../lib/requests/searchRequest');

const northCumbria = require('../../data/northCumbriaCCG');
const redBridge = require('../../data/redBridgeCCG');
const towerHamlets = require('../../data/towerHamletsCCG');
const bexley = require('../../data/bexleyCCG');

function isQueryForIAPTsAndForACCGWithAServiceWithNoODSCode(type, query) {
  return type === constants.types.IAPT && (query === constants.ccgs.bexley
    || query === constants.ccgs.northCumbria
    || query === constants.ccgs.redBridge
    || query === constants.ccgs.towerHamlets);
}

function getIAPTServiceWithNoODSCodeData(query) {
  let iaptResults;
  if (query === constants.ccgs.northCumbria) {
    iaptResults = northCumbria;
  } else if (query === constants.ccgs.redBridge) {
    iaptResults = redBridge;
  } else if (query === constants.ccgs.towerHamlets) {
    iaptResults = towerHamlets;
  } else if (query === constants.ccgs.bexley) {
    iaptResults = bexley;
  }
  return iaptResults;
}

async function getResults(req, res, next) {
  const query = res.locals.query;
  const type = res.locals.type;

  if (isQueryForIAPTsAndForACCGWithAServiceWithNoODSCode(type, query)) {
    res.locals.results = getIAPTServiceWithNoODSCodeData(query);
    res.render(`${type.toLowerCase()}-results`);
  } else {
    const endTimer = searchHistogram(type).startTimer();
    try {
      const response = await searchRequest(type, res.locals);
      endTimer();
      log.info({ response: { query, response } }, `${type}-response`);
      try {
        const results = mapResults(response, type, query);

        res.locals.results = results;
        res.render(`${type.toLowerCase()}-results`);
      } catch (err) {
        next(new VError(err, 'Problem processing results'));
      }
    } catch (error) {
      next(new VError(error, `Error returned from API for query of: '${res.locals.query}' and type of: '${type}'`));
    }
  }
}

module.exports = getResults;

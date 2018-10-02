const request = require('request');
const VError = require('verror');

const buildOptions = require('../lib/requests/buildOptions');
const constants = require('../lib/constants');
const log = require('../lib/logger');
const mapResults = require('../lib/mapResults');
const northCumbria = require('../../data/northCumbriaCCG');
const redBridge = require('../../data/redBridgeCCG');
const towerHamlets = require('../../data/towerHamletsCCG');
const searchHistogram = require('../lib/prometheus/selectHistogram').search;

function isQueryForIAPTsAndForACCGWithAServiceWithNoODSCode(type, query) {
  return type === constants.types.IAPT && (query === constants.ccgs.northCumbria
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
  }
  return iaptResults;
}

function getResults(req, res, next) {
  const query = res.locals.query;
  const type = res.locals.type;

  if (isQueryForIAPTsAndForACCGWithAServiceWithNoODSCode(type, query)) {
    res.locals.results = getIAPTServiceWithNoODSCodeData(query);
    res.render(`${type.toLowerCase()}-results`);
  } else {
    const options = buildOptions(type, res.locals);

    log.info({ request: options }, `${type}-request`);
    const endTimer = searchHistogram(type).startTimer();
    request.post(options, (error, response, body) => {
      endTimer();
      if (!error) {
        log.info({ response: { body, response } }, `${type}-response`);
        const statusCode = response.statusCode;
        switch (statusCode) {
          case 200: {
            log.info(`${statusCode} response`, `${type}-success`);
            try {
              const results = mapResults(body, type, query);

              res.locals.results = results;
              res.render(`${type.toLowerCase()}-results`);
            } catch (err) {
              next(new VError(err, 'Problem processing results'));
            }
            break;
          }
          default: {
            next(new VError(error, `Unprocessable status code: '${statusCode}' returned from API`));
            break;
          }
        }
      } else {
        next(new VError(error, `Error returned from API for query of: '${res.locals.query}' and type of: '${type}'`));
      }
    });
  }
}

module.exports = getResults;

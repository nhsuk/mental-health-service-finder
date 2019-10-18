const VError = require('verror');

const log = require('../lib/logger');
const mapResults = require('../lib/mapResults');
const searchHistogram = require('../lib/prometheus/selectHistogram').search;
const searchRequest = require('../lib/requests/searchRequest');

async function getResults(req, res, next) {
  const query = res.locals.query;
  const type = res.locals.type;

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

module.exports = getResults;

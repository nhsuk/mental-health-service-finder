const request = require('request');
const VError = require('verror');

const buildOptions = require('../lib/requests/buildOptions');
const log = require('../lib/logger');
const mapResults = require('../lib/mapResults');
const searchHistogram = require('../lib/prometheus/selectHistogram').search;
const types = require('../lib/constants').types;

function getResults(req, res, next) {
  const query = res.locals.cleanQuery;
  const type = res.locals.type;
  const options = buildOptions(type, query);

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
            const results = mapResults(body, type);

            if (results.length === 0 && type === types.GP) {
              res.render(`zero-${type.toLowerCase()}-results`);
            } else {
              res.locals.results = results;
              res.render(`${type.toLowerCase()}-results`);
            }
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
      next(new VError(error, `Error returned from API for query of: '${query}' and type of: '${type}'`));
    }
  });
}

module.exports = getResults;

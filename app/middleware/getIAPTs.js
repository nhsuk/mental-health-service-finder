const request = require('request');

const buildOptions = require('../lib/requests/buildOptions').forIAPTSearch;
const errorCounter = require('../lib/prometheus/counters').iaptSearchErrors;
const log = require('../lib/logger');
const requestHistogram = require('../lib/prometheus/histograms').iaptSearch;

function getIAPTs(req, res, next) {
  const ccg = req.query.ccg;
  const options = buildOptions(ccg);

  log.info({ iaptSearchRequest: options }, 'iapt-search-request');
  const endTimer = requestHistogram.startTimer();

  request.post(options, (error, response, body) => {
    endTimer();
    if (!error) {
      log.info({ iaptSearchResponse: { body, response } }, 'iapt-search-response');
      const statusCode = response.statusCode;
      switch (statusCode) {
        case 200: {
          log.info(`${statusCode} response`, 'iapt-search-success');
          const pbody = JSON.parse(body);
          const results = pbody.value;
          // TODO: The address needs stitching together
          res.locals.results = results || [];
          next();
          break;
        }
        default: {
          res.render('error');
          break;
        }
      }
    } else {
      log.error({ iaptSearchError: { error } }, 'iapt-search-error');
      errorCounter.inc(1);
      next('error');
    }
  });
}

module.exports = getIAPTs;

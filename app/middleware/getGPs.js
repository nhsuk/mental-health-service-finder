const request = require('request');

const buildOptions = require('../lib/requests/buildOptions').forGPSearch;
const errorCounter = require('../lib/prometheus/counters').gpSuggestErrors;
const log = require('../lib/logger');
const requestHistogram = require('../lib/prometheus/histograms').gpSuggest;

function getGPs(req, res, next) {
  const query = req.query.query;
  const options = buildOptions(query);

  log.info({ gpSuggestRequest: options }, 'gp-suggest-request');
  const endTimer = requestHistogram.startTimer();

  request.post(options, (error, response, body) => {
    endTimer();
    if (!error) {
      log.info({ gpSuggestResponse: { body, response } }, 'gp-suggest-response');
      const statusCode = response.statusCode;
      switch (statusCode) {
        case 200: {
          log.info(`${statusCode} response`, 'gp-suggest-success');
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
      log.error({ gpSuggestError: { error } }, 'gp-suggest-error');
      errorCounter.inc(1);
      next('error');
    }
  });
}

module.exports = getGPs;

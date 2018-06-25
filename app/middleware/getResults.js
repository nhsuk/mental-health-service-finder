const request = require('request');

const buildOptions = require('../lib/requests/buildOptions');
const errorCounter = require('../lib/prometheus/counters').searchErrors;
const log = require('../lib/logger');
const searchHistogram = require('../lib/prometheus/selectHistogram').search;

function getResults(req, res, next, type) {
  const query = req.query.query;
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
          const pbody = JSON.parse(body);
          const results = pbody.value;
          // TODO: The results need processing for display
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
      log.error({ error: { error } }, `${type}-error`);
      errorCounter(type).inc(1);
      next('error');
    }
  });
}

module.exports = getResults;

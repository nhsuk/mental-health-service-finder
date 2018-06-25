const request = require('request');

const config = require('../../config/config');
const createBody = require('../lib/requests/createBody').forGPRequest;
const headers = require('../lib/requests/headers');
const log = require('../lib/logger');
const errorCounter = require('../lib/prometheus/counters').gpSuggestErrors;
const requestHistogram = require('../lib/prometheus/histograms').gpSuggest;

function getGPs(req, res, next) {
  const query = req.query.query;
  const apiVersion = config.api.version;
  const apiHost = process.env.API_HOSTNAME; // config.api.host;
  const apiOrgIndex = config.api.indexes.orgLookup;

  const options = {
    body: JSON.stringify(createBody(query)),
    headers,
    url: `${apiHost}/indexes/${apiOrgIndex}/docs/suggest?api-version=${apiVersion}`,
  };

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

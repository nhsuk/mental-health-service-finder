const request = require('request');
const config = require('../../config/config');
const log = require('../lib/logger');
// // TODO: change to be for gp lookups
// const errorCounter = require('../lib/prometheus/counters').errorPageViews;
// const postcodesIORequestHistogram = require('../lib/prometheus/histograms').postcodesIORequest;

function getGPs(req, res, next) {
  // TODO: Request GPs
  // Process results
  // Render results
  res.locals.services = [
    { ccg: '00A', name: 'GP result one' },
    { ccg: '99Q', name: 'GP result two' },
  ];

  const apiKey = config.api.key;
  const apiVersion = config.api.version;
  const apiHost = config.api.host;
  const apiOrgIndex = config.api.indexes.orgLookup;

  const options = {
    body: JSON.stringify({
      count: true,
      search: '*',
      top: 10,
    }),
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    url: `https://${apiHost}/indexes/${apiOrgIndex}/docs/search?api-version=${apiVersion}`,
  };
  log.debug(options);

  request.post(options, (error, response, body) => {
    log.error(error);
      const pbody = JSON.parse(body);
      log.debug(pbody);
    if (!error && response.statusCode === 200) {
      // const pbody = JSON.parse(body);
      log.debug(pbody);
    } else {
      log.error(response.statusCode);
      log.error('ERROR!');
    }
  });
  next();
  // const location = res.locals.location;

  // log.debug({ location }, 'Postcode search text');
  // const endTimer = postcodesIORequestHistogram.startTimer();
  // if (location) {
  //   try {
  //     log.debug('Flexi-finder lookup, looking up isnt going to just be a postcode.');
  //     res.render('location');
  //   } catch (error) {
  //     log.debug({ location }, 'Error in postcode lookup');
  //     errorCounter.inc(1);
  //     next(error);
  //   } finally {
  //     endTimer();
  //   }
  // } else {
  //   log.debug('No postcode');
  //   next();
  // }
}

module.exports = getGPs;

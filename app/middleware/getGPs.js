const request = require('request');

const config = require('../../config/config');
const createBody = require('../lib/requests/createBody');
const headers = require('../lib/requests/headers');
const log = require('../lib/logger');
// // TODO: change to be for gp lookups
// const errorCounter = require('../lib/prometheus/counters').errorPageViews;
// const postcodesIORequestHistogram = require('../lib/prometheus/histograms').postcodesIORequest;

function getGPs(req, res, next) {
  // TODO: Request GPs
  // Process results
  // Render results

  const query = req.query.query;
  const apiVersion = config.api.version;
  const apiHost = process.env.API_HOSTNAME; // config.api.host;
  const apiOrgIndex = config.api.indexes.orgLookup;

  const options = {
    body: JSON.stringify(createBody(query)),
    headers,
    url: `${apiHost}/indexes/${apiOrgIndex}/docs/suggest?api-version=${apiVersion}`,
  };
  // console.log(options);

  request.post(options, (error, response, body) => {
    // TODO: Test around an empty body - what happens when 403/500?
    // console.log(error);
    // console.log(pbody);
    if (!error && response.statusCode === 200) {
      console.log('*************BODY POPPING*******************');
      const pbody = JSON.parse(body);
      // log.debug(pbody);
      const results = pbody.value;
      // TODO: The address needs stitching together
      res.locals.results = results || [];
      next();
    } else {
      log.error('ERROR!');
      log.error(error);
      next('error');
    }
  });
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

// const errorCounter = require('../lib/prometheus/counters').errorPageViews;
// const log = require('../lib/logger');
// // TODO: change to be for gp lookups
// const postcodesIORequestHistogram = require('../lib/prometheus/histograms').postcodesIORequest;

async function getGPs(req, res, next) {
  // TODO: Request GPs
  // Process results
  // Render results
  res.locals.services = [
    { ccg: '00A', name: 'GP result one' },
    { ccg: '99Q', name: 'GP result two' },
  ];

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

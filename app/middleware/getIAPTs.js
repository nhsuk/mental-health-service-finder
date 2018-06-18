// const VError = require('verror').VError;

// const getServiceHistogram = require('../lib/prometheus/histograms').getServices;
// const log = require('../lib/logger');
// const mapResults = require('../lib/utils/mapResults');

// function handleError(error, next) {
//   const errMsg = 'Error with services lookup';
//   const newError = new VError(error.stack, errMsg);

//   log.error({ err: newError }, errMsg);
//   next(newError);
// }

async function getIAPTs(req, res, next) {
  res.locals.services = [
    { name: 'IAPT result one', referralUrl: 'https://www.google.co.uk' },
    { name: 'IAPT result two', referralUrl: 'https://www.google.co.uk' },
  ];
  next();
  // const location = res.locals.location;
  // // const resultsLimit = res.locals.RESULTS_LIMIT;
  // const postcodeLocationDetails = res.locals.postcodeLocationDetails;

  // // TODO: Add some logging for the request duration
  // const endTimer = getServiceHistogram.startTimer();
  // const results = (resultCount) => {
  //   endTimer();
  //   log.info({
  //     location,
  //     postcodeLocationDetails,
  //     resultCount,
  //   }, 'getServices');
  // };
  // res.locals.results = mapResults(results);

  // try {
  //   // TODO: Use flexi-finder APIs
  //   log.debug('Request flexi-finder results');
  //   next();
  // } catch (error) {
  //   handleError(error, next);
  // }
}

module.exports = getIAPTs;

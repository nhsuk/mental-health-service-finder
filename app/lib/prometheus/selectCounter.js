const constants = require('../constants');
const counters = require('./counters');

function searchErrors(type) {
  switch (type) {
    case constants.types.GP: {
      return counters.gpSearchErrors;
    }
    case constants.types.IAPT: {
      return counters.iaptSearchErrors;
    }
    default: {
      throw new Error(`Unable to create Prometheus counter for unknown type: ${type}`);
    }
  }
}

module.exports = {
  applicationStarts: counters.applicationStarts,
  emptyGPSearches: counters.emptyGPSearches,
  errorPageViews: counters.errorPageViews,
  searchErrors,
};

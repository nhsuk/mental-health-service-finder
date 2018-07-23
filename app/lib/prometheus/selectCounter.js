const VError = require('verror');

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
      throw new VError(`Unable to create Prometheus Counter for unknown type: ${type}`);
    }
  }
}

module.exports = {
  applicationStarts: counters.applicationStarts,
  emptyGPSearches: counters.emptyGPSearches,
  errorPageViews: counters.errorPageViews,
  searchErrors,
};

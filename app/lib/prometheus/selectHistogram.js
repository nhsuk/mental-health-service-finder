const VError = require('verror');

const histograms = require('./histograms');
const types = require('../constants').types;

function search(type) {
  switch (type) {
    case types.GP: {
      return histograms.gpSearch;
    }
    case types.IAPT: {
      return histograms.iaptSearch;
    }
    default: {
      throw new VError(`Unable to create Prometheus Histogram for unknown type: ${type}`);
    }
  }
}

module.exports = {
  search,
};

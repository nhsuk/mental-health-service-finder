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
      throw new Error(`Unable to create Prometheus histogram for unknown type: ${type}`);
    }
  }
}

module.exports = {
  search,
};

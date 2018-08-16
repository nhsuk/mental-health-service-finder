const VError = require('verror');

const mapGPResults = require('./mapGPResults');
const mapIAPTResults = require('./mapIAPTResults');
const types = require('../lib/constants').types;

function processResults(input, type, query) {
  try {
    let results = JSON.parse(input).value || [];
    switch (type) {
      case types.GP: {
        results = mapGPResults(results, query);
        break;
      }
      case types.IAPT: {
        results.map(mapIAPTResults);
        break;
      }
      default: {
        throw new VError(`Unable to process results for unknown type: ${type}`);
      }
    }

    return results;
  } catch (err) {
    throw new VError(err, 'Problem parsing results');
  }
}

module.exports = processResults;

const VError = require('verror');

const mapGPResults = require('./mapGPResults');
const mapIAPTResults = require('./mapIAPTResults');
const types = require('../lib/constants').types;

function processResults(input, type) {
  try {
    const results = JSON.parse(input).value || [];
    switch (type) {
      case types.GP: {
        results.map(mapGPResults);
        break;
      }
      case types.IAPT: {
        results.map(mapIAPTResults);
        break;
      }
      default: {
        break;
      }
    }

    return results;
  } catch (err) {
    throw new VError(err, 'Problem parsing results');
  }
}

module.exports = processResults;

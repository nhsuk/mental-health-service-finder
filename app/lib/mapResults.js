const VError = require('verror');

const mapGPResults = require('./mapGPResults');
const mapIAPTResults = require('./mapIAPTResults');
const { types } = require('./constants');

function removeSignHealth(item) {
  return item.NACSCode !== 'AM701';
}

function processResults(input, type, query) {
  try {
    const results = JSON.parse(input).value || [];
    switch (type) {
      case types.GP: {
        return mapGPResults(results, query);
      }
      case types.IAPT: {
        const filteredResults = results.filter(removeSignHealth);
        filteredResults.map(mapIAPTResults);
        return filteredResults;
      }
      default: {
        throw new VError(`Unable to process results for unknown type: ${type}`);
      }
    }
  } catch (err) {
    throw new VError(err, 'Problem parsing results');
  }
}

module.exports = processResults;

const VError = require('verror');

const processAddress = require('./processAddress');

function processResults(input) {
  try {
    const results = JSON.parse(input).value || [];
    results.map(processAddress);
    return results;
  } catch (err) {
    throw new VError(err, 'Problem parsing results');
  }
}

module.exports = processResults;

const cleanQuery = require('../lib/utils/cleanQuery');
const { emptyGPSearches: emptyGPSearchCounter } = require('../../app/lib/prometheus/selectCounter');

function validateRequest(req, res, next) {
  const { locals: { query } } = res;
  if (!query || !query.trim()) {
    emptyGPSearchCounter.inc(1);
    res.locals.errorMessage = 'Enter the name of your GP surgery or which street it\'s on.';
    res.render('search');
  } else {
    res.locals.query = cleanQuery(query);
    next();
  }
}

module.exports = validateRequest;

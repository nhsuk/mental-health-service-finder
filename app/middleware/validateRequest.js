const cleanQuery = require('../lib/utils/cleanQuery');
const emptyGPSearchCounter = require('../../app/lib/prometheus/selectCounter').emptyGPSearches;

function validateRequest(req, res, next) {
  const query = res.locals.query;
  if (!query || !query.trim()) {
    emptyGPSearchCounter.inc(1);
    res.locals.errorMessage = 'Please enter a surgery or street name to find your GP surgery.';
    res.render('search');
  } else {
    res.locals.query = cleanQuery(query);
    next();
  }
}

module.exports = validateRequest;

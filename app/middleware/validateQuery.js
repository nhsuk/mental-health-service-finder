const emptyGPSearchCounter = require('../../app/lib/prometheus/selectCounter').emptyGPSearches;

function validateQuery(req, res, next) {
  if (!req.query.query) {
    emptyGPSearchCounter.inc(1);
    res.locals.errorMessage = 'Please enter something to find a GP';
    res.render('search');
  } else {
    next();
  }
}

module.exports = validateQuery;

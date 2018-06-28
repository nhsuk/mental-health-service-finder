const emptyGPSearchCounter = require('../../app/lib/prometheus/selectCounter').emptyGPSearches;

function validateRequest(req, res, next) {
  // TODO: extend this to cover checking for the type param if not recognised
  // go to a 404 page
  if (!req.query.query) {
    emptyGPSearchCounter.inc(1);
    res.locals.errorMessage = 'Please enter something to find a GP';
    res.render('search');
  } else {
    next();
  }
}

module.exports = validateRequest;

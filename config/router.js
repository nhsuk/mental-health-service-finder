const router = require('express').Router();

const types = require('../app/lib/constants').types;
const getResults = require('../app/middleware/getResults');
const routes = require('./routes');

router.get(routes.start.path, (req, res) => res.render('start'));

router.get(routes.check.path, (req, res) => res.render('check'));

router.get(routes.search.path, (req, res) => res.render('search'));

router.get(
  routes.gpResults.path,
  // TODO: Add query validation
  (req, res, next) => getResults(req, res, next, types.GP),
  (req, res) => res.render('gp-results')
);

router.get(
  routes.iaptResults.path,
  // TODO: Add query validation
  (req, res, next) => getResults(req, res, next, types.IAPT),
  (req, res) => res.render('iapt-results')
);

module.exports = router;

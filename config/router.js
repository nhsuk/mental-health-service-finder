const router = require('express').Router();

const routes = require('./routes');
const getIAPTs = require('../app/middleware/getIAPTs');
const getGPs = require('../app/middleware/getGPs');

router.get(routes.start.path, (req, res) => res.render('start'));

router.get(routes.check.path, (req, res) => res.render('check'));

router.get(routes.search.path, (req, res) => res.render('search'));

router.get(
  routes.gpResults.path,
  // TODO: Add query validation
  getGPs,
  (req, res) => res.render('gp-results')
);

router.get(
  routes.iaptResults.path,
  // TODO: Add query validation
  getIAPTs,
  (req, res) => res.render('iapt-results')
);

module.exports = router;

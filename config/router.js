const router = require('express').Router();

const getResults = require('../app/middleware/getResults');
const routes = require('./routes');
const validateRequest = require('../app/middleware/validateRequest');

router.get(routes.start.path, (req, res) => res.render('start'));

router.get(routes.check.path, (req, res) => res.render('check'));

router.get(routes.search.path, (req, res) => res.render('search'));

router.get(
  routes.results.path,
  validateRequest,
  (req, res, next) => getResults(req, res, next)
);

module.exports = router;

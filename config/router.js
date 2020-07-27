const router = require('express').Router();

const getResults = require('../app/middleware/getResults');
const routes = require('./routes');
const validateRequest = require('../app/middleware/validateRequest');
const headerAndFooter = require('../app/middleware/headerAndFooter');

router.use(headerAndFooter);

router.get(routes.start.path, (_, res) => res.render('start'));

router.get(routes.check.path, (_, res) => res.render('check'));

router.get(routes.search.path, (_, res) => res.render('search'));

router.get(
  routes.results.path,
  validateRequest,
  (req, res, next) => getResults(req, res, next)
);

module.exports = router;

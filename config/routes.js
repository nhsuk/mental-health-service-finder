const router = require('express').Router();
const getIAPTs = require('../app/middleware/getIAPTs');
const getGPs = require('../app/middleware/getGPs');

router.get('/', (req, res) => res.render('start'));

router.get('/check', (req, res) => res.render('check'));

router.get('/gp-search', (req, res) => res.render('gp-search'));

router.get(
  '/gp-results',
  getGPs,
  (req, res) => res.render('gp-results')
);

router.get(
  '/iapt-results',
  getIAPTs,
  (req, res) => res.render('iapt-results')
);

module.exports = router;

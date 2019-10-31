const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const express = require('express');
const nunjucks = require('nunjucks');

const constants = require('../app/lib/constants');
const errorCounter = require('../app/lib/prometheus/counters').errorPageViews;
const locals = require('../app/middleware/locals');
const helmet = require('./helmet');
const log = require('../app/lib/logger');
const promBundle = require('../app/lib/prometheus/bundle').middleware;
const router = require('./router');

module.exports = (app, config) => {
  // start collecting default metrics
  promBundle.promClient.collectDefaultMetrics();

  app.set('views', `${config.app.root}/app/views`);
  app.set('view engine', 'nunjucks');

  // Get nunjucks templates from app views and NHS frontend library
  const appViews = [
    `${config.app.root}/app/views`,
    'node_modules/nhsuk-frontend/packages/components',
  ];

  const nunjucksEnvironment = nunjucks.configure(appViews, {
    autoescape: true,
    express: app,
    watch: true,
  });
  log.debug({ config: { nunjucksEnvironment } }, 'nunjucks environment configuration');

  helmet(app);

  app.use(locals(config));

  app.use((req, res, next) => {
    log.debug({ req });
    next();
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));

  app.use(cookieParser());
  app.use(compression());

  app.use(constants.siteRoot, express.static(`${config.app.root}/public`));

  // Add static to access NHS frontend library dist folder
  app.use(constants.siteRoot, express.static('node_modules/nhsuk-frontend/dist'));

  // metrics needs to be registered before routes wishing to have metrics generated
  // see https://github.com/jochen-schweizer/express-prom-bundle#sample-uusage
  app.use(promBundle);
  app.use(constants.siteRoot, router);
  app.use(constants.siteRoot, (req, res) => {
    log.warn({ req }, 404);
    res.status(404);
    res.render('error-404');
  });

  // eslint-disable-next-line no-unused-vars
  app.use(constants.siteRoot, (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    errorCounter.inc(1);
    log.error({ err, req, res }, err.message);
    res.status(statusCode);
    res.render('error', {
      error: app.get('env') === 'development' ? err : {},
      message: err,
      title: 'error',
    });
  });

  app.get('/', (req, res) => {
    res.redirect(constants.siteRoot);
  });
};

const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const express = require('express');
const nunjucks = require('nunjucks');

const { siteRoot } = require('../app/lib/constants');
const { errorPageViews: errorCounter } = require('../app/lib/prometheus/counters');
const locals = require('../app/middleware/locals');
const helmet = require('./helmet');
const log = require('../app/lib/logger');
const { middleware: promBundle } = require('../app/lib/prometheus/bundle');
const router = require('./router');

module.exports = (app, config) => {
  // start collecting default metrics
  promBundle.promClient.collectDefaultMetrics();

  app.set('views', `${config.app.root}/app/views`);
  app.set('view engine', 'nunjucks');
  const nunjucksEnvironment = nunjucks.configure(`${config.app.root}/app/views`, {
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

  app.use(siteRoot, express.static(`${config.app.root}/public`));

  // metrics needs to be registered before routes wishing to have metrics generated
  // see https://github.com/jochen-schweizer/express-prom-bundle#sample-uusage
  app.use(promBundle);
  app.use(siteRoot, router);
  app.use(siteRoot, (req, res) => {
    log.warn({ req }, 404);
    res.status(404);
    res.render('error-404');
  });

  // eslint-disable-next-line no-unused-vars
  app.use(siteRoot, (err, req, res, next) => {
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
    res.redirect(siteRoot);
  });
};

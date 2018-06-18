const trim = require('../lib/utils/utils').trim;

module.exports = config =>
  (req, res, next) => {
    res.locals.GOOGLE_ANALYTICS_TRACKING_ID = config.analytics.googleAnalyticsId;
    res.locals.WEBTRENDS_ANALYTICS_TRACKING_ID = config.analytics.webtrendsId;
    res.locals.HOTJAR_ANALYTICS_TRACKING_ID = config.analytics.hotjarId;
    res.locals.siteRoot = req.app.locals.siteRoot;
    res.locals.assetsUrl = req.app.locals.assetsUrl;
    res.locals.location = trim(req.query.location);
    next();
  };

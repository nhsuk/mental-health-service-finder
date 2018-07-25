const constants = require('../lib/constants');
const trim = require('../lib/utils/utils').trim;
const types = require('../lib/constants').types;

function getQuery(type, query) {
  return type === types.IAPT ? query.ccgid : query.query;
}

module.exports = config => (req, res, next) => {
  res.locals.GOOGLE_ANALYTICS_TRACKING_ID = config.analytics.googleAnalyticsId;
  res.locals.WEBTRENDS_ANALYTICS_TRACKING_ID = config.analytics.webtrendsId;
  res.locals.HOTJAR_ANALYTICS_TRACKING_ID = config.analytics.hotjarId;
  res.locals.siteRoot = constants.siteRoot;
  res.locals.assetsUrl = constants.assetsUrl;
  res.locals.location = trim(req.query.location);
  const type = req.query.type && req.query.type.toUpperCase();
  res.locals.type = type;
  res.locals.query = getQuery(type, req.query);
  res.locals.gpquery = req.query.gpquery;
  res.locals.gpname = req.query.gpname;
  res.locals.origin = req.query.origin;
  next();
};

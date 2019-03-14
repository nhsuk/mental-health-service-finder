const search = require('../../config/config').search;
const constants = require('../lib/constants');
const digitalData = require('../lib/digitalData');
const trim = require('../lib/utils/utils').trim;

function getQuery(type, query) {
  return type === constants.types.IAPT ? query.ccgid : query.query;
}

const apiUrl = `https://${search.host}/service-search/suggest?api-version=${search.version}`;

module.exports = config => (req, res, next) => {
  res.locals.ADOBE_TRACKING_URL = config.analytics.adobeTrackingUrl;
  res.locals.GOOGLE_ANALYTICS_TRACKING_ID = config.analytics.googleAnalyticsId;
  res.locals.HOTJAR_ANALYTICS_TRACKING_ID = config.analytics.hotjarId;

  res.locals.siteRoot = constants.siteRoot;
  res.locals.assetsUrl = constants.assetsUrl;
  res.locals.digitalData = digitalData(req);

  res.locals.location = trim(req.query.location);
  const type = req.query.type && req.query.type.toUpperCase();
  res.locals.type = type;
  res.locals.query = getQuery(type, req.query);
  res.locals.lat = req.query.lat;
  res.locals.lon = req.query.lon;
  res.locals.gpquery = req.query.gpquery;
  res.locals.gpname = req.query.gpname;
  res.locals.origin = req.query.origin;

  res.locals.apiKey = search.apiKey;
  res.locals.apiOrgSuggester = search.suggesters.organisation;
  res.locals.apiUrl = apiUrl;
  next();
};

const path = require('path');

const rootPath = path.normalize(`${__dirname}/..`);

module.exports = {
  analytics: {
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
    hotjarId: process.env.HOTJAR_ANALYTICS_TRACKING_ID,
    webtrendsId: process.env.WEBTRENDS_ANALYTICS_TRACKING_ID,
  },
  api: {
    host: process.env.API_HOSTNAME,
    indexes: {
      orgLookup: 'organisationlookup3-index',
    },
    key: process.env.API_KEY,
    version: process.env.API_VERSION || '2016-09-01',
  },
  app: {
    env: process.env.NODE_ENV || 'development',
    headerApiUrl: 'https://refdata-api.azurewebsites.net/api/fullheadermenu',
    name: 'mental-health-service-finder',
    port: process.env.PORT || 3000,
    root: rootPath,
  },
};

const path = require('path');

const rootPath = path.normalize(`${__dirname}/..`);

module.exports = {
  analytics: {
    adobeTrackingUrl: process.env.ADOBE_TRACKING_URL,
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
    hotjarId: process.env.HOTJAR_ANALYTICS_TRACKING_ID,
    webtrendsId: process.env.WEBTRENDS_ANALYTICS_TRACKING_ID,
  },
  api: {
    host: process.env.API_HOSTNAME,
    indexes: {
      orgLookup: 'organisationlookup',
    },
    key: process.env.API_KEY,
    suggesters: {
      organisation: 'orgname-suggester',
    },
    version: process.env.API_VERSION || '2017-11-11',
  },
  app: {
    env: process.env.NODE_ENV || 'development',
    headerApiUrl: 'https://refdata-api.azurewebsites.net/api/fullheadermenu',
    name: 'mental-health-service-finder',
    port: process.env.PORT || 3000,
    root: rootPath,
  },
};

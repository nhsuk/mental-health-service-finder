const path = require('path');

const rootPath = path.normalize(`${__dirname}/..`);

module.exports = {
  analytics: {
    adobeTrackingUrl: process.env.ADOBE_TRACKING_URL,
    hotjarId: process.env.HOTJAR_ANALYTICS_TRACKING_ID,
  },
  app: {
    env: process.env.NODE_ENV || 'development',
    name: 'mental-health-service-finder',
    port: process.env.PORT || 3000,
    root: rootPath,
  },
  cookiebot: {
    scriptUrl: process.env.COOKIEBOT_SCRIPT_URL || '//assets.nhs.uk/scripts/cookie-consent.js',
  },
  headerFooterApi: {
    cacheTimeout: process.env.HEADER_FOOTER_API_CACHE_TIMEOUT || 300,
    endpoint: process.env.HEADER_FOOTER_API_ENDPOINT || 'https://nhsuk-apim-dev-uks.azure-api.net/menu/?api-version=1',
    subscriptionKey: process.env.HEADER_FOOTER_API_KEY || null,
  },
  search: {
    apiKey: process.env.SEARCH_API_KEY,
    host: process.env.SEARCH_API_HOST || 'api.nhs.uk',
    suggesters: {
      organisation: 'orgname-suggester',
    },
    version: process.env.SEARCH_API_VERSION || '1',
  },
};

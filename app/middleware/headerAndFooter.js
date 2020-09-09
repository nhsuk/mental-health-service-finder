const rp = require('request-promise-native');
const NodeCache = require('node-cache');

const { endpoint, cacheTimeout, subscriptionKey } = require('../../config/config').headerFooterApi;

const headerFooterCache = new NodeCache();

module.exports = async (_, res, next) => {
  try {
    // Check for cached data
    const cachedData = headerFooterCache.get('nhsHeaderFooterApi');
    if (cachedData) {
      // Attach cached data to response
      res.locals = {
        ...res.locals,
        footerLinks: cachedData.footerLinks,
        headerLinks: cachedData.headerLinks,
      };
      return next();
    }

    // Get data from Wagtail endpoint
    const { header, footer } = await rp(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        'Subscription-Key': subscriptionKey,
      },
      json: true,
      rejectUnauthorized: false,
    });

    // Map data for Nunjucks due to template key inconsistencies
    const headerLinks = header.items;
    const footerLinks = footer.items.map(({ url, label }) => ({
      URL: url,
      label,
    }));

    // Set data to the cache
    headerFooterCache.set('nhsHeaderFooterApi', {
      footerLinks,
      headerLinks,
    }, cacheTimeout);

    // Attach data to response
    res.locals = {
      ...res.locals,
      footerLinks,
      headerLinks,
    };

    return next();
  } catch (error) {
    return next(error);
  }
};

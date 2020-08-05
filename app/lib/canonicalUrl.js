const { siteRoot } = require('./constants');

module.exports = (req) => `https://${req.hostname}${siteRoot}/`;

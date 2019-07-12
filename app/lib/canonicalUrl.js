const siteRoot = require('./constants').siteRoot;

module.exports = req => `https://${req.hostname}${siteRoot}/`;

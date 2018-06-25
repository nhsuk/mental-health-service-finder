const config = require('../../../config/config');
const createBody = require('./createBody');
const headers = require('./headers');

const apiVersion = config.api.version;
const apiHost = config.api.host;
const apiOrgIndex = config.api.indexes.orgLookup;

function forGPSearch(query) {
  return {
    body: JSON.stringify(createBody.forGPRequest(query)),
    headers,
    url: `${apiHost}/indexes/${apiOrgIndex}/docs/suggest?api-version=${apiVersion}`,
  };
}

function forIAPTSearch(query) {
  return {
    body: JSON.stringify(createBody.forIAPTRequest(query)),
    headers,
    url: `${apiHost}/indexes/${apiOrgIndex}/docs/search?api-version=${apiVersion}`,
  };
}

module.exports = {
  forGPSearch,
  forIAPTSearch,
};

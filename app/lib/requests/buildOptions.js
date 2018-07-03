const config = require('../../../config/config');
const constants = require('../constants');
const createBody = require('./createBody');
const headers = require('./headers');
const log = require('../logger');

const apiVersion = config.api.version;
const apiHost = config.api.host;
const apiOrgIndex = config.api.indexes.orgLookup;

function forGPSearch(query) {
  return {
    body: JSON.stringify(createBody(constants.types.GP, query)),
    headers,
    url: `${apiHost}/indexes/${apiOrgIndex}/docs/search?api-version=${apiVersion}`,
  };
}

function forIAPTSearch(query) {
  return {
    body: JSON.stringify(createBody(constants.types.IAPT, query)),
    headers,
    url: `${apiHost}/indexes/${apiOrgIndex}/docs/search?api-version=${apiVersion}`,
  };
}

function buildOptions(type, query) {
  switch (type) {
    case constants.types.GP: {
      return forGPSearch(query);
    }
    case constants.types.IAPT: {
      return forIAPTSearch(query);
    }
    default: {
      log.error(`Unable to build options for uknown type: ${type} with query: ${query}`);
      throw new Error(`Unable to build options for unknown type: ${type}`);
    }
  }
}

module.exports = buildOptions;

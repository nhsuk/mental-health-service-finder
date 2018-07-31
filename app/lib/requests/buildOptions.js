const VError = require('verror');

const config = require('../../../config/config');
const constants = require('../constants');
const createBody = require('./createBody');
const headers = require('./headers');
const log = require('../logger');

const apiVersion = config.api.version;
const apiHost = config.api.host;
const apiOrgIndex = config.api.indexes.orgLookup;

function forGPSearch(locals) {
  return {
    body: JSON.stringify(createBody(constants.types.GP, locals)),
    headers,
    url: `${apiHost}/indexes/${apiOrgIndex}/docs/search?api-version=${apiVersion}`,
  };
}

function forIAPTSearch(locals) {
  return {
    body: JSON.stringify(createBody(constants.types.IAPT, locals)),
    headers,
    url: `${apiHost}/indexes/${apiOrgIndex}/docs/search?api-version=${apiVersion}`,
  };
}

function buildOptions(type, locals) {
  switch (type) {
    case constants.types.GP: {
      return forGPSearch(locals);
    }
    case constants.types.IAPT: {
      return forIAPTSearch(locals);
    }
    default: {
      log.error(`Unable to build options for uknown type: ${type} with query: ${locals.query}`);
      throw new VError(`Unable to build options for unknown type: ${type}`);
    }
  }
}

module.exports = buildOptions;

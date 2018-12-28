const VError = require('verror');

const search = require('../../../config/config').search;
const constants = require('../constants');
const createBody = require('./createBody');
const headers = require('./headers');
const log = require('../logger');

function forGPSearch(locals) {
  return {
    body: JSON.stringify(createBody(constants.types.GP, locals)),
    headers,
    url: `https://${search.host}/service-search/search?api-version=${search.version}`,
  };
}

function forIAPTSearch(locals) {
  return {
    body: JSON.stringify(createBody(constants.types.IAPT, locals)),
    headers,
    url: `https://${search.host}/service-search/search?api-version=${search.version}`,
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

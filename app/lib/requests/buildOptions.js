const VError = require('verror');

const constants = require('../constants');
const createBody = require('./createBody');
const headers = require('./headers');
const log = require('../logger');
const search = require('../../../config/config').search;

function createBaseRequest() {
  return {
    headers,
    url: `https://${search.host}/service-search/search?api-version=${search.version}`,
  };
}

function buildOptions(type, locals) {
  const request = createBaseRequest();

  switch (type) {
    case constants.types.GP: {
      request.body = JSON.stringify(createBody(constants.types.GP, locals));
      return request;
    }
    case constants.types.IAPT: {
      request.body = JSON.stringify(createBody(constants.types.IAPT, locals));
      return request;
    }
    default: {
      log.error(`Unable to build options for uknown type: ${type} with query: ${locals.query}`);
      throw new VError(`Unable to build options for unknown type: ${type}`);
    }
  }
}

module.exports = buildOptions;

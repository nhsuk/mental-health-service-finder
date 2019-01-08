const VError = require('verror');

const constants = require('../constants');
const createBody = require('./createBody');
const log = require('../logger');

function queryBuilder(type, locals) {
  switch (type) {
    case constants.types.GP: {
      return createBody(constants.types.GP, locals);
    }
    case constants.types.IAPT: {
      return createBody(constants.types.IAPT, locals);
    }
    default: {
      log.error(`Unable to build options for uknown type: ${type} with query: ${locals.query}`);
      throw new VError(`Unable to build options for unknown type: ${type}`);
    }
  }
}

module.exports = queryBuilder;

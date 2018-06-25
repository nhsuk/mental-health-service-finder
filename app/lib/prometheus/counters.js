const promClient = require('./bundle').promClient;

const constants = require('../constants');

function searchErrors(type) {
  switch (type) {
    case constants.types.GP: {
      return new promClient.Counter({ help: 'The number of GP Suggest errors', name: 'gp_suggest_errors' });
    }
    case constants.types.IAPT: {
      return new promClient.Counter({ help: 'The number of IAPT search errors', name: 'iapt_search_errors' });
    }
    default: {
      throw new Error(`Unable to create Prometheus counter for unknown type: ${type}`);
    }
  }
}

module.exports = {
  applicationStarts: new promClient.Counter({ help: 'The number of times the application has been started', name: 'app_starts' }),
  emptySearchLocationErrors: new promClient.Counter({ help: 'The number of empty search location errors', name: 'empty_search_location_errors' }),
  errorPageViews: new promClient.Counter({ help: 'The number of error page views', name: 'error_page_views' }),
  searchErrors,
};

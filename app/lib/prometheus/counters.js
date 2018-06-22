const promClient = require('./bundle').promClient;

module.exports = {
  applicationStarts: new promClient.Counter({ help: 'The number of times the application has been started', name: 'app_starts' }),
  emptySearchLocationErrors: new promClient.Counter({ help: 'The number of empty search location errors', name: 'empty_search_location_errors' }),
  errorPageViews: new promClient.Counter({ help: 'The number of error page views', name: 'error_page_views' }),
  gpSuggestErrors: new promClient.Counter({ help: 'The number of GP Suggest errors', name: 'gp_suggest_errors' }),
  iaptSearchErrors: new promClient.Counter({ help: 'The number of IAPT search errors', name: 'iapt_search_errors' }),
};

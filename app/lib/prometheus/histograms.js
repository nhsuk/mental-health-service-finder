const promClient = require('./bundle').promClient;
const buckets = require('../constants').promHistogramBuckets;

module.exports = {
  gpSuggest: new promClient.Histogram({ buckets, help: 'Duration histogram of request to get GP suggestions', name: 'gp_suggest' }),
  iaptSearch: new promClient.Histogram({ buckets, help: 'Duration histogram of request to get IAPTs', name: 'iapt_search' }),
};

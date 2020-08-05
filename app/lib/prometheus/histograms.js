const { promClient } = require('./bundle');
const buckets = require('../constants').promHistogramBuckets;

module.exports = {
  gpSearch: new promClient.Histogram({ buckets, help: 'Duration histogram of request to get GP suggestions', name: 'gp_suggest' }),
  iaptSearch: new promClient.Histogram({ buckets, help: 'Duration histogram of request to get IAPTs', name: 'iapt_search' }),
};

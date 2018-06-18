const promClient = require('./bundle').promClient;
const buckets = require('../constants').promHistogramBuckets;

module.exports = {
  getServices: new promClient.Histogram({
    buckets, help: 'Duration histogram of getting services', name: 'get_services',
  }),
};

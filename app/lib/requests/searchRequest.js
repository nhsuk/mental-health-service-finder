const rp = require('request-promise-native');

const headers = require('./headers');
const queryBuilder = require('./queryBuilder');
const search = require('../../../config/config').search;

async function request(type, locals) {
  const query = queryBuilder(type, locals);
  return rp({
    body: JSON.stringify(query),
    headers,
    method: 'POST',
    url: `https://${search.host}/service-search/search?api-version=${search.version}`,
  });
}

module.exports = request;

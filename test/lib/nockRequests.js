const nock = require('nock');

const getSampleResponse = require('../resources/getSampleResponse');
const headers = require('../../app/lib/requests/headers');
const search = require('../../config/config').search;

function createNock(path, body) {
  return nock(`https://${search.host}`, { encodedQueryParams: true, reqheaders: headers })
    .post(path, body)
    .query({ 'api-version': search.version });
}

function withError(path, body, error) {
  createNock(path, body)
    .replyWithError(error);
}

function withNoResponseBody(path, body, statusCode) {
  createNock(path, body)
    .reply(statusCode);
}

function withResponseBody(path, body, statusCode, responsePath) {
  createNock(path, body)
    .reply(statusCode, getSampleResponse(`responses/${responsePath}`));
}

module.exports = {
  withError,
  withNoResponseBody,
  withResponseBody,
};

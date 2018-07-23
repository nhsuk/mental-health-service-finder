const nock = require('nock');

const config = require('../../config/config');
const getSampleResponse = require('../resources/getSampleResponse');
const headers = require('../../app/lib/requests/headers');

const host = process.env.API_HOSTNAME;

function createNock(path, body) {
  return nock(host, { encodedQueryParams: true, reqheaders: headers })
    .post(path, body)
    .query({ 'api-version': config.api.version });
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

const searchHighlightsKey = require('./constants').searchHighlightsKey;

function mapGPResults(input) {
  const searchHighlights = input[searchHighlightsKey] || {};
  // eslint-disable-next-line no-param-reassign
  input.organisationNameHighlight =
    searchHighlights.OrganisationName || input.OrganisationName;
  // eslint-disable-next-line no-param-reassign
  input.fullAddress = [
    searchHighlights.Address1 || input.Address1,
    searchHighlights.Address2 || input.Address2,
    searchHighlights.Address3 || input.Address3,
    input.City,
    input.County,
    searchHighlights.Postcode || input.Postcode,
  ].filter(Boolean).join(', ') || undefined;
}

module.exports = mapGPResults;

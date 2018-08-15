const highlights = require('./constants').highlights;
const highlighter = require('./utils/highlighter');

function mapGPResults(results, query) {
  const terms = query.split(' ');

  results.forEach((result) => {
    // eslint-disable-next-line no-param-reassign
    result.organisationNameHighlight = highlighter({
      highlights, string: result.OrganisationName, terms,
    });
    const fullAddress = [
      result.Address1,
      result.Address2,
      result.Address3,
      result.City,
      result.County,
      result.Postcode,
    ].filter(Boolean).join(', ') || undefined;

    // eslint-disable-next-line no-param-reassign
    result.fullAddress = highlighter({
      highlights, string: fullAddress, terms,
    });
  });
  return results;
}

module.exports = mapGPResults;

function mapGPResults(input) {
  // eslint-disable-next-line no-param-reassign
  input.OrganisationNameHighlight = input['@search.highlights'].OrganisationName || input.OrganisationName;
  // eslint-disable-next-line no-param-reassign
  input.fullAddress = [
    input['@search.highlights'].Address1 || input.Address1,
    input['@search.highlights'].Address2 || input.Address2,
    input['@search.highlights'].Address3 || input.Address3,
    input.City,
    input.County,
    input['@search.highlights'].Postcode || input.Postcode,
  ].filter(Boolean).join(', ') || undefined;
}

module.exports = mapGPResults;

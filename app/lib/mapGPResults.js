function mapGPResults(input) {
  // eslint-disable-next-line no-param-reassign
  input.fullAddress = [
    input.Address1,
    input.Address2,
    input.Address3,
    input.City,
    input.County,
    input.Postcode,
  ].filter(Boolean).join(', ') || undefined;

  return input;
}

module.exports = mapGPResults;

function processAddress(input) {
  // eslint-disable-next-line no-param-reassign
  input.Address = [input.Address1, input.Address2, input.Address3, input.City, input.County, input.Postcode].filter(Boolean).join(', ');

  return input;
}

module.exports = processAddress;

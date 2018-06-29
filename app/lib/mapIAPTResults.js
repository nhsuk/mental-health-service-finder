const methodTypes = require('./constants').contactMethodTypes;

function mapContactMethod(input, contacts, methodType) {
  const result = contacts.find(contact => contact.OrganisationContactMethodType === methodType);
  if (result) {
    // eslint-disable-next-line no-param-reassign
    input[methodType.toLowerCase()] = result.OrganisationContactValue;
  }
}

function mapIAPTResults(input) {
  if (!input.Contacts) { return []; }

  const contacts = JSON.parse(input.Contacts);
  if (contacts) {
    methodTypes.forEach(methodType => mapContactMethod(input, contacts, methodType));
  }
  return input;
}

module.exports = mapIAPTResults;

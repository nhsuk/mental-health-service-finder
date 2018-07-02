const constants = require('./constants');

function mapContactMethod(input, contacts, methodType) {
  const result = contacts.find(contact => contact.OrganisationContactMethodType === methodType);
  if (result) {
    // eslint-disable-next-line no-param-reassign
    input[methodType.toLowerCase()] = result.OrganisationContactValue;
  }
}

function mapContacts(input) {
  if (!input.Contacts) { return; }

  const contacts = JSON.parse(input.Contacts);
  const methodTypes = constants.contactMethodTypes;
  if (contacts) {
    methodTypes.forEach(methodType => mapContactMethod(input, contacts, methodType));
  }
}

function mapMetrics(input) {
  if (!input.Metrics) { return; }

  const metrics = JSON.parse(input.Metrics);
  if (metrics) {
    const metric6265 = metrics.find(metric => metric.MetricID === constants.metrics.selfReferral);
    if (metric6265) {
      // eslint-disable-next-line no-param-reassign
      input.selfReferral = metric6265.LinkUrl;
    }
  }
}

function mapIAPTResults(input) {
  mapContacts(input);
  mapMetrics(input);
}

module.exports = mapIAPTResults;

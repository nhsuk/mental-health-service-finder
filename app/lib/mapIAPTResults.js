const constants = require('./constants');

function mapWebsite(input) {
  if (!input.Contacts) { return; }

  const contacts = JSON.parse(input.Contacts);
  if (contacts) {
    const websiteContact = contacts.find(
      (contact) => contact.OrganisationContactMethodType
        === constants.websiteContactMethodType
    );

    if (websiteContact) {
      // eslint-disable-next-line no-param-reassign, prefer-destructuring
      input.website = websiteContact.OrganisationContactValue;
    }
  }
}

function metricValue(metrics, metricId) {
  const metricToMap = metrics.find((metric) => metric.MetricID === metricId);
  return metricToMap ? metricToMap.Value : undefined;
}

function mapMetrics(input) {
  if (!input.Metrics) { return; }

  const metrics = JSON.parse(input.Metrics);
  if (metrics) {
    // eslint-disable-next-line no-param-reassign
    input.telephone = metricValue(metrics, constants.metrics.IAPTPhone);
    // eslint-disable-next-line no-param-reassign
    input.email = metricValue(metrics, constants.metrics.IAPTEmail);
    // eslint-disable-next-line no-param-reassign
    input.selfReferral = metricValue(metrics, constants.metrics.IAPTUrl);
  }
}

function mapIAPTResults(input) {
  mapWebsite(input);
  mapMetrics(input);
}

module.exports = mapIAPTResults;

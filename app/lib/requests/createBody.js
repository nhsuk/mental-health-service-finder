const VError = require('verror');

const constants = require('../constants');
const log = require('../logger');

function forGPSearch(query) {
  const search = query.split(' ').map(s => `${s}*`).join(' ');
  return {
    count: true,
    filter: 'OrganisationTypeID eq \'GPB\'',
    highlight: 'OrganisationName,Address1,Address2,Address3,Postcode',
    highlightPostTag: '</span>',
    highlightPreTag: '<span class="highlight">',
    search,
    searchFields: 'OrganisationName,Address1,Address2,Address3,Postcode',
    select: 'OrganisationName,Address1,Address2,Address3,City,County,Postcode,CCG',
    top: 25,
  };
}

function forIAPTSearch(query) {
  return {
    filter: `ServiceCodesProvided/any(c:search.in(c,'SRV0339')) and OrganisationTypeID ne 'TRU' and RelatedIAPTCCGs/any(c: c eq '${query}')`,
  };
}

function createBody(type, query) {
  switch (type) {
    case constants.types.GP: {
      return forGPSearch(query);
    }
    case constants.types.IAPT: {
      return forIAPTSearch(query);
    }
    default: {
      log.error(`Unable to create body for uknown type: ${type} with query: ${query}`);
      throw new VError(`Unable to create body for unknown type: ${type}`);
    }
  }
}

module.exports = createBody;

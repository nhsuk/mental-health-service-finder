const constants = require('../constants');
const log = require('../logger');

function forGPSearch(query) {
  return {
    filter: 'OrganisationTypeID eq \'GPB\'',
    search: query,
    searchFields: 'OrganisationName,OrganisationAliases,City,Postcode',
    select: 'OrganisationName,OrganisationAliases,Address1,Address2,Address3,City,County,Postcode,CCG',
    suggesterName: 'orgname-suggester',
    top: 10,
  };
}

function forIAPTSearch(query) {
  return {
    filter: `ServiceCodesProvided/any(c:search.in(c,'SRV0339')) and OrganisationTypeID ne 'TRU' and RelatedCCGs/any(g: g eq '${query}')`,
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
      throw new Error(`Unable to create body for unknown type: ${type}`);
    }
  }
}

module.exports = createBody;

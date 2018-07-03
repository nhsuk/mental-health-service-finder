const constants = require('../constants');
const log = require('../logger');

function forGPSearch(query) {
  // TODO: Tidy this up
  const search = query.split(' ');
  const s = search.map(bit => `${bit}~`);
  const sq = s.join(' ');
  console.log('************************');
  console.log(search);
  console.log(s);
  console.log(sq);
  console.log('************************');
  return {
    count: true,
    filter: 'OrganisationTypeID eq \'GPB\'',
    highlight: 'OrganisationName,Address1,Address2,Address3,Postcode',
    highlightPostTag: '</span>',
    highlightPreTag: '<span class="highlight">',
    queryType: 'full',
    search: sq,
    searchFields: 'OrganisationName,Address1,Address2,Address3,Postcode',
    select: 'OrganisationName,Address1,Address2,Address3,City,County,Postcode,CCG',
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

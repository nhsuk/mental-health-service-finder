const VError = require('verror');

const constants = require('../constants');
const log = require('../logger');

function forGPSearch(locals) {
  const search = locals.query.split(' ').map(s => `${s}*`).join(' ');
  return {
    count: true,
    filter: 'OrganisationTypeID eq \'GPB\'',
    search,
    searchFields: 'OrganisationName,Address1,Address2,Address3,Postcode',
    select: 'OrganisationName,Address1,Address2,Address3,City,County,Postcode,CCG,Longitude,Latitude',
    top: 25,
  };
}

function forIAPTSearch(locals) {
  return {
    filter: `ServiceCodesProvided/any(c:search.in(c, '${constants.IAPTServiceCode}')) and OrganisationTypeID ne 'TRU' and RelatedIAPTCCGs/any(c: c eq '${locals.query}')`,
    orderby: `geo.distance(Geocode, geography'Point(${locals.lon} ${locals.lat})')`,
  };
}

function createBody(type, locals) {
  switch (type) {
    case constants.types.GP: {
      return forGPSearch(locals);
    }
    case constants.types.IAPT: {
      return forIAPTSearch(locals);
    }
    default: {
      log.error(`Unable to create body for uknown type: ${type} with query: ${locals.query}`);
      throw new VError(`Unable to create body for unknown type: ${type}`);
    }
  }
}

module.exports = createBody;

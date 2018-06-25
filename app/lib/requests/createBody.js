function forGPRequest(searchTerm) {
  return {
    filter: 'OrganisationTypeID eq \'GPB\'',
    search: searchTerm,
    searchFields: 'OrganisationName,OrganisationAliases,City,Postcode',
    select: 'OrganisationName,OrganisationAliases,Address1,Address2,Address3,City,County,Postcode,CCG',
    suggesterName: 'orgname-suggester',
    top: 10,
  };
}

function forIAPTRequest(ccg) {
  return {
    filter: `ServiceCodesProvided/any(c:search.in(c,'SRV0339')) and OrganisationTypeID ne 'TRU' and RelatedCCGs/any(g: g eq '${ccg}')`,
  };
}

module.exports = {
  forGPRequest,
  forIAPTRequest,
};

function createBody(query) {
  return {
    filter: 'OrganisationTypeID eq \'GPB\'',
    search: query,
    searchFields: 'OrganisationName,OrganisationAliases,City,Postcode',
    select: 'OrganisationName,OrganisationAliases,Address1,Address2,Address3,City,County,Postcode,CCG',
    suggesterName: 'orgname-suggester',
    top: 10,
  };
}

module.exports = createBody;

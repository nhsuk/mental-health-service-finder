function cleanQuery(query) {
  return query && query.trim().replace(/ +/g, ' ');
}

module.exports = cleanQuery;

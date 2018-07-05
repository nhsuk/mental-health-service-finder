function cleanQuery(query) {
  return query.trim().replace(/ +/g, ' ');
}

module.exports = cleanQuery;

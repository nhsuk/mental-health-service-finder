function joinTruthyValues(obj) {
  return Object.values(obj)
    .filter(value => value)
    .join(', ');
}

function areEqual(queryItem, item) {
  return (queryItem.localeCompare(item, 'en', { sensitivity: 'base' }) === 0);
}

function trim(string) {
  return string && string.trim();
}

module.exports = {
  areEqual,
  joinTruthyValues,
  trim,
};

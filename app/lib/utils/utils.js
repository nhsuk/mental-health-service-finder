function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function joinTruthyValues(obj) {
  return Object.values(obj)
    .filter(value => value)
    .join(', ');
}

function trim(string) {
  return string && string.trim();
}

module.exports = {
  deepClone,
  joinTruthyValues,
  trim,
};

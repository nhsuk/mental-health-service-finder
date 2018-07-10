const $ = require('cheerio');

function getHrefFromA(elem) {
  return $(elem).find('a').prop('href');
}

module.exports = {
  getHrefFromA,
};

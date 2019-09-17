const $ = require('cheerio');

function getHrefFromA(elem) {
  return $(elem).find('a').prop('href');
}

// Returns jQuery like DOM
function cheeriload(res) {
  return $.load(res.text.replace(/[\n\r\t]/g, ''));
}

module.exports = {
  cheeriload,
  getHrefFromA,
};

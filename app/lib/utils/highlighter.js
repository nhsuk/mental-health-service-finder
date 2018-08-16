function highlighter(opts) {
  const { highlights, string, terms } = opts;
  const { post, pre } = highlights;
  let replacementString = string;

  if (replacementString) {
    terms.forEach((term) => {
      replacementString = replacementString.replace(new RegExp(term, 'gi'), `${pre}$&${post}`);
    });
  }
  return replacementString;
}

module.exports = highlighter;

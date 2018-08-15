function highlighter(opts) {
  const { highlights, string, terms } = opts;
  const { post, pre } = highlights;
  let s = string;

  terms.forEach((term) => {
    if (s) {
      s = s.replace(new RegExp(term, 'gi'), `${pre}$&${post}`);
    }
  });
  return s;
}

module.exports = highlighter;

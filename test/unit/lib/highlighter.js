const chai = require('chai');

const highlighter = require('../../../app/lib/utils/highlighter');

const { expect } = chai;

describe('highlighter', () => {
  const post = 'post';
  const pre = 'pre';
  const highlights = { post, pre };

  describe('when there is a single term', () => {
    it('should surround the term with highlights when string is same as the term', () => {
      const string = 'a';
      const term = 'a';
      const terms = [term];
      const result = highlighter({ highlights, string, terms });

      expect(result).to.equal(`${pre}${term}${post}`);
    });

    it('should surround the term with highlights when string begins with term', () => {
      const string = 'abc';
      const term = 'a';
      const terms = [term];
      const result = highlighter({ highlights, string, terms });

      expect(result).to.equal(`${pre}${term}${post}bc`);
    });

    it('should surround the term with highlights when string contains term', () => {
      const string = 'abc';
      const term = 'b';
      const terms = [term];
      const result = highlighter({ highlights, string, terms });

      expect(result).to.equal(`a${pre}${term}${post}c`);
    });

    it('should surround the term with highlights when string ends with term', () => {
      const string = 'abc';
      const term = 'c';
      const terms = [term];
      const result = highlighter({ highlights, string, terms });

      expect(result).to.equal(`ab${pre}${term}${post}`);
    });

    it('should surround the term with highlights when string contains two terms', () => {
      const string = 'abcabc';
      const term = 'a';
      const terms = [term];
      const result = highlighter({ highlights, string, terms });

      expect(result).to.equal(`${pre}${term}${post}bc${pre}${term}${post}bc`);
    });

    it('should surround the term with highlights when string contains terms of differing case', () => {
      const string = 'abcAbc';
      const term = 'a';
      const terms = [term];
      const result = highlighter({ highlights, string, terms });

      expect(result).to.equal(`${pre}${term}${post}bc${pre}${term.toUpperCase()}${post}bc`);
    });

    const falseyValues = [null, undefined, ''];
    falseyValues.forEach((val) => {
      it(`should return ${val} when string is ${val}`, () => {
        const string = val;
        const term = 'a';
        const terms = [term];
        const result = highlighter({ highlights, string, terms });

        expect(result).to.be.equal(val);
      });
    });
  });

  describe('when there multiple terms', () => {
    it('should surround matched terms with highlights when string contains single term', () => {
      const string = 'abc';
      const term1 = 'a';
      const term2 = 'z';
      const terms = [term1, term2];
      const result = highlighter({ highlights, string, terms });

      expect(result).to.equal(`${pre}${term1}${post}bc`);
    });

    it('should surround terms with highlights when string contains multiple terms', () => {
      const string = 'abc';
      const term1 = 'a';
      const term2 = 'c';
      const terms = [term1, term2];
      const result = highlighter({ highlights, string, terms });

      expect(result).to.equal(`${pre}${term1}${post}b${pre}${term2}${post}`);
    });
  });
});

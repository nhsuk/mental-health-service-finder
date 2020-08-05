const chai = require('chai');
const VError = require('verror');

const { Counter } = require('../../../../app/lib/prometheus/bundle').promClient;
const selectCounter = require('../../../../app/lib/prometheus/selectCounter');
const { types } = require('../../../../app/lib/constants');

const { expect } = chai;

describe('selectCounter', () => {
  describe('searchErrors', () => {
    it('should return a Counter for gp_suggest_errors for a type of \'GP\'', () => {
      const counter = selectCounter.searchErrors(types.GP);

      expect(counter).to.be.an.instanceof(Counter);
      expect(counter.name).to.equal('gp_suggest_errors');
    });

    it('should return a Counter for iapt_search_errors for a type of \'IAPT\'', () => {
      const counter = selectCounter.searchErrors(types.IAPT);

      expect(counter).to.be.an.instanceof(Counter);
      expect(counter.name).to.equal('iapt_search_errors');
    });

    it('should throw an Error when the type isn\'t recognised', () => {
      const unknownType = 'unknown';
      expect(() => selectCounter.searchErrors(unknownType))
        .to.throw(VError, `Unable to create Prometheus Counter for unknown type: ${unknownType}`);
    });
  });

  describe('applicationStarts', () => {
    it('should return a Counter for app_starts', () => {
      const counter = selectCounter.applicationStarts;

      expect(counter).to.be.an.instanceof(Counter);
      expect(counter.name).to.equal('app_starts');
    });
  });

  describe('emptyGPSearches', () => {
    it('should return a Counter for empty_GP_searches', () => {
      const counter = selectCounter.emptyGPSearches;

      expect(counter).to.be.an.instanceof(Counter);
      expect(counter.name).to.equal('empty_GP_searches');
    });
  });

  describe('errorPageViews', () => {
    it('should return a Counter for error_page_views', () => {
      const counter = selectCounter.errorPageViews;

      expect(counter).to.be.an.instanceof(Counter);
      expect(counter.name).to.equal('error_page_views');
    });
  });
});

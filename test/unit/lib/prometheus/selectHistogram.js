const chai = require('chai');

const Histogram = require('../../../../app/lib/prometheus/bundle').promClient.Histogram;
const selectHistogram = require('../../../../app/lib/prometheus/selectHistogram');
const types = require('../../../../app/lib/constants').types;

const expect = chai.expect;

describe('selectHistogram', () => {
  describe('search', () => {
    it('should return a Histogram for gp_suggest for a type of \'GP\'', () => {
      const histogram = selectHistogram.search(types.GP);

      expect(histogram).to.be.an.instanceof(Histogram);
      expect(histogram.name).to.equal('gp_suggest');
    });

    it('should return a Histogram for iapt_search for a type of \'IAPT\'', () => {
      const histogram = selectHistogram.search(types.IAPT);

      expect(histogram).to.be.an.instanceof(Histogram);
      expect(histogram.name).to.equal('iapt_search');
    });

    it('should throw an Error when the type isn\'t recognised', () => {
      const unknownType = 'unknown';
      expect(() => selectHistogram.search(unknownType))
        .to.throw(Error, `Unable to create Prometheus Histogram for unknown type: ${unknownType}`);
    });
  });
});

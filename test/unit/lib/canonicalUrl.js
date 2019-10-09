const chai = require('chai');
const canonicalUrl = require('../../../app/lib/canonicalUrl');
const { siteRoot } = require('../../../app/lib/constants');

const { expect } = chai;

describe('canonicalUrl', () => {
  it('should return the current URL via https', () => {
    const hostname = 'some.host.name';
    const reqMock = { hostname };
    const expectedUrl = `https://${hostname}${siteRoot}/`;

    const url = canonicalUrl(reqMock);

    expect(url).to.equal(expectedUrl);
  });
});

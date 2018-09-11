module.exports = {
  directives: {
    connectSrc: [
      '\'self\'',
      'assets.adobedtm.com',
      '*.hotjar.com:*',
      '*.google-analytics.com',
      'nhs.funnelback.co.uk',
      '*.search.windows.net',
    ],
    defaultSrc: [
      '\'self\'',
    ],
    fontSrc: [
      '\'self\'',
      '*.nhs.uk',
      '*.hotjar.com',
    ],
    frameSrc: [
      '*.hotjar.com',
    ],
    imgSrc: [
      '\'self\'',
      'data:',
      '*.2o7.net',
      '*.google-analytics.com',
      '*.hotjar.com',
      '*.omtrdc.net',
      '*.webtrends.com',
      '*.webtrendslive.com',
      '*.nhs.uk',
    ],
    scriptSrc: [
      '\'self\'',
      '\'unsafe-eval\'',
      '\'unsafe-inline\'',
      'data:',
      'assets.adobedtm.com',
      '*.google-analytics.com',
      '*.hotjar.com',
      '*.webtrends.com',
      '*.webtrendslive.com',
    ],
    styleSrc: [
      '\'self\'',
      '\'unsafe-inline\'',
      '*.nhs.uk',
    ],
    workerSrc: [
      '*.hotjar.com',
    ],
  },
};

module.exports = {
  directives: {
    connectSrc: [
      '\'self\'',
      'api.nhs.uk',
      'assets.adobedtm.com',
      '*.azure-api.net',
      '*.demdex.net',
      '*.hotjar.com:*',
      '*.google-analytics.com',
      'nhs.funnelback.co.uk',
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
      '*.everesttech.net',
      '*.google-analytics.com',
      '*.hotjar.com',
      '*.nhs.uk',
      '*.omtrdc.net',
    ],
    scriptSrc: [
      '\'self\'',
      '\'unsafe-eval\'',
      '\'unsafe-inline\'',
      'data:',
      'assets.adobedtm.com',
      '*.demdex.net',
      '*.google-analytics.com',
      '*.hotjar.com',
      '*.nhs.uk',
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

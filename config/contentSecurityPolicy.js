module.exports = {
  directives: {
    connectSrc: [
      '\'self\'',
      'api.nhs.uk',
      'assets.adobedtm.com',
      '*.azure-api.net',
      '*.demdex.net',
      '*.hotjar.com:*',
      '*.hotjar.io',
      '*.omtrdc.net',
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
      '*.demdex.net',
      '*.hotjar.com',
    ],
    imgSrc: [
      '\'self\'',
      'data:',
      '*.2o7.net',
      '*.everesttech.net',
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

module.exports = {
  directives: {
    connectSrc: [
      '\'self\'',
      'nhs.funnelback.co.uk',
      '*.hotjar.com:*',
      '*.google-analytics.com',
    ],
    defaultSrc: [
      '\'self\'',
    ],
    fontSrc: [
      '\'self\'',
      '*.nhs.uk',
      '*.hotjar.com',
    ],
    imgSrc: [
      '\'self\'',
      'data:',
      '*.google-analytics.com',
      '*.hotjar.com',
      '*.webtrends.com',
      '*.webtrendslive.com',
      '*.nhs.uk',
    ],
    scriptSrc: [
      '\'self\'',
      '\'unsafe-eval\'',
      '\'unsafe-inline\'',
      'data:',
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

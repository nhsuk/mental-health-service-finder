module.exports = {
  IAPTServiceCode: 'SRV0339',
  app: {
    description: 'Find psychological therapies services.',
    locale: 'en_GB',
    siteName: 'nhs.uk',
    title: 'Find psychological therapies services',
    twitter: {
      card: 'summary_large_image',
      creator: '@nhsuk',
      site: '@nhsuk',
    },
  },
  assetsUrl: 'https://assets.nhs.uk',
  ccgs: {
    northCumbria: '462881',
    redBridge: '463329',
    towerHamlets: '462934',
  },
  contactMethodTypes: ['Email', 'Telephone', 'Website'],
  highlights: { post: '</span>', pre: '<span class="highlight">' },
  metrics: {
    selfReferral: 6265,
  },
  promHistogramBuckets: [0.01, 0.05, 0.1, 0.2, 0.3, 0.5, 1, 1.5, 5, 10],
  siteRoot: '/find-a-psychological-therapies-service',
  types: {
    GP: 'GP',
    IAPT: 'IAPT',
  },
};

module.exports = {
  IAPTServiceCode: 'SRV0339',
  app: {
    description: 'If you live in England, you can refer yourself to an NHS psychological therapies service (IAPT). IAPT services offer NICE recommended therapies, such as CBT, for common problems involving stress, anxiety and depression.',
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
  highlights: { post: '</span>', pre: '<span class="highlight">' },
  metrics: {
    IAPTEmail: 9463,
    IAPTPhone: 9461,
    IAPTPhoneExt: 9462,
    IAPTUrl: 9464,
  },
  promHistogramBuckets: [0.01, 0.05, 0.1, 0.2, 0.3, 0.5, 1, 1.5, 5, 10],
  siteRoot: '/service-search/find-a-psychological-therapies-service',
  types: {
    GP: 'GP',
    IAPT: 'IAPT',
  },
  websiteContactMethodType: 'Website',
};

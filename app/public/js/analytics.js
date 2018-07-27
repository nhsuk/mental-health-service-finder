((global) => {
  const $ = global.jQuery;
  const preResultRef = 'MHClick';
  const gpResultsRef = 'MHGPClick';
  const iaptResultsRef = 'IAPTClick';
  const page = global.location.pathname.split('/').pop();

  let backLinkRef = preResultRef;
  if (page.toLowerCase() === 'results') {
    const resultsType = $('meta[name="WT.si_p"]').attr('content');
    if (resultsType.toLowerCase().indexOf('iapt') !== -1) {
      backLinkRef = iaptResultsRef;
    } else {
      backLinkRef = gpResultsRef;
    }
  }

  const selectors = [
    { queryParam: preResultRef, selector: '.button__start', text: 'Start' },
    { queryParam: preResultRef, selector: '.button__check', text: 'Check' },
    { queryParam: preResultRef, selector: '.button__search', text: 'Search' },
    { queryParam: preResultRef, selector: '.samaritans__call', text: 'SamaritansCall' },
    { queryParam: preResultRef, selector: '.samaritans__email', text: 'SamaritansEmail' },
    { queryParam: gpResultsRef, selector: '.results__gp__selection', text: 'MyGP' },
    { queryParam: gpResultsRef, selector: '.results__search__again', text: 'SearchAgain' },
    { queryParam: iaptResultsRef, selector: '.results__website', text: 'IAPTSite' },
    { queryParam: iaptResultsRef, selector: '.results__telephone', text: 'PhoneNumber' },
    { queryParam: iaptResultsRef, selector: '.results__email', text: 'Email' },
    { queryParam: iaptResultsRef, selector: '.results__self__referral', text: 'ReferralForm' },
    { queryParam: backLinkRef, selector: '.link-back', text: 'Back' },
  ];

  $.each(selectors, (index, val) => {
    $(val.selector).on('touchstart click', () => {
      if (global.Webtrends) {
        global.Webtrends.multiTrack({ argsa: [`DCSext.${val.queryParam}`, val.text, 'WT.dl', '121'] });
      }
    });
  });
})(window);

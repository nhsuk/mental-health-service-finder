((global) => {
  const $ = global.jQuery;

  function trackClick(element, arg1, arg2) {
    Webtrends.multiTrack({ argsa: [`DCSext.${arg1}`, arg2, 'WT.dl', '121'], element });
  }

  const preResultPageTrackingRef = 'MHClick';
  const gpResultsTrackingRef = 'MHGPClick';
  const iaptResultsTrackingRef = 'IAPTClick';

  $('.button__start').on('click', () => trackClick($(this), preResultPageTrackingRef, 'Start'));
  $('.button__check').on('click', () => trackClick($(this), preResultPageTrackingRef, 'Check'));
  $('.button__search').on('click', () => trackClick($(this), preResultPageTrackingRef, 'Search'));
  $('.samaritans__call').on('click', () => trackClick($(this), preResultPageTrackingRef, 'CallSamaritans'));
  $('.samaritans__email').on('click', () => trackClick($(this), preResultPageTrackingRef, 'EmailSamaritans'));
  $('.results__gp__selection').on('click', () => trackClick($(this), gpResultsTrackingRef, 'MyGP'));
  $('.results__search__again').on('click', () => trackClick($(this), gpResultsTrackingRef, 'SearchAgain'));
  $('.results__website').on('click', () => trackClick($(this), iaptResultsTrackingRef, 'IAPTSite'));
  $('.results__telephone').on('click', () => trackClick($(this), iaptResultsTrackingRef, 'PhoneNumber'));
  $('.results__email').on('click', () => trackClick($(this), iaptResultsTrackingRef, 'Email'));
  $('.results__self_referral').on('click', () => trackClick($(this), iaptResultsTrackingRef, 'ReferralForm'));

  const page = global.location.pathname.split('/').pop();
  let trackingRef = preResultPageTrackingRef;
  if (page.toLowerCase() === 'results') {
    const resultsType = $('meta[name="WT.si_p"]').attr('content');
    if (resultsType.indexOf('IAPT') !== -1) {
      trackingRef = iaptResultsTrackingRef;
    } else {
      trackingRef = gpResultsTrackingRef;
    }
  }

  $('.link-back').on('click', () => trackClick($(this), trackingRef, 'Back'));
})(window);

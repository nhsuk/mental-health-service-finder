((global) => {
  const $ = global.jQuery;
  const WT = global.Webtrends;

  function trackClick(element, arg1, arg2) {
    WT.multiTrack({ argsa: [arg1, arg2, 'WT.dl', '121'], element });
  }

  const trackingName = 'DCSext.IAPT';

  $('.start_button_tracking').on('click', () => {
    trackClick($(this), trackingName, 'StartButton');
  });
})(window);

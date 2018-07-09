(function(global) {
  'use strict'
  var $ = global.jQuery;

  function trackClick(element, arg1, arg2) {
    Webtrends.multiTrack({ element: element, argsa: [arg1, arg2, 'WT.dl', '121'] });
  }

  var trackingName = 'DCSext.IAPT';

  $('.start_button_tracking').on('click', function () {
    trackClick($(this), trackingName, 'StartButton');
  });
})(window);

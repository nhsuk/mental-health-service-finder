(function(global) {
  'use strict'
  var $ = global.jQuery;
  var document = global.document;

  $('.nhsuk-c-skiplink__link').click(function (event) {
    var skipTo = '#' + this.href.split('#')[1];
    $(skipTo).attr('tabindex', -1).on('blur focusout', function () {
      $(this).removeAttr('tabindex');
    }).focus();
  });
})(window);

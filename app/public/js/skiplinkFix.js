((global) => {
  const $ = global.jQuery;
  $('.nhsuk-c-skiplink__link').click((e) => {
    const skipTo = `#${e.target.href.split('#')[1]}`;
    $(skipTo).attr('tabindex', -1).on('blur focusout', () => {
      $(skipTo).removeAttr('tabindex');
    }).focus();
  });
})(window);

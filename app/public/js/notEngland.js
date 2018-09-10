((global) => {
  const $ = global.jQuery;
  $.get('https://ipapi.co/region_code/', (data) => {
    if (data !== 'ENG') {
      $('.banner--not-england').removeClass('hidden');
    }
  });
})(window);

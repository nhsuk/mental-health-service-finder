// eslint-disable-next-line no-use-before-define
const NHSUK = NHSUK || {};

NHSUK.queryTypeahead = ((global) => {
  const $ = global.jQuery;
  const maxResultCount = 10;
  const searchField = '#query';
  // TODO: Ideally these values will come from environment variables
  const apiVersion = '2016-09-01';
  const apiKey = '6CD985F76D7DA1E384CF0699A576ECFE';
  const indexName = 'organisationlookup3-index';
  const suggestHost = 'nhsukpoc.search.windows.net';
  const suggesterName = 'orgname-suggester';
  const searchUrl = './results?type=iapt';
  const suggestUrl = `https://${suggestHost}/indexes/${indexName}/docs/suggest?api-version=${apiVersion}`;

  const suggestions = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.whitespace,
    limit: maxResultCount,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      prepare: (query, settings) => {
        const data = {
          filter: 'OrganisationTypeID eq \'GPB\'',
          search: query,
          searchFields: 'OrganisationName,City,Postcode',
          select: 'OrganisationName,City,Postcode,CCG',
          suggesterName,
          top: maxResultCount,
        };
        /* eslint-disable no-param-reassign */
        settings.data = JSON.stringify(data);
        settings.headers = {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        };
        settings.type = 'POST';
        /* eslint-enable no-param-reassign */
        return settings;
      },
      transform: response => response.value,
      url: suggestUrl,
    },
  });

  function init() {
    suggestions.initialize();

    $(searchField).typeahead({
      classNames: {
        cursor: 'c-search-menu__item--selected',
        dataset: 'c-search-menu__results',
        highlight: 'highlight',
        hint: 'c-search__input--shadow',
        menu: 'c-search-menu',
        selectable: 'c-search-menu__item--selectable',
        suggestion: 'c-search-menu__item',
      },
      highlight: true,
      minLength: 2,
    },
    {
      display: data => data.OrganisationName,
      limit: maxResultCount,
      name: '-suggestions',
      source: suggestions,
      templates: {
        header: '<li class="c-search-menu__prepend">Search suggestions</li>',
        notFound: '<li class="c-search-menu__nosuggestions">No suggestions</li>',
        suggestion: (data) => {
          const query = encodeURIComponent(data.CCG[0]);
          const gpname = encodeURIComponent(data.OrganisationName);
          return `<li><a href="${searchUrl}&query=${query}&gpquery=${gpname}&gpname=${gpname}&origin=search">${data.OrganisationName}, ${data.City}, ${data.Postcode}</a></li>`;
        },
      },
    })
      .bind('typeahead:open', () => {
        const val = $(searchField).typeahead('val');
        const value = $(searchField).attr('value');

        if (val === value) {
          $(searchField).typeahead('val', value);
        }
        if (val.toLowerCase() === 'enter a search term') {
          $(searchField).typeahead('val', '');
        }
      })
      .bind('typeahead:render', () => {
        const $searchField = $(searchField);
        $('.c-search-menu__results').wrapInner('<ul class="c-search-menu__list"></ul>');
        $('.c-search-menu__list').css('width', $searchField.outerWidth());
        $('.c-search-menu').insertAfter($searchField);
      })
      .bind('typeahead:close', () => {
        $('.c-search__input').removeClass('c-search__input--dropdown');
        $('.c-search__submit').removeClass('c-search__submit--dropdown');
      })
      .bind('typeahead:idle', () => {
        $('.c-search-menu__list').hide();
      });
  }

  return {
    init,
  };
})(window);

$(() => {
  NHSUK.queryTypeahead.init();
  // hide the extra input field created by typeahead to screen readers
  $('.c-search__input--shadow').attr('aria-hidden', 'true').addClass('visually-hidden');
  $('.c-search__input.tt-input').attr('role', 'textbox');
});

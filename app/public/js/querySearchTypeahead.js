// eslint-disable-next-line no-use-before-define
const NHSUK = NHSUK || {};

NHSUK.queryTypeahead = ((global) => {
  const $ = global.jQuery;
  const mainId = '#main-content';
  const maxResultCount = 10;
  const searchField = '#query';
  // TODO: Ideally these values will come from environment variables
  const apiVersion = '2016-09-01';
  const apiKey = '6CD985F76D7DA1E384CF0699A576ECFE';
  const indexName = 'organisationlookup3-index';
  const suggestHost = 'nhsukpoc.search.windows.net';
  const suggesterName = 'orgname-suggester';
  const resultsUrl = './results?type=iapt';
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

  function generateIAPTResultsUrl(data) {
    const ccgid = encodeURIComponent(data.CCG[0]);
    const gpname = encodeURIComponent(data.OrganisationName);
    return `${resultsUrl}&ccgid=${ccgid}&gpquery=${gpname}&gpname=${gpname}&origin=search`;
  }

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
          const link = generateIAPTResultsUrl(data);
          return `<li><a href="${link}">${data.OrganisationName}, ${data.City}, ${data.Postcode}</a></li>`;
        },
      },
    })
      .bind('typeahead:open', () => {
        const $searchField = $(searchField);
        const val = $searchField.typeahead('val');
        const value = $searchField.attr('value');

        if (val === value) {
          $searchField.typeahead('val', value);
        }
      })
      .bind('typeahead:render', () => {
        const $searchField = $(searchField);
        $(`${mainId} .c-search-menu__results`).wrapInner('<ul class="c-search-menu__list"></ul>');
        $(`${mainId} .c-search-menu__list`).css('width', $searchField.outerWidth());
        $(`${mainId} .c-search-menu`).insertAfter($searchField);
      })
      .bind('typeahead:select', (e, o) => {
        $('#type').val('iapt');
        $('#ccgid').val(o.CCG[0]);
        $('#gpname').val(o.OrganisationName);
        $('#gpquery').val(o.OrganisationName);
      });
  }

  return {
    init,
  };
})(window);

$(() => {
  NHSUK.queryTypeahead.init();
  const mainId = '#main-content';
  // hide the extra input field created by typeahead to screen readers
  $(`${mainId} .c-search__input--shadow`).attr('aria-hidden', 'true').addClass('visually-hidden');
  $(`${mainId} .c-search__input.tt-input`).attr('role', 'textbox');
});

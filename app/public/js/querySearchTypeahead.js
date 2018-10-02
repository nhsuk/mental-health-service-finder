// eslint-disable-next-line no-use-before-define
const NHSUK = NHSUK || {};

NHSUK.queryTypeahead = ((global) => {
  const $ = global.jQuery;
  const mainId = '#main-content';
  const maxResultCount = 5;
  const searchField = '#query';
  const apiKey = $('meta[name="api.key"]').prop('content');
  const suggesterName = $('meta[name="api.orgSuggester"]').prop('content');
  const suggestUrl = $('meta[name="api.url"]').prop('content');
  const searchFields = 'OrganisationName,Address1,Address2,Address3,City';

  const suggestions = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.whitespace,
    limit: maxResultCount,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      prepare: (query, settings) => {
        const data = {
          filter: 'OrganisationTypeID eq \'GPB\'',
          fuzzy: true,
          search: query,
          searchFields,
          select: `${searchFields},Postcode,CCG,Latitude,Longitude`,
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

  function scrollInputForNarrowView() {
    if (global.innerWidth < 641) {
      const top = $(`${mainId} .form-group`).offset().top;
      global.scrollTo(0, top);
    }
  }

  function resetQueryFields() {
    $('#type').val('gp');
    $('#ccgid').val();
    $('#gpname').val();
    $('#gpquery').val();
    $('#origin').val();
    $('#lat').val();
    $('#lon').val();
  }

  function hideSecondInputForScreenReaders() {
    $(`${mainId} .c-search__input--shadow`).attr('aria-hidden', 'true').addClass('visually-hidden');
    $(`${mainId} .c-search__input.tt-input`).attr('role', 'textbox');
  }

  function generateAddressText(data) {
    return [data.Address1, data.Address2, data.City, data.Postcode]
      .filter(Boolean)
      .join(', ')
      .replace(',,', ',');
  }

  function init() {
    resetQueryFields();
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
      highlight: false,
      minLength: 2,
    },
    {
      display: data => data.OrganisationName,
      limit: maxResultCount,
      name: '-suggestions',
      source: suggestions,
      templates: {
        suggestion: (data) => {
          const address = generateAddressText(data);
          return `<li><p class="bold menu__item--name">${data.OrganisationName}<span class="visually-hidden"> has been selected</span></p><p class="menu__item--address">${address}</p></li>`;
        },
      },
    })
      .bind('typeahead:active', () => {
        scrollInputForNarrowView();
      })
      .bind('typeahead:open', () => {
        const $searchField = $(searchField);
        const val = $searchField.typeahead('val');
        const value = $searchField.attr('value');

        if (val === value) {
          $searchField.typeahead('val', value);
        }
      })
      .bind('typeahead:render', (e, data) => {
        if (data.length) {
          const $searchField = $(searchField);
          $(`${mainId} .c-search-menu__results`).wrapInner('<ul class="c-search-menu__list"></ul>');
          $(`${mainId} .c-search-menu__list`).css('width', $searchField.outerWidth());
          $(`${mainId} .c-search-menu`).insertAfter($searchField);
        }
      })
      .bind('typeahead:select', (e, data) => {
        $('#type').val('iapt');
        $('#ccgid').val(data.CCG[0]);
        $('#gpname').val(data.OrganisationName);
        $('#gpquery').val(data.OrganisationName);
        $('#lat').val(data.Latitude);
        $('#lon').val(data.Longitude);
        $('#origin').val('search');
        $(`${mainId} form`).submit();
      });

    hideSecondInputForScreenReaders();
  }

  return {
    init,
  };
})(window);

$(() => {
  NHSUK.queryTypeahead.init();
});

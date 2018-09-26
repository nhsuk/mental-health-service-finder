// <details> polyfill
// http://caniuse.com/#feat=details

// FF Support for HTML5's <details> and <summary>
// https://bugzilla.mozilla.org/show_bug.cgi?id=591737

// http://www.sitepoint.com/fixing-the-details-element/

// Taken from govuk_frontend_toolkit
// https://github.com/alphagov/govuk_frontend_toolkit/blob/master/javascripts/govuk/details.polyfill.js

// Removed the addition of extra element to display arrow for non native
// implementation, as this is done in CSS

/* eslint-disable no-underscore-dangle */
((global) => {
  const window = global;
  const document = global.document;
  const $ = global.jQuery;

  const details = {
    KEY_ENTER: 13,
    KEY_SPACE: 32,
    NATIVE_DETAILS: typeof document.createElement('details').open === 'boolean',

    // Handle cross-modal click events
    addClickEvent: (node, callback) => {
      details.addEvent(node, 'keypress', (e, target) => {
        // When the key gets pressed - check if it is enter or space
        if (details.charCode(e) === details.KEY_ENTER
          || details.charCode(e) === details.KEY_SPACE) {
          if (target.nodeName.toLowerCase() === 'summary') {
            // Prevent space from scrolling the page
            // and enter from submitting a form
            details.preventDefault(e);
            // Click to let the click event do all the necessary action
            if (target.click) {
              target.click();
            } else {
              // except Safari 5.1 and under don't support .click() here
              callback(e, target);
            }
          }
        }
      });

      // Prevent keyup to prevent clicking twice in Firefox when using space key
      details.addEvent(node, 'keyup', (e, target) => {
        if (details.charCode(e) === details.KEY_SPACE) {
          if (target.nodeName === 'SUMMARY') {
            details.preventDefault(e);
          }
        }
      });

      details.addEvent(node, 'click', (e, target) => {
        callback(e, target);
      });
    },

    // Initialisation function
    addDetailsPolyfill: (list, container) => {
      // eslint-disable-next-line no-param-reassign
      container = container || document.body;
      // If this has already happened, just return
      // else set the flag so it doesn't happen again
      if (details.started) {
        return;
      }
      details.started = true;

      // Get the collection of details elements, but if that's empty
      // then we don't need to bother with the rest of the scripting
      // eslint-disable-next-line no-param-reassign
      list = container.getElementsByTagName('details');
      if (list.length === 0) {
        return;
      }
      // else iterate through them to apply their initial state
      const n = list.length;
      let i = 0;
      for (i; i < n; i++) {
        const detailsItem = list[i];

        // Save shortcuts to the inner summary and content elements
        detailsItem.__summary = detailsItem.getElementsByTagName('summary').item(0);
        detailsItem.__content = detailsItem.getElementsByTagName('div').item(0);

        if (!detailsItem.__summary || !detailsItem.__content) {
          return;
        }
        // If the content doesn't have an ID, assign it one now
        // which we'll need for the summary's aria-controls assignment
        if (!detailsItem.__content.id) {
          detailsItem.__content.id = `detailsItem-content-${i}`;
        }

        // Add role=button to summary
        detailsItem.__summary.setAttribute('role', 'button');
        // Add aria-controls
        detailsItem.__summary.setAttribute('aria-controls', detailsItem.__content.id);

        // Set tabIndex so the summary is keyboard accessible for non-native elements
        // http://www.saliences.com/browserBugs/tabIndex.html
        if (!details.NATIVE_DETAILS) {
          detailsItem.__summary.tabIndex = 0;
        }

        // Detect initial open state
        const openAttr = detailsItem.getAttribute('open') !== null;
        if (openAttr === true) {
          detailsItem.__summary.setAttribute('aria-expanded', 'true');
          detailsItem.__content.setAttribute('aria-hidden', 'false');
        } else {
          detailsItem.__summary.setAttribute('aria-expanded', 'false');
          detailsItem.__content.setAttribute('aria-hidden', 'true');
          if (!details.NATIVE_DETAILS) {
            detailsItem.__content.style.display = 'none';
          }
        }

        // Create a circular reference from the summary back to its
        // parent details element, for convenience in the click handler
        detailsItem.__summary.__details = detailsItem;
      }

      // Bind a click event to handle summary elements
      details.addClickEvent(container, (e, summary) => {
        // eslint-disable-next-line no-param-reassign
        summary = details.getAncestor(summary, 'summary');
        if (!(summary)) {
          return true;
        }
        return details.statechange(summary);
      });
    },
    //
    // Add event construct for modern browsers or IE
    // which fires the callback with a pre-converted target reference
    addEvent: (node, type, callback) => {
      if (node.addEventListener) {
        node.addEventListener(type, (e) => {
          callback(e, e.target);
        }, false);
      } else if (node.attachEvent) {
        node.attachEvent(`on${type}`, (e) => {
          callback(e, e.srcElement);
        });
      }
    },

    // Cross-browser character code / key pressed
    charCode: e => ((typeof e.which === 'number') ? e.which : e.keyCode),

    destroy: (node) => {
      details.removeEvent(node, 'click');
    },

    // Get the nearest ancestor element of a node that matches a given tag name
    getAncestor: (node, match) => {
      do {
        if (!node || node.nodeName.toLowerCase() === match) {
          break;
        }
        // eslint-disable-next-line no-param-reassign
        node = node.parentNode;
      } while (node);

      return node;
    },

    // Bind two load events for modern and older browsers
    // If the first one fires it will set a flag to block the second one
    // but if it's not supported then the second one will fire
    init: () => {
      details.addEvent(document, 'DOMContentLoaded', details.addDetailsPolyfill);
      details.addEvent(window, 'load', details.addDetailsPolyfill);
    },

    // Cross-browser preventing default action
    preventDefault: (e) => {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    },

    removeEvent: (node, type) => {
      if (node.removeEventListener) {
        node.removeEventListener(type, () => {
        }, false);
      } else if (node.detachEvent) {
        node.detachEvent(`on${type}`, () => {
        });
      }
    },

    // Create a started flag so we can prevent the initialisation
    // function firing from both DOMContentLoaded and window.onload
    started: false,

    // Define a statechange function that updates aria-expanded and style.display
    // Also update the arrow position
    statechange: (summary) => {
      const expanded = summary.__details.__summary.getAttribute('aria-expanded') === 'true';
      const hidden = summary.__details.__content.getAttribute('aria-hidden') === 'true';

      summary.__details.__summary.setAttribute('aria-expanded', (expanded ? 'false' : 'true'));
      summary.__details.__content.setAttribute('aria-hidden', (hidden ? 'false' : 'true'));

      if (!details.NATIVE_DETAILS) {
        // eslint-disable-next-line no-param-reassign
        summary.__details.__content.style.display = (expanded ? 'none' : '');

        const hasOpenAttr = summary.__details.getAttribute('open') !== null;
        if (!hasOpenAttr) {
          summary.__details.setAttribute('open', 'open');
        } else {
          summary.__details.removeAttribute('open');
        }
      }
      return true;
    },
  };

  $(() => {
    details.init();
  });
})(window);
/* eslint-enable no-underscore-dangle */

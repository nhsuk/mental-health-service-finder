0.24.0 / TBC
===================
- Update npm dependencies

0.23.0 / 2019-11-18
===================
- Use `nhsuk-frontend` for views, scss and JS
- Remove redundant JS and SCSS replaced by `nhsuk-frontend`
- Update site root to include `/service-search`

0.22.0 / 2019-10-31
===================
- Remove Greenkeeper - it is done automatically by the service
- Remove special case for West Hampshire CCG
- Remove special case for Redbridge CCG
- Remove special case for Tower Hamlets CCG
- Remove special case for North Cumbria CCG

0.21.0 / 2019-10-11
===================
- Replace (deprecated) `istanbul` with `nyc`
- Use service specific contact details

0.20.0 / 2019-09-26
===================
- Add footer link to beta cookie policy page 

0.19.0 / 2019-09-20
===================
- Update npm dependencies
- Upgrade Docker container to `node:10.16.3-alpine`
- Add West Hampshire CCG IAPT service

0.18.0 / 2019-07-18
===================
- Update npm dependencies
- Use full path for Open Graph image

0.17.0 / 2019-07-18
===================
- Update npm dependencies
- Upgrade Docker container to use latest node LTS
- Add additional (and update existing) metadata properties to meet minimum set
- Allow Adobe and Hotjar to connect to additional domains

0.16.0 / 2019-03-20
===================
- Upgrade Docker container to `node:10.15.3-alpine`
- Update npm dependencies
- Remove simple cookie banner
- Remove Webtrends (no longer used)
- Remove GA (no longer used)

0.15.0 / 2019-01-11
===================
- Update npm dependencies
- Enable debugging
- Upgrade Docker container to `node:10.15.0-alpine`
- Access APIs via APIM instead of going direct
- Use async/await pattern for API requests

0.14.0 / 2018-11-29
===================
- Upgrade Docker container to `node:10.14.0-alpine`
- Update npm dependencies
- Update Redbridge CCG details

0.13.0 / 2018-11-20
===================
- Update npm dependencies
- Create `digitalData` object for use by Adobe Analytics
- Update CSP for compatibility with Adobe Analytics

0.12.0 / 2018-10-09
===================
- Prevent IE 11 from focusing on SVGs
- Update npm dependencies

0.11.0 / 2018-10-03
===================
- Update npm dependencies
- Multiple accessibility improvements
- Upgrade to `node:8.12.0-alpine`
- Fix skip to content for voice over
- Add Tower Hamlets CCG IAPT service

0.10.0 / 2018-09-14
===================
- Add Adobe Analytics
- Update npm dependencies

0.9.0 / 2018-09-12
==================
- Be specific about service being England only

0.8.0 / 2018-09-07
==================
- Do not link to beta home page
- Track GP search link
- Update npm dependencies
- Update 'contact-us' footer link
- Update 'care and support' header link

0.7.0 / 2018-08-30
==================
- Update cookie policy link
- Remove Heatmaps from Webtrends (as the feature has been discontinued)
- Update python used in container
- Anonymise IP used by Webtrends
- Update favicon for latest design
- Match breadcrumb text with URL slug
- Don't display full website URL
- Don't use abbreviation for telephone
- Update footer links to new pages

0.6.0 / 2018-08-22
==================
- Fix typo
- Cleanup typeahead results display
- Update content for improved usability
- Remove Sign Health from results (a fallback should the data not be correct)
- Use local data for North Cumbria and Redbridge CCGs

0.5.0 / 2018-08-20
==================
- Use latest footer font size
- Update print css for new design
- Update IE css for new design
- Update npm dependencies
- Add urgent help call-out to 'check' page
- Do not display online referral message when no option available
- Hyperlink search again link on no results page
- Add extra info to search page about use of GP
- Update content to latest tested
- Give each page a unique title
- Set background to blue
- Replace references to `NHS.UK` in favour of `NHS`
- Update header search placeholder text
- Remove aria-labelledby on the aria-hidden NHS logo
- Do not highlight via Azure Search Service (because the full word is
  highlighted rather than just the entered term)
- Highlight with hand-rolled solution
- Upgrade to `node:8.11.4-alpine`
- Remove hardcoded api-key
- Fix 1 GP result bug
- Search `Address1` and `Address2` fields in typeahead
- Improve display of typeahead results
- Order IAPT results by distance from GP
- Use specific page name for content page WebTrends tracking
- Add login link to footer
- Add clickable menu item icon

0.4.0 / 2018-07-30
==================
- Typeahead enhancements
- Performance tests
- Use new API

0.3.0 / 2018-07-27
==================
- Restrict scope of typeaheads
- Maintain search query for `search again` link back
- Go to IAPT result page when GP has been selected from typeahead
- Remove `no suggestions` display for zero typeahead results
- Show 5 results in typeahead
- Do not search postcode in typeahead
- Scroll input to top for smaller screen sizes
- Add Meta tags for WebTrends
- Turn off auto 'things' on input
- Use new API
- Add Tracking for WebTrends

0.2.0 / 2018-07-23
==================
- Add typeahead for GP search
- Encode queries for back links
- Improve accessibility
- Content and design tweaks
- Increase test coverage
- Extend CSP for Hotjar
- Do not use `role="button"` for links
- Break long terms to prevent overflow
- Improve page heading hierarchy
- Improve aria labelling
- Use error message in page title

0.1.1 / 2018-07-10
==================
- Rename frontends for consistency

0.1.0 / 2018-07-10
==================
- Initial release

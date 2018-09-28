0.11.0 / 2018-10-04
==================
- Update npm dependencies
- Multiple accessibility improvements
- Upgrade to `node:8.12.0-alpine`

0.10.0 / 2018-09-14
==================
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

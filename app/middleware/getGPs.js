const request = require('request');
const config = require('../../config/config');
const log = require('../lib/logger');
// // TODO: change to be for gp lookups
// const errorCounter = require('../lib/prometheus/counters').errorPageViews;
// const postcodesIORequestHistogram = require('../lib/prometheus/histograms').postcodesIORequest;

function getGPs(req, res, next) {
  // TODO: Request GPs
  // Process results
  // Render results
  // res.locals.services = [
  //   { ccg: '00A', name: 'GP result one' },
  //   { ccg: '99Q', name: 'GP result two' },
  // ];

  const query = req.query.query;
  const apiKey = config.api.key;
  const apiVersion = config.api.version;
  const apiHost = config.api.host;
  const apiOrgIndex = config.api.indexes.orgLookup;

  const options = {
    // TODO: Build this somewhere else
    body: JSON.stringify({
      filter: 'OrganisationTypeID eq \'GPB\'',
      search: query, // TODO: Handle no input. Maybe change the name
      searchFields: 'OrganisationName,OrganisationAliases,Postcode',
      select: 'OrganisationName,Address1,Address2,Address3,City,County,Postcode,CCG',
      suggesterName: 'orgname-suggester',
      top: 10,
    }),
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    url: `https://${apiHost}/indexes/${apiOrgIndex}/docs/suggest?api-version=${apiVersion}`,
  };
  log.debug(options);

  request.post(options, (error, response, body) => {
    // TODO: Test around an empty body - what happens when 403?
    const pbody = JSON.parse(body);
    log.debug(pbody);
    console.log(pbody);
    if (!error && response.statusCode === 200) {
      const results = pbody.value;
      // TODO: The address needs stitching together
      res.locals.results = results || [];
      next();
    } else {
      log.error('ERROR!');
      log.error(error);
      next('error');
    }
  });
  // const location = res.locals.location;

  // log.debug({ location }, 'Postcode search text');
  // const endTimer = postcodesIORequestHistogram.startTimer();
  // if (location) {
  //   try {
  //     log.debug('Flexi-finder lookup, looking up isnt going to just be a postcode.');
  //     res.render('location');
  //   } catch (error) {
  //     log.debug({ location }, 'Error in postcode lookup');
  //     errorCounter.inc(1);
  //     next(error);
  //   } finally {
  //     endTimer();
  //   }
  // } else {
  //   log.debug('No postcode');
  //   next();
  // }
}

module.exports = getGPs;

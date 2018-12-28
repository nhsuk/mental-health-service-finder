const requireEnv = require('require-environment-variables');

const app = require('./server');
const applicationStarts = require('./app/lib/prometheus/counters').applicationStarts;
const log = require('./app/lib/logger');

requireEnv(['API_HOSTNAME', 'API_KEY', 'SEARCH_API_HOST', 'SEARCH_API_KEY']);

app.listen(app.port, () => {
  applicationStarts.inc(1);
  log.info(`Express server listening on port ${app.port}`);
});

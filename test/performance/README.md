# Performance Testing

[JMeter](http://jmeter.apache.org/) performance tests.

## Tests

* `iapt-finder.jmx` - journey through every page of the application.

* `iapt-finder-typeahead.jmx` - test focussing on the typeahead used within the
  application.

## Configurable parameters

| Parameter     | Description                                              | Default                     |
| :------------ | :------------------------------------------------------- | :-------------------------- |
| `hostname`    | URL of server to test                                    | staging.beta.nhschoices.net |
| `protocol`    | Protocol required for request                            | https                       |
| `port`        | Port required for request                                | 443                         |
| `users`       | Simulated number of concurrent users                     | 12                          |
| `rampup`      | Time in seconds to ramp up to total number of users      | 60                          |
| `duration`    | Time in seconds to run test                              | 120                         |
| `throughput`  | target throughput in samples per minute                  | 60                          |
| `searchterms` | CSV file containing search terms for GP search           | serachterms.csv             |
| `ccgids`      | CSV file containing CCG Ids for IAPT search              | ccgids.csv                  |
| `basicauth`   | Base64 encoded user:password                             | aGVsbG86Z29vZGJ5ZQ==        |

## Threshold

The `threshold` file specifies the maximum average response time.
The test will fail if the total average time exceeds the threshold. This is set to 500ms.

To enable use of the threshold file in TeamCity, `Performance Metrics
Calculation` in `Build Features` must have the `file` checkbox selected, and
`threshold` entered into the text box within the `Get reference values from`
section.  Unchecking the box will revert to using the build history to
determine performance drops.

## Running Tests

The test can be loaded into JMeter and run from the GUI. However, this is only
recommended during test development and debugging. All other times the test
should be run via the JMeter CLI.

On a machine where the JMeter CLI is available run the following command (from
the project root directory) to start a test execution using the default values.
This will create a log file in the project root directory called
`iapt-finder.jtl`:

`jmeter -n -t ./test/performance/iapt-finder.jmx -l iapt-finder.jtl`

In order to override any of the configurable parameters they need to be
supplied to the CLI in the following manner. The example below overrides all of
the available parameters.
Note: only parameters wishing to be overridden need to be supplied.

`jmeter -n -t ./<path-to-test>/<test-name>.jmx
-Jhostname=localhost -Jprotocol=http -Jport=3000 -Jusers=10 -Jrampup=10
-Jduration=500 -Jthroughput=60 -Jbasicauth=aGVsbG86Z29vZGJ5ZQ==
-Jsearchterms=searchterms.csv -Jccgids=ccgids.csv -l iapt-finder.jtl`

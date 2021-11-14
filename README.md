# Performance monitoring
A tool to monitor frontend performance of `<URL>` or of static dist dir `<PATH>`

## How to run

```shell
CLIENT_API_KEY=<Datadog API Key> yarn start \
    --url <url> \
    --static-dist-dir <path>
    --tag systemid:<your-system-id> \
    --tag additional:tag \
    --tag release \
    --custom-metric key=5 \
    --samples-count 3 \
    --max-value transferSize=10000 \
    --additional-lighthouse-metric isOnHttps=audits['is-on-https'].score
```

* `--url` and `--static-dist-dir` cannot be both set, but one of them is required
* `<PATH>`could be a directory that includes the index.html or it could be a path of a html file 
* `CLIENT_API_KEY` is required as env variable when running the tool (unless `--no-datadog` is set).
* `--tag systemid:<system id>` is required

## Options

* `--no-datadog` does not push metrics to Datadog
* `--throttling` set a different setup for throttling the requests of lighthouse. Possible values are `mobileSlow4G` (default), `mobileRegular3G` or `desktopDense4G`.
* `--config` allow to set options with a config file (must be a JSON). Is possible to mix file options with shell options (priority goes to shell ones), or merge values from array options.
* `--custom-metric` sends to Datadog a custom metric with a pair of key and value, key should be a word without `-` and value should be a number.
* `--samples-count` runs the tool #n times, n should be an integer. Warning: we are going to start/stop the browser #n times so is going to take #n more time to execute
* `--max-value` sets threshold that if violated will make the tool exit with status code 10. Metrics are still sent to datadog if enabled.
* `--additional-lighthouse-metric` sends to Datadog an additional metric from lighthouse. The key should be a word without `-`, and the value should be a valid path from the JSON response from lighthouse ([find an example of lighthouse JSON response here](https://stash.int.klarna.net/projects/DT/repos/performance-monitoring/browse/test/fixtures/lhr.json)). Also, the result from the value path should be a number.


## Datadog

When pushed to Datadog the metrics are all prefixed with `performance.frontend.<metric>` (e.g. `performance.frontend.transferSize`).

## Collected metrics

Metrics and descriptions from https://web.dev/learn-web-vitals/

### Script Transfer Size (`performance.frontend.transferSize`, bytes)

The sum of all downloaded script from the examined url. If additional scripts are downloaded later they could not be counted.

### Largest Contentful Paint (`performance.frontend.largestContentfulPaint` ms)

Measures the time from when the page starts loading to when the largest text block or image element is rendered on the screen. From the user perspective, it is important because it measures the time before an user can see almost all the meaningful content in the web page.

### Cumulative Layout Shift  (`performance.frontend.cumulativeLayoutShift`score)

Measures the cumulative score of all unexpected layout shifts that occur between when the page starts loading and when its lifecycle state changes to hidden. In other words, CLS measures how much the visible content of a page shifts around during loading. From the user perspective, it is important because it helps quantify how often users experience unexpected layout shifts.

### Time to Interactive (`performance.frontend.timeToInteractive` ms)

Measures the time from when the page starts loading to when it's visually rendered, its initial scripts (if any) have loaded, and it's capable of reliably responding to user input quickly. Measuring TTI is important because some sites optimize content visibility at the expense of interactivity. This can create a frustrating user experience: the site appears to be ready, but when the user tries to interact with it, nothing happens.

### Total blocking time (`performance.frontend.totalBlockingTime` ms)

Measures the total amount of time between FCP and TTI where the main thread is blocked for long enough to prevent input responsiveness. Total Blocking Time (TBT) is an important metric for measuring load responsiveness because it helps quantify the severity of how non-interactive a page is prior to it becoming reliably interactive: a low TBT helps ensure that the page is usable.

### Example

``` json
{
    "transferSize":230439,
    "timeToInteractive":3955.9565000000002,
    "totalBlockingTime":319.66149999999993,
    "cumulativeLayoutShift":0.0012926235131258815,
    "largestContentfulPaint":3555.4565000000002
}
```

## Other commands

- `yarn lint` lint all the typescript files in the project
- `yarn test` , run all the tests, timeout is set to allow all the metrics collection
- `yarn coverage`, reports test coverage fot the tool
- `CLIENT_API_KEY=<datadogApiKey> DATA_DOG_URL=<datadogEndpoint> yarn start <URL>`, Datadog endpoint could be changed to target a mock server or other endpoint, for example `https://api.datadog.com`

## Use as a library

To authenticate or change other state before collecting metrics you could use perfomance-monitoring as a library.
As lighthouse have to load the url to collect metrics it does not work for stateless interaction that don't change 
anything on the server side or in the browser storage (cookie, local storage, session storage).

```javaScript
const pc = require("puppeteer-core");
const { default: performanceMonitoring } = require("@klarna/performance-monitoring/dist/lib/performance-monitoring.js");
const { URL } = require("url");
const { path } = require('chromium')

const CHROME_PATH = process.env.CHROME_PATH ?? path;

const url = "http://localhost:9021"

!(async () => {
    try{
        const browser = await pc.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            executablePath: CHROME_PATH
        });

        const { port } = new URL(browser.wsEndpoint());
        const page = await browser.newPage();
        await page.authenticate({
            'username':'user',
            'password': 'password'});
        await page.goto(url);

        const res = await performanceMonitoring(port, {url, isDatadogEnabled: false})

        console.log(res)

        browser.disconnect()
        await browser.close();
    } catch (e){
        console.log(e)
    }
})();
```

## Development setup

To be able to work in a development environment, add a new line in the `.bash_profile` or `.zshrc` in your local machine with this code, to make a new environment variable:

```
export NPM_TOKEN="your_token"
```

To develop and try out the basic commands, it's enough to have it like a placeholder. To be able to push a new version on Artifactory, update the `your_token` string with the real token of the LDAP user `sys.dt-artifactory`.

## `npx`, `npm` or `yarn`

It's possible to use performance-monitoring as an executable, with the `npx` command:

```
npx @klarna/performance-monitoring@beta --url=http://example.com --no-datadog
```

Or just install in your node project with `npm/yarn`:

```
npm install @klarna/performance-monitoring@beta
yarn add @klarna/performance-monitoring@beta
```

To be able to do that, you need to registry in your `.npmrc` the virutal repository of Klarna production `npm` packages:

```
registry=https://artifactory.klarna.net/artifactory/api/npm/v-npm-production/
```

Or set the registry as default in your npm configuration:

```
npm config set registry https://artifactory.klarna.net/artifactory/api/npm/v-npm-production/
```

##### Notes
Made in Italy with Love ❤️

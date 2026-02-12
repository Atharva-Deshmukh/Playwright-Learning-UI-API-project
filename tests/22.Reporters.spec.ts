import { test, expect } from '@playwright/test';

/* There are two types of reporters in Playwright:
   1. Built-in reporters: These are provided by Playwright and include options like '
    'html', 'list', 'json', etc.
   2. Custom reporters: Allure, ...


                                        LIST Reporter:
                                        --------------  

        - Way-1: Setup in playwright.config.ts
                reporter: 'list',
        - Way-2: Command line option => yarn run  playwright test --reporter=list

                                        LINE Reporter:
                                        --------------  
         It uses a single line to report last finished test, and prints failures when they occur. 
        - Way-1: Setup in playwright.config.ts
                reporter: 'line',
        - Way-2: Command line option => yarn run  playwright test --reporter=line

                                        DOT Reporter:
                                        --------------  
         Green dot for passed tests
         F for failed tests
        - Way-1: Setup in playwright.config.ts
                reporter: 'dot',
        - Way-2: Command line option => yarn run  playwright test --reporter=dot

                                        HTML Reporter:
                                        --------------  
         By default, HTML report is opened automatically if some of the tests failed.
         reporter: [['html', { open: 'never' }]], -> always, never and on-failure (default).
         
         By default, report is written into the playwright-report folder in the current working directory.
         reporter: [['html', { outputFolder: 'my-report' }]],

        - Way-1: Setup in playwright.config.ts
                reporter: 'html',
        - Way-2: Command line option => yarn run  playwright test --reporter=html

        in the directory, we have playwright-report directory, just search the index.html, copy its path
        open in browser, we can directly open HTML reports in the browser by copying the local path

                                        JSON Reporter:
                                        --------------  
         JSON reporter produces an object with all information about the test run.

        - Way-1: Setup in playwright.config.ts
                reporter: 'json',
        - Way-2: Command line option => yarn run  playwright test --reporter=json

                                        Junit Reporter:
                                        --------------  
         JUnit reporter produces a JUnit-style xml report.
         Most likely you want to write the report to an xml file.

        - Way-1: Setup in playwright.config.ts
                reporter: 'junit',
        - Way-2: Command line option => yarn run  playwright test --reporter=junit

*/

test('Test-1', async () => {
  await expect(true).toBeTruthy();
});

test('Test-2', async () => {
  await expect(true).toBeFalsy();
});

test('Test-3', async () => {
  await expect(true).toBeTruthy();
});

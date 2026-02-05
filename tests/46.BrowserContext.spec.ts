import { test, expect, chromium } from '@playwright/test';

/* BrowserContexts provide a way to operate multiple independent browser sessions. 


Its like creating a new browser instance like incognito mode with some configurations, cookies beforehand

Ex: Our app may not open without proxy, so we can tell playwright browser.newContext() to create 
    a new browser instance with some proxy, cookies that we can pass in as parameter.


                            MENTAL MODEL TO REMEMBER:
                            ------------------------

                            browser (Chromium process)
                            ├── context A (incognito profile)
                            │    ├── page 1 (tab)
                            │    └── page 2
                            ├── context B (another incognito profile)
                            │    └── page 1


                                      CODE EXAMPLE
                                      ------------

                            const browser = await chromium.launch();

                            const context = await browser.newContext(); // fresh session
                            const page = await context.newPage();       // new tab

                            await page.goto('https://example.com');


                                      WHAT HAPPENS
                                      ------------

                              chromium (browser type)
                                ↓ launch()
                              browser (running Chromium process)
                                ↓ newContext()
                              context (incognito-like profile)
                                ↓ newPage()
                              page (tab)

IMPORTANT: without launch(), there is no browser process running to create a context inside.


But Sometimes, Playwright Test doesn’t call launch explicitly - that’s the exception, not the rule.

Ex: 
  test('example', async ({ page }) => {
    await page.goto('https://example.com');
  });

Playwright automatically:
  launches the browser
  creates a context
  creates a page
  cleans everything up after the test
  So launch() is still happening — just under the hood. 
  
When using Playwright Test, we don’t need to manually create a browser or browser context. 
Playwright automatically launches the default browser, creates a fresh browser context for each test, 
and provides a page fixture that belongs to that context. All default settings are handled by 
Playwright unless we explicitly customize them.
We can directly use {page} fixture and rest everything is taken care of

The page fixture automatically gives us a page inside a fresh default browser context, 
without manually launching the browser or creating a context.
  
*/

test('Browser context for logging in with muliple users simultaneoulsy', async ({ page }) => {

  const url: string = 'https://practice-automation.com/form-fields/';

  /* Browser, of which separate browser instances will be created */
  const browser = await chromium.launch({
    headless: false,
  });

  const browser_context_1 = await browser.newContext();
  const page_1 = await browser_context_1.newPage();

  const browser_context_2 = await browser.newContext();
  const page_2 = await browser_context_2.newPage();

  await page_1.goto(url);
  /* Assertions here */

  await page_2.goto(url);
  /* Assertions here */

  await browser_context_1.close(); /* Close the first context */
  await browser_context_2.close(); /* Close the second context */

  await browser.close(); /* Close the browser */

  // pause the page indefinitely
  await new Promise(() => {})
});
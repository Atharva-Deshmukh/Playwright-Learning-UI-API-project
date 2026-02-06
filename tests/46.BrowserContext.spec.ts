import { test, expect, chromium, firefox } from '@playwright/test';

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

  /* Browser process */
  const chormiumBrowserProcess = await chromium.launch({
    headless: false,
  });

  const firefoxBrowserProcess = await firefox.launch({
    headless: false,
  });

  const browser_context_1 = await chormiumBrowserProcess.newContext();
  const page_1 = await browser_context_1.newPage();


  /* Some browsers require specific permissions while others don't like chromium requires clipboard
   but firefox don't 

   In config.ts file -> we have -> 
      use {
        permissions: ['clipboard-read', 'clipboard-write'], 
       }
*/

  const browser_context_2 = await firefoxBrowserProcess.newContext({
    permissions: [], // firefox don't need any permissions
  });
  const page_2 = await browser_context_2.newPage();

  await page_1.goto(url);
  await expect(page_1).toHaveTitle("Form Fields | Practice Automation");

  await page_2.goto(url, { waitUntil: 'domcontentloaded' });  // firefox is very slow, hence wait
  await expect(page_2).toHaveTitle("Form Fields | Practice Automation");
});
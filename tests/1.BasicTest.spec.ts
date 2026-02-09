import { test, expect } from '@playwright/test';

/* Every test starts with goto()

 We have {page} fixture passed in every test's callback function.*/

test('Verify page title', async ({ page }) => {

  const url: string = 'https://playwright.dev/';
  const expectedPageTitle: string = 'Fast and reliable end-to-end testing for modern web apps | Playwright';

  await page.goto(url);

  const pageTitle: string = await page.title();

  await expect(page).toHaveTitle(expectedPageTitle);

  await page.close();
  console.log(`Test passed: Page title is "${pageTitle}" as expected.`);
});

test('Locator with multiple matches', async ({ page }) => {

  const url: string = 'https://practice-automation.com/tables/';
  const expectedPageTitle: string = 'Tables | Practice Automation';
  const tableCellLocator = await page.locator('.wp-block-table td');

  await page.goto(url);
  await expect(page).toHaveTitle(expectedPageTitle);
  await expect(tableCellLocator.first()).toBeVisible();

  console.log('LOCATOR ARRAY -> ', await tableCellLocator.all());

  /* Outputs   LOCATOR ARRAY ->  [
  locator('.wp-block-table td').first(),
  locator('.wp-block-table td').nth(1),
  locator('.wp-block-table td').nth(2),
  locator('.wp-block-table td').nth(3),
  locator('.wp-block-table td').nth(4),
  locator('.wp-block-table td').nth(5),
  locator('.wp-block-table td').nth(6),
  locator('.wp-block-table td').nth(7)
]*/
});

/* Text Extraction cocept
   ----------------------

   <div id="status">
    Loading...
    <span style="display:none">secret</span>
  </div>

 ---------------------------------------------------------
  textContent() ->  Returns the raw text content of the node from the DOM.
                    Returns the text of the first matching element only
                    use this to get all locator's content -> allTextContents();

  Key traits:
    Includes hidden text (display: none, visibility: hidden)
    Includes text from script/style nodes
    Preserves whitespace exactly as in the DOM
    Very fast and very literal

  Example:
    await page.textContent('#status');  -->  "\n  Loading...\n  secret\n"

  ---------------------------------------------------------
  innerText() -> Returns the rendered, human-visible text, similar to what a user sees.
                 innerText() also returns only the first matching element.
                 use this to get all locator's content -> allInnerTexts();

  Key traits:
    ❌ Excludes hidden elements
    ✅ Respects CSS and layout
    ✅ Normalizes whitespace (collapses spaces, trims lines)
    ❌ Triggers layout → slower than textContent()

  Example:
    await page.innerText('#status');  -->  "Loading..."

  Use it when:
    You want to test what the user actually sees
    You’re asserting UI labels, buttons, messages
    Visibility matters

   ---------------------------------------------------------
  allTextContents() ->  Returns an array of textContent values, one per matched element in a locator.
                        Think of it as -> elements.map(el => el.textContent)

          <ul>
            <li class="item">Apple</li>
            <li class="item" style="display:none">Banana</li>
            <li class="item">
              Cherry
              <span style="display:none">Hidden</span>
            </li>
          </ul>

          await page.textContent('.item'); -> "Apple"
          -------------------------------

          await page.locator('.item').allTextContents();
          ----------------------------------------------

          Returns raw DOM text for each matched element:

          [
            "Apple",
            "Banana",
            "\n    Cherry\n    Hidden\n  "
          ]

          ✔ Includes hidden text
          ✔ Preserves whitespace
          ✔ No CSS/layout awareness
          ✔ Order matches DOM order

          allInnerTexts()
          ---------------

        await page.locator('.item').allInnerTexts();

        Result:

        [
          "Apple",
          "Cherry"
        ]


        ❌ Hidden elements excluded
        ✅ Whitespace normalized
        ❌ Triggers layout (slower)
        ✅ Matches what a user sees

        Playwright assert:
        toHaveText() ≈ innerText() + auto-waiting + retries + stability checks
        
        NOTE: allTextContent() extracts text only once after DOM is attached, means DOM is visible in inspect
        but after that if we modify DOM, like write user name in <input>, allTextContent() is not able to
        capture it, we use <textarea> OR <input> .inputValue() method 
        
        Works only for:
          <input>
          <textarea>
          <select>

          await expect(input2.inputValue()).toBe(message);
        */

test.only('Extract text from locator', async ({ page }) => {

  const url: string = 'https://practice-automation.com/tables/';
  const expectedPageTitle: string = 'Tables | Practice Automation';
  const tableCellLocator = await page.locator('.wp-block-table td');

  await page.goto(url);
  await expect(page).toHaveTitle(expectedPageTitle);
  await expect(tableCellLocator.first()).toBeVisible();

  expect(await tableCellLocator.first().textContent()).toBe('Item');
  expect(await tableCellLocator.first()).toContainText('Item');
  expect(await tableCellLocator.first()).toContainText(/^Item$/);
});

/* just like cypress' :contains() 

  await page.locator('x-details', { hasText: 'Details' }).click();
*/

test('Types of locators', async ({ page }) => {

  const url: string = 'https://www.automationexercise.com/';
  const expectedPageTitle: string = 'Automation Exercise';

                            /* THIS IS INVALID  */
  // const buttonLocator = await page.getByRole('button', { hasText: 'Test Cases' });
  const buttonLocator = await page.getByRole('button', { name: 'Test Cases' });

  await page.goto(url);
  await expect(page).toHaveTitle(expectedPageTitle);
  await expect(buttonLocator.first()).toBeVisible();
});

/* Waiting for states
---------------------

waitForLoadState() waits for browser lifecycle events, not UI elements.
It does not care about buttons, spinners, or text — only about how far the page has loaded.

1️⃣ domcontentloaded -> await page.waitForLoadState('domcontentloaded');

HTML is downloaded and parsed
DOM exists
❌ Images, fonts, CSS may still be loading
❌ JS may still be running


Mental model:
📄 “The skeleton is ready”

2️⃣ load (default) -> await page.waitForLoadState('load');

“Everything referenced in HTML is loaded”

Waits for:
  images
  CSS
  fonts
  subframes

Mental model:
🖼️ “The page looks complete”

3️⃣ networkidle -> await page.waitForLoadState('networkidle');

“Network has gone quiet”

Means:
  No network requests for ~500 ms
  network tab is stable now
  Not counting websockets

Use when:
  Page loads data via APIs
  SPA initial data fetches

Mental model:
📡 “The app stopped talking to the server”

⚠️ Danger:

Can hang forever polling (Polling means repeatedly asking something for updates at a fixed interval.)
Not recommended for apps with long-lived requests

------------------------------------------------------------------
Hard Wait -> await page.waitForTimeout(3000);

------------------------------------------------------------------
locator.waitFor() 

state (optional) -> "attached" | "detached" | "visible" | "hidden"

By default, it waits until the element:
  exists in the DOM
  is visible

This is equivalent to -> await expect(locator).toBeVisible();

await page.locator('.spinner').waitFor({ state: 'hidden' });
Better way ->  await expect(page.locator('.spinner')).toBeHidden();

await page.click('button');
await page.locator('.success').waitFor();
Still better -> await expect(page.locator('.success')).toBeVisible();

Use it when:
  You need a sync point
  But you don’t want an assertion
  You’re preparing for a next action


*/


import { test, expect } from '@playwright/test';

/* A Page can have one or more Frame objects attached to it. Each page has a main frame and page-level 
interactions (like click) are assumed to operate in the main frame.

A page can have additional frames attached with the iframe HTML tag. These frames can be accessed 
for interactions inside the frame. */

test('Way-1: using locator of the frame', async ({ page }) => {

  const url: string = 'https://practice-automation.com/iframes/';
  const header = page.getByRole('heading', { name: 'Iframes' });

  await page.goto(url);

  await expect(header).toBeVisible();

  /* Get frame's locator, enter the frame and interact with the elements inside this frame */
  const frameLocator = await page.frameLocator('#iframe-1');
  const linkLocatorInsideFrame = await frameLocator.locator('.footer__title:has-text("Community")');
  await expect(linkLocatorInsideFrame).toBeVisible();
});

test('Way-2: using frame object - MOST POPULAR', async ({ page }) => {

  const url: string = 'https://practice-automation.com/iframes/';
  const header = page.getByRole('heading', { name: 'Iframes' });

  await page.goto(url);

  await expect(header).toBeVisible();

  /* Get number of frames */
  await expect(page.frames().length).toBeGreaterThan(2)

  // Get frame using the frame's name attribute
  const frameByName = page.frame('top-iframe');

  if(frameByName) {
      await expect(frameByName.locator('.DocSearch')).toBeVisible();
  }

  // Get frame using frame's URL
  const frameByUrl = page.frame({ url: 'https://www.selenium.dev/' });

  if(frameByUrl) {
      await expect(frameByUrl.locator('footer a:has-text("About Selenium")')).toBeVisible();
  }
});

test('Handling nested frames/inner frames/frames inside frames', async ({ page }) => {

  const url: string = 'https://ui.vision/demo/webtest/frames/';
  const title: string = "Frames - Web Automation Test";

  await page.goto(url);

  await expect(page).toHaveTitle(title);

  /* Way 1: Chain the locators */
  const frame3Locator = page.frame({url: 'https://ui.vision/demo/webtest/frames/frame_3.html'});

    if (frame3Locator) {
        await expect(frame3Locator.locator('p:has-text("iframe inside frame:")')).toBeVisible();
    }

  /* Way 2: childFrames() */
    if (frame3Locator) {
        const childFrames = frame3Locator.childFrames();

        if (childFrames) {
            await expect(childFrames.length).toBeGreaterThan(0);

            const inputLocator = childFrames[0].locator('.JGptt [aria-label="Other response"]');

            await expect(inputLocator).toBeVisible();
            await inputLocator.fill('This is a test input inside an inner frame');
        }
    }
  

});

/* In Cypress, this is verbose

describe('Handling nested frames/inner frames', () => {

  it('Handles iframe inside iframe', () => {

    const url = 'https://ui.vision/demo/webtest/frames/';
    const title = 'Frames - Web Automation Test';

    cy.visit(url);
    cy.title().should('eq', title);

    // STEP 1: Get Frame 3 (outer iframe)
    cy.get('frame[src="frame_3.html"]')
      .its('0.contentDocument.body')
      .should('not.be.empty')
      .then(cy.wrap)
      .within(() => {

        // Verify text inside outer frame
        cy.contains('iframe inside frame:').should('be.visible');

        // STEP 2: Get inner iframe
        cy.get('iframe')
          .its('0.contentDocument.body')
          .should('not.be.empty')
          .then(cy.wrap)
          .within(() => {

            // Locate and fill input inside inner frame
            cy.get('.JGptt [aria-label="Other response"]')
              .should('be.visible')
              .type('This is a test input inside an inner frame');

          });

      });

  });

});

*/
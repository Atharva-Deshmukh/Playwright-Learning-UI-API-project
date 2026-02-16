import { test, expect, request, APIRequestContext } from '@playwright/test';

/* API tests (like your REST API test) do not open a browser window, even in headed mode, 
because they do not use the browser context or UI.
--headed only makes sense for tests that interact with a browser. 

NOTE:
request is being fetched from two ways:

Way-1 --> import { test, expect, request } from '@playwright/test';
          the request we import has request.newContext() just like we have browserContext()

Way-2 --> test('myTest', async ({request}) => {

})

*/


/* Way-2: In below test, we use a readymade request fixture 
   
   This is:
   - Automatically created and managed by Playwright
   - Automatically cleaned up after the test
   - No manual setup required
*/
test('GET - request Fixture', async ({request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts');
    await expect(response.status()).toBe(200);
    const data = await response.json();
    // await console.warn('data -> ', data);
    await expect(data.length).toBeGreaterThan(5);
});

/* Way-1: imported request 

- This allows you to manually create an API request context. 
- Manual control over configuration
- You must manually dispose it

We use this when:
- When creating multiple isolated contexts
- We need custom configurations apart from test configurations

Just like browser tests:
    const browserContext = await browser.newContext();
    const page = await browserContext.newPage();
    page.locator()..

    We created new browser context and then new page and then on this new page, we acted upon
    Similarly, we create a new request context and we create a new request from this contexta and act upon
*/
test('GET - request import', async () => {
    const requestContext: APIRequestContext = await request.newContext();
    const response = await requestContext.get('https://jsonplaceholder.typicode.com/posts');

    await expect(response.status()).toBe(200);
    const data = await response.json();
    // await console.warn('data -> ', data);
    await expect(data.length).toBeGreaterThan(5);
});

test('POST', async ({request}) => {
    const response = await request.post('https://reqres.in/api/users', {
        data: {
            name: 'Atharva Deshmukh',
            job: 'SDET-1'
        },
        headers: {
            'x-api-key': 'reqres-free-v1',
            'Content-Type': 'application/json'
        },
        failOnStatusCode: false
    });
    await expect(await response.status()).toBe(201);
    const data = await response.json();
    await expect(data.name).toBe('Atharva Deshmukh');
    await expect(data.job).toBe('SDET-1');
});

test('PUT', async ({request}) => {
    const response = await request.put('https://reqres.in/api/users/2', {
        data: {
            name: 'USER_UPDATED',
            job: 'SDET-1'
        },
        headers: {
            'x-api-key': 'reqres-free-v1',
            'Content-Type': 'application/json'
        }
    });
    await expect(await response.status()).toBe(200);
    const data = await response.json();
    await expect(data.name).toBe('USER_UPDATED');
    await expect(data.job).toBe('SDET-1');
});

test('DELETE', async ({request}) => {
    const response = await request.delete('https://reqres.in/api/users/2', {
                headers: {
            'x-api-key': 'reqres-free-v1',
            'Content-Type': 'application/json'
        }
    });
    await expect(await response.status()).toBe(204);
});
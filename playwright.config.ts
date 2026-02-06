import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Read from ".env" file.
dotenv.config({ path: `./ENV_FILES/${process.env.ENV}.env` });

const env_choosen: string = process.env.ENV!;
let projectObj: any;

switch (env_choosen) {
  case 'DEV':
    projectObj = {
      name: 'dev_project',
      use: {
        baseUrl: process.env.baseUrl,
        user_name: process.env.user_name,
        user_pwd: process.env.user_pwd,
        cust_var: process.env.cust_var,
        ...devices['Desktop Chrome']
      },

    }
    break;

  case 'PROD':
    projectObj = {
      name: 'prod_project',
      use: {
        baseUrl: process.env.baseUrl,
        user_name: process.env.user_name,
        user_pwd: process.env.user_pwd,
        cust_var: process.env.cust_var,
        ...devices['Desktop Chrome']
      },

    }
    break;

  default:
    projectObj = {
      name: 'DEFAULT_PROJECT',
      use: { 
        baseUrl: 'DEFAULT_URL',
        user_name: 'DEFAULT_USERNAME',
        user_pwd: 'DEFAULT_PASSWORD',
        cust_var: 'DEFAULT_CUST_VAR',
        ...devices['Desktop Chrome'] ,
        storageState: undefined,
      },
    }
    break;
}

export default defineConfig({

  /* Spec pattern in playwright */
  testDir: './tests', //specify the directory where your test files are located
  testMatch: '**/*.spec.ts', // Only files ending with .spec.ts will be considered as test files
   
  timeout: 30000, // timeout for overall test

  /* Run tests in files in parallel - Default*/
  // fullyParallel: true,
  fullyParallel: false, // Serially execute tests
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  // workers: process.env.CI ? 1 : undefined,
  workers: 1, 
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html', { open: 'on-failure' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    // Collect trace for every test (enables time travel in UI)
    trace: 'on',
    colorScheme: 'dark', /* Dark mode */
    permissions: ['clipboard-read', 'clipboard-write'],  // this works for chromium but not for firefox, hence commenting
    video: 'off',
    // headless: false, True by default, so need to pass --headed in commands, But to avoid --headed in commands, use this flag

    /* For HTTP Authentication alerts */
    httpCredentials: {
      username: 'admin',
      password: 'admin',
    },

    /* To store sessions created - This file is referred for new login with existing session */
    // storageState: './preservedSession.json', uncomment for session login activation
  },

  expect: {
    timeout: 5000,    // expect timeout
    toHaveScreenshot: {
      pathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}.png'
    }
  },

  /* Env-wise project {} */
  projects: [projectObj]
});

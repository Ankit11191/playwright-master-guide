export interface PracticeExercise {
  id: string;
  moduleId: string;
  moduleCode: string;
  title: string;
  difficulty: 'Beginner' | 'Foundation' | 'Intermediate' | 'Advanced' | 'Enterprise' | 'Architect';
  category: 'Code Along' | 'Fill in the Blank' | 'Fix the Bug' | 'Write the Test' | 'Refactor the Code' | 'Build from Scratch';
  description: string;
  instructions: string[];
  starterCode: string;
  solutionCode: string;
  hints: string[];
  expectedOutput: string;
  validationRules: {
    mustContain?: string[];
    mustNotContain?: string[];
    regexMatch?: RegExp[];
  };
}

export const PRACTICE_EXERCISES: PracticeExercise[] = [
  {
    id: 'ex-01',
    moduleId: 'm01',
    moduleCode: 'M01',
    title: 'Strict TypeScript Test Configuration Factory',
    difficulty: 'Foundation',
    category: 'Write the Test',
    description: 'Implement a type-safe configuration loader with environment fallback and TypeScript generics that validates test options at compile time.',
    instructions: [
      'Define a TypeScript interface `TestEnvironment` with properties: baseUrl, timeout, and retries.',
      'Create a generic function `getEnvironmentConfig<T>()` that accepts an optional partial override.',
      'Ensure missing fields fall back to safe defaults (timeout: 30000, retries: 2).'
    ],
    starterCode: `// Exercise 1: Build a Type-Safe Test Environment Config Loader
export interface TestEnvironment {
  baseUrl: string;
  timeout: number;
  retries: number;
}

// TODO: Implement getEnvironmentConfig with partial overrides and defaults
export function getEnvironmentConfig(overrides?: Partial<TestEnvironment>): TestEnvironment {
  // Your code here
  return {
    baseUrl: '',
    timeout: 0,
    retries: 0
  };
}

// Execution test
const config = getEnvironmentConfig({ baseUrl: 'https://staging.qa.com' });
console.log('Resolved BaseURL:', config.baseUrl);
console.log('Resolved Timeout:', config.timeout);
console.log('Resolved Retries:', config.retries);
`,
    solutionCode: `export interface TestEnvironment {
  baseUrl: string;
  timeout: number;
  retries: number;
}

export function getEnvironmentConfig(overrides?: Partial<TestEnvironment>): TestEnvironment {
  const defaults: TestEnvironment = {
    baseUrl: 'https://default.enterprise.com',
    timeout: 30000,
    retries: 2
  };
  return { ...defaults, ...overrides };
}

const config = getEnvironmentConfig({ baseUrl: 'https://staging.qa.com' });
console.log('Resolved BaseURL:', config.baseUrl);
console.log('Resolved Timeout:', config.timeout);
console.log('Resolved Retries:', config.retries);`,
    hints: [
      'Hint 1: Think about how object spreading ({ ...defaults, ...overrides }) allows overrides to take precedence.',
      'Hint 2: Define your defaults object with timeout = 30000 and retries = 2.',
      'Hint 3: Use the TypeScript Partial<TestEnvironment> utility type on the parameter.',
      'Hint 4: return { ...defaults, ...overrides }; solves this cleanly.'
    ],
    expectedOutput: `Resolved BaseURL: https://staging.qa.com
Resolved Timeout: 30000
Resolved Retries: 2`,
    validationRules: {
      mustContain: ['timeout', 'retries', 'defaults', '...'],
      mustNotContain: ['any']
    }
  },
  {
    id: 'ex-02',
    moduleId: 'm02',
    moduleCode: 'M02',
    title: 'Zero-Flake Web-First Locators & Auto-Waiting',
    difficulty: 'Intermediate',
    category: 'Refactor the Code',
    description: 'Refactor a flaky test that uses sleep, brittle XPath, and non-web-first assertions into resilient, accessibility-driven Playwright code.',
    instructions: [
      'Replace brittle XPath with accessibility-based `page.getByRole()`.',
      'Remove `page.waitForTimeout(5000)` and let Playwright auto-wait handle synchronization.',
      'Replace manual innerText comparison with web-first `await expect(locator).toHaveText()`.',
      'Use `page.getByLabel()` for the input field.'
    ],
    starterCode: `import { test, expect } from '@playwright/test';

test('flaky checkout test - NEEDS REFACTORING', async ({ page }) => {
  await page.goto('/checkout');

  // FLAKY: Manual sleep
  await page.waitForTimeout(5000);

  // BRITTLE: XPath that breaks easily
  await page.click('//div[@id="root"]/div[2]/form/div[1]/input');
  await page.fill('//div[@id="root"]/div[2]/form/div[1]/input', 'Automated SDET');

  // BRITTLE: Class-based button selector
  await page.click('.btn-primary-checkout-action');

  // FLAKY: Non-retrying manual text assertion
  const text = await page.innerText('#status-message');
  expect(text === 'Payment Processed').toBeTruthy();
});`,
    solutionCode: `import { test, expect } from '@playwright/test';

test('resilient checkout test with web-first locators', async ({ page }) => {
  await page.goto('/checkout');

  // Priority 1: Label for form input
  await page.getByLabel('Cardholder Name').fill('Automated SDET');

  // Priority 2: Semantic role for action button
  await page.getByRole('button', { name: /complete checkout/i }).click();

  // Priority 3: Web-first assertion with auto-polling
  await expect(page.getByRole('status')).toHaveText('Payment Processed');
});`,
    hints: [
      'Hint 1: Delete page.waitForTimeout completely - Playwright auto-waits for actionability checks automatically.',
      'Hint 2: Use page.getByLabel() or page.getByPlaceholder() instead of raw XPath for the name field.',
      'Hint 3: Use page.getByRole("button", { name: ... }) for the checkout button.',
      'Hint 4: Use await expect(locator).toHaveText() which polls automatically until the element updates.'
    ],
    expectedOutput: `✓ Test Passed: 0 flaky sleeps detected
✓ Web-First Locators verified: getByRole & getByLabel
✓ Auto-retrying assertion verified: expect(...).toHaveText()`,
    validationRules: {
      mustContain: ['getByRole', 'expect'],
      mustNotContain: ['waitForTimeout', 'xpath', '//div']
    }
  },
  {
    id: 'ex-03',
    moduleId: 'm02',
    moduleCode: 'M02',
    title: 'Multi-Tab & Pop-Up Context Synchronization',
    difficulty: 'Intermediate',
    category: 'Write the Test',
    description: 'Automate a flow where clicking an external link opens a new tab. Synchronize the popup promise before the click to prevent race condition drops.',
    instructions: [
      'Use `context.waitForEvent("page")` concurrently with the click action via `Promise.all()`.',
      'Wait for the new page to reach `domcontentloaded` state.',
      'Assert that the new page has the expected URL and title.'
    ],
    starterCode: `import { test, expect } from '@playwright/test';

test('handle new browser tab opened by link', async ({ context, page }) => {
  await page.goto('https://portal.enterprise.com');

  // TODO: Synchronize new tab creation using context.waitForEvent('page')
  // and click on the 'Help Center' link concurrently
  
  // const [newPage] = await Promise.all([ ... ]);

  // TODO: Assert new tab URL contains 'help.enterprise.com'
});`,
    solutionCode: `import { test, expect } from '@playwright/test';

test('handle new browser tab opened by link', async ({ context, page }) => {
  await page.goto('https://portal.enterprise.com');

  // Properly synchronize popup promise before clicking link
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: /help center/i }).click()
  ]);

  await newPage.waitForLoadState('domcontentloaded');
  await expect(newPage).toHaveURL(/help\\.enterprise\\.com/);
  await expect(newPage.getByRole('heading', { level: 1 })).toBeVisible();
});`,
    hints: [
      'Hint 1: context.waitForEvent("page") must be dispatched in the same microtask as the click.',
      'Hint 2: Wrap them together in const [newPage] = await Promise.all([ context.waitForEvent("page"), page.click(...) ]).',
      'Hint 3: Use await expect(newPage).toHaveURL(...) to assert the tab navigated successfully.'
    ],
    expectedOutput: `✓ Popup synchronization event captured without race conditions
✓ New page context isolated and navigated
✓ Assertions verified on secondary page context`,
    validationRules: {
      mustContain: ['waitForEvent', 'Promise.all', 'newPage', 'toHaveURL']
    }
  },
  {
    id: 'ex-04',
    moduleId: 'm03',
    moduleCode: 'M03',
    title: 'Custom Fixture with Authenticated Session Injection',
    difficulty: 'Advanced',
    category: 'Write the Test',
    description: 'Implement a custom Playwright fixture using `base.extend` that automatically injects a pre-authenticated session state into tests.',
    instructions: [
      'Define a type `CustomFixtures` containing `authPage: Page`.',
      'Extend `test as base` using `base.extend<CustomFixtures>()`.',
      'In the fixture, navigate to the app, set a mock JWT in `localStorage`, invoke `await use(page)`, and clean up in teardown.'
    ],
    starterCode: `import { test as base, expect, Page } from '@playwright/test';

type CustomFixtures = {
  authPage: Page;
};

// TODO: Complete the base.extend definition
export const test = base.extend<CustomFixtures>({
  authPage: async ({ page }, use) => {
    // 1. Setup: simulate authenticated session

    // 2. Yield page to test via use()

    // 3. Teardown: clear storage
  }
});`,
    solutionCode: `import { test as base, expect, Page } from '@playwright/test';

type CustomFixtures = {
  authPage: Page;
};

export const test = base.extend<CustomFixtures>({
  authPage: async ({ page }, use) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'enterprise_mock_jwt_token_12345');
    });
    
    // Hand over control to test
    await use(page);

    // Teardown
    await page.evaluate(() => localStorage.clear());
  }
});

export { expect };`,
    hints: [
      'Hint 1: Use await page.evaluate(...) to access browser localStorage.',
      'Hint 2: You MUST call await use(page) - this is what passes the page fixture to the test body.',
      'Hint 3: Code after await use(page) runs as the teardown hook, even if the test fails.'
    ],
    expectedOutput: `✓ Custom fixture registered with base.extend<CustomFixtures>()
✓ Setup hook successfully populated auth_token
✓ await use(page) invoked with clean teardown guarantee`,
    validationRules: {
      mustContain: ['base.extend', 'use(page)', 'localStorage']
    }
  },
  {
    id: 'ex-05',
    moduleId: 'm04',
    moduleCode: 'M04',
    title: 'Hybrid UI/API Test: Fast Backend Seeding',
    difficulty: 'Advanced',
    category: 'Write the Test',
    description: 'Write a high-performance hybrid test that creates a product entity via APIRequestContext in 30ms, then validates its rendering in the web UI.',
    instructions: [
      'Use `{ request, page }` fixtures in your test signature.',
      'Send a POST request to `/api/v1/products` with name and price.',
      'Assert status is 201 and extract the generated `productId`.',
      'Navigate directly to `/products/{productId}` in the UI and assert the product title is visible.'
    ],
    starterCode: `import { test, expect } from '@playwright/test';

test('fast hybrid: seed via API, verify in UI', async ({ request, page }) => {
  // TODO 1: POST to /api/v1/products with SKU and Price
  
  // TODO 2: Extract productId from response.json()

  // TODO 3: Navigate UI directly to product detail page and verify title
});`,
    solutionCode: `import { test, expect } from '@playwright/test';

test('fast hybrid: seed via API, verify in UI', async ({ request, page }) => {
  // 1. Fast backend seeding
  const res = await request.post('/api/v1/products', {
    data: {
      name: 'Mechanical Gaming Keyboard',
      price: 129.99,
      sku: 'SKU-KB-90'
    }
  });
  expect(res.status()).toBe(201);
  const data = await res.json();
  const productId = data.id;

  // 2. Direct UI assertion
  await page.goto(\`/products/\${productId}\`);
  await expect(page.getByRole('heading', { name: 'Mechanical Gaming Keyboard' })).toBeVisible();
  await expect(page.getByTestId('product-price')).toHaveText('$129.99');
});`,
    hints: [
      'Hint 1: Use await request.post("/api/v1/products", { data: { ... } })',
      'Hint 2: Call await res.json() to parse the returned JSON payload.',
      'Hint 3: Use template literal \`/products/\${productId}\` for direct URL navigation.'
    ],
    expectedOutput: `✓ POST /api/v1/products succeeded with status 201 (24ms)
✓ Extracted product ID: prod_98412
✓ Navigated directly to /products/prod_98412
✓ UI heading and price verified without slow multi-page form filling`,
    validationRules: {
      mustContain: ['request.post', 'res.json()', 'page.goto', 'getByRole']
    }
  },
  {
    id: 'ex-06',
    moduleId: 'm05',
    moduleCode: 'M05',
    title: 'AI Self-Healing Semantic Locator Heuristic',
    difficulty: 'Enterprise',
    category: 'Write the Test',
    description: 'Implement a resilient locator wrapper that catches locator failures, queries the accessibility tree, validates the candidate against an 85% confidence threshold, and heals the test.',
    instructions: [
      'Create function `healedLocator(page, primarySelector, fallbackRole, fallbackName)`.',
      'Try resolving `primarySelector` with a 2-second timeout.',
      'If it throws, log a warning and fall back to `page.getByRole(fallbackRole, { name: fallbackName })`.',
      'Assert healed locator is visible and return it.'
    ],
    starterCode: `import { Page, Locator, expect } from '@playwright/test';

export async function healedLocator(
  page: Page,
  primarySelector: string,
  fallbackRole: string,
  fallbackName: string | RegExp
): Promise<Locator> {
  // TODO: Try primarySelector with 2s timeout
  // Catch TimeoutError and heal via page.getByRole
  return page.locator(primarySelector);
}`,
    solutionCode: `import { Page, Locator, expect } from '@playwright/test';

export async function healedLocator(
  page: Page,
  primarySelector: string,
  fallbackRole: string,
  fallbackName: string | RegExp
): Promise<Locator> {
  const primary = page.locator(primarySelector);
  try {
    await primary.waitFor({ state: 'visible', timeout: 2000 });
    return primary;
  } catch (error) {
    console.warn(\`[AI Self-Heal] Selector "\${primarySelector}" failed. Healing with role "\${fallbackRole}"...\`);
    const healed = page.getByRole(fallbackRole as any, { name: fallbackName });
    await healed.waitFor({ state: 'visible', timeout: 5000 });
    console.log(\`[AI Self-Heal Success] Element recovered via accessibility tree.\`);
    return healed;
  }
}`,
    hints: [
      'Hint 1: Use try/catch around primary.waitFor({ state: "visible", timeout: 2000 }).',
      'Hint 2: In the catch block, invoke page.getByRole(fallbackRole, { name: fallbackName }).',
      'Hint 3: Ensure the returned healed locator is awaited for visibility before returning.'
    ],
    expectedOutput: `[AI Self-Heal] Selector "#submit-order-legacy" failed. Healing with role "button"...
[AI Self-Heal Success] Element recovered via accessibility tree.
✓ Confidence Score: 94%
✓ Test continued without catastrophic failure`,
    validationRules: {
      mustContain: ['try', 'catch', 'getByRole', 'waitFor']
    }
  }
];

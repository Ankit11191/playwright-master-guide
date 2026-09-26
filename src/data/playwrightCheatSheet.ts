export interface CheatSheetItem {
  id: string;
  name: string;
  syntax: string;
  description: string;
  category: string;
  subcategory?: string;
  tags: string[];
  exampleCode?: string;
  proTip?: string;
  returns?: string;
  isWebFirst?: boolean;
  isAsync?: boolean;
}

export interface CheatSheetSection {
  id: string;
  title: string;
  iconName: string;
  description: string;
  badgeCount: number;
  items: CheatSheetItem[];
}

export const PLAYWRIGHT_CHEAT_SHEET_SECTIONS: CheatSheetSection[] = [
  {
    id: 'setup',
    title: 'Installation & Setup',
    iconName: 'Terminal',
    description: 'Scaffolding, installing browsers, command-line runners, debugging flags, and test execution.',
    badgeCount: 14,
    items: [
      {
        id: 'setup-init',
        name: 'Scaffold New Project',
        syntax: 'npm init playwright@latest',
        description: 'Interactive CLI wizard that scaffolds playwright.config.ts, package.json scripts, example tests, GitHub Actions workflow, and downloads browser binaries.',
        category: 'Installation & Setup',
        tags: ['CLI', 'Scaffold', 'Install', 'Init'],
        exampleCode: `# Run in your project root or empty directory
npm init playwright@latest

# Prompts will ask:
# 1. TypeScript or JavaScript (TypeScript recommended)
# 2. Where to put tests (default: tests)
# 3. Add GitHub Actions workflow (Y/n)
# 4. Install Playwright browsers (Y/n)`,
        proTip: 'Choose TypeScript for autocompletion of locators and web-first assertion methods.',
      },
      {
        id: 'setup-existing',
        name: 'Add to Existing Project',
        syntax: 'npm i -D @playwright/test && npx playwright install',
        description: 'Installs the Playwright test runner as a dev dependency and downloads Chromium, Firefox, and WebKit browser binaries to your local cache.',
        category: 'Installation & Setup',
        tags: ['npm', 'Dependencies', 'Browsers'],
        exampleCode: `npm i -D @playwright/test
npx playwright install

# Optional: install system OS dependencies for Linux/Docker:
npx playwright install --with-deps`,
        proTip: 'Use `npx playwright install --with-deps` on fresh Ubuntu/Debian Linux environments to avoid missing system shared libraries.',
      },
      {
        id: 'setup-run-all',
        name: 'Run All Tests',
        syntax: 'npx playwright test',
        description: 'Runs all test suites across all configured browser projects headlessly in parallel worker processes.',
        category: 'Installation & Setup',
        tags: ['CLI', 'Test Runner', 'Execution'],
        exampleCode: `npx playwright test`,
        proTip: 'By default, tests run headlessly on all CPU cores available (or 50% locally).',
      },
      {
        id: 'setup-run-headed',
        name: 'Run in Headed Mode',
        syntax: 'npx playwright test --headed',
        description: 'Launches visible browser windows so you can watch automated test steps execute in real time.',
        category: 'Installation & Setup',
        tags: ['CLI', 'Headed', 'Visual'],
        exampleCode: `npx playwright test --headed`,
        proTip: 'Ideal for local debugging when you want to see what is happening on screen without full interactive UI mode.',
      },
      {
        id: 'setup-run-debug',
        name: 'Debug with Playwright Inspector',
        syntax: 'npx playwright test --debug',
        description: 'Opens the Playwright Inspector GUI alongside headed browsers, pausing at breakpoints and allowing step-by-step test execution and live locator testing.',
        category: 'Installation & Setup',
        tags: ['CLI', 'Debug', 'Inspector'],
        exampleCode: `npx playwright test --debug
# Or debug a single test file:
npx playwright test login.spec.ts --debug`,
        proTip: 'Add `await page.pause()` anywhere in your test code to freeze execution and launch the inspector at that exact moment.',
      },
      {
        id: 'setup-run-ui',
        name: 'Interactive UI Mode',
        syntax: 'npx playwright test --ui',
        description: 'Opens a comprehensive interactive test runner GUI with time-travel debugging, DOM snapshot inspection, network log viewer, console output, and watch mode.',
        category: 'Installation & Setup',
        tags: ['CLI', 'UI Mode', 'Time-Travel', 'Watcher'],
        exampleCode: `npx playwright test --ui`,
        proTip: 'UI Mode includes an interactive locator playground where you can hover over DOM elements to pick the optimal accessible locator.',
      },
      {
        id: 'setup-run-file',
        name: 'Run Specific File',
        syntax: 'npx playwright test <file-name>',
        description: 'Executes only the specified test file or path matching the pattern.',
        category: 'Installation & Setup',
        tags: ['CLI', 'Filter', 'File'],
        exampleCode: `npx playwright test login.spec.ts
npx playwright test tests/e2e/checkout/`,
        proTip: 'Supports partial file paths and glob patterns.',
      },
      {
        id: 'setup-run-grep',
        name: 'Run Matching Title / Tag (-g)',
        syntax: 'npx playwright test -g "<pattern>"',
        description: 'Filters and executes only tests whose title or tag annotations match the given string or regular expression pattern.',
        category: 'Installation & Setup',
        tags: ['CLI', 'Filter', 'Tags', 'Grep'],
        exampleCode: `npx playwright test -g "Login"
npx playwright test --grep "@smoke"
npx playwright test --grep-invert "@slow"`,
        proTip: 'Tag tests in code using { tag: "@smoke" } or by including @smoke in the test title, then run with `--grep @smoke`.',
      },
      {
        id: 'setup-show-report',
        name: 'View HTML Test Report',
        syntax: 'npx playwright show-report',
        description: 'Launches a local web server to view the rich HTML test report containing step timings, video recordings, screenshots, and error logs.',
        category: 'Installation & Setup',
        tags: ['CLI', 'Report', 'HTML', 'Metrics'],
        exampleCode: `npx playwright show-report
# Specify report folder if custom:
npx playwright show-report playwright-report`,
        proTip: 'Pass `{ open: "never" }` to the html reporter in playwright.config.ts for CI/CD runners to prevent blocking build steps.',
      },
      {
        id: 'setup-codegen',
        name: 'Code Generator (Codegen)',
        syntax: 'npx playwright codegen <url>',
        description: 'Launches a browser and recording window that generates clean, accessible Playwright TypeScript/JavaScript test code as you click and type.',
        category: 'Installation & Setup',
        tags: ['CLI', 'Codegen', 'Recorder'],
        exampleCode: `npx playwright codegen https://example.com
# Emulate iPhone:
npx playwright codegen --device="iPhone 13" https://example.com
# Emulate color scheme:
npx playwright codegen --color-scheme=dark https://example.com`,
        proTip: 'Codegen automatically favors accessible locators like `getByRole` and `getByLabel` over brittle CSS classes.',
      },
      {
        id: 'setup-trace',
        name: 'Inspect Trace Viewer',
        syntax: 'npx playwright show-trace <trace.zip>',
        description: 'Opens Playwright Trace Viewer to inspect action timelines, DOM snapshots, network requests, and console logs from failed CI test runs.',
        category: 'Installation & Setup',
        tags: ['CLI', 'Trace', 'Post-Mortem'],
        exampleCode: `npx playwright show-trace test-results/trace.zip`,
        proTip: 'Set `trace: "on-first-retry"` in playwright.config.ts to capture traces only when tests fail and are retried, saving CI disk storage.',
      },
      {
        id: 'setup-project-filter',
        name: 'Run Specific Browser Project',
        syntax: 'npx playwright test --project=<name>',
        description: 'Runs tests exclusively on one named project defined in playwright.config.ts (e.g. chromium, firefox, webkit, Mobile Chrome).',
        category: 'Installation & Setup',
        tags: ['CLI', 'Project', 'Browser'],
        exampleCode: `npx playwright test --project=chromium
npx playwright test --project="Mobile Safari"`,
        proTip: 'Speed up local PR verification by running only `--project=chromium` before pushing to full matrix CI.',
      },
      {
        id: 'setup-workers',
        name: 'Control Worker Concurrency',
        syntax: 'npx playwright test --workers=<count>',
        description: 'Overrides the worker process count to control test parallelism.',
        category: 'Installation & Setup',
        tags: ['CLI', 'Parallelism', 'Performance'],
        exampleCode: `npx playwright test --workers=4
# Run sequentially (one test at a time):
npx playwright test --workers=1`,
        proTip: 'Use `--workers=1` when debugging flakiness caused by shared backend state or race conditions.',
      },
      {
        id: 'setup-update-snapshots',
        name: 'Update Visual Screenshots',
        syntax: 'npx playwright test --update-snapshots',
        description: 'Regenerates baseline screenshot files used by `toHaveScreenshot()` visual comparison assertions.',
        category: 'Installation & Setup',
        tags: ['CLI', 'Visual', 'Screenshots'],
        exampleCode: `npx playwright test -u
npx playwright test --update-snapshots`,
        proTip: 'Always review git diffs on newly generated PNG snapshot baselines before merging.',
      },
    ],
  },
  {
    id: 'structure',
    title: 'Test Structure & Hooks',
    iconName: 'FileCode',
    description: 'Declaring test cases, lifecycle hooks, suite grouping, conditional execution, and test fixtures.',
    badgeCount: 11,
    items: [
      {
        id: 'struct-test',
        name: 'Declare Test Case',
        syntax: 'test(title, async ({ page }) => { ... })',
        description: 'Defines a single automated test case. By default provides an isolated `page` fixture running in its own clean browser context.',
        category: 'Test Structure & Hooks',
        tags: ['Core', 'Fixture', 'Page'],
        exampleCode: `import { test, expect } from '@playwright/test';

test('user can log in successfully', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('standard_user');
  await page.getByLabel('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/.*inventory/);
});`,
        proTip: 'Every test gets a freshly isolated browser context; cookies, localStorage, and cache are completely cleared automatically.',
      },
      {
        id: 'struct-before-all',
        name: 'Suite Setup (beforeAll)',
        syntax: 'test.beforeAll(async () => { ... })',
        description: 'Runs once before any test cases in the current describe block or file. Does NOT receive the `page` fixture by default.',
        category: 'Test Structure & Hooks',
        tags: ['Hooks', 'Lifecycle', 'Setup'],
        exampleCode: `test.beforeAll(async () => {
  // Seed database or start backend mock service
  await seedDatabaseForTestRun();
});`,
        proTip: 'Avoid storing mutable test data across tests in beforeAll to prevent tests from depending on run order.',
      },
      {
        id: 'struct-after-all',
        name: 'Suite Teardown (afterAll)',
        syntax: 'test.afterAll(async () => { ... })',
        description: 'Runs once after all test cases in the suite have finished execution, even if individual tests failed.',
        category: 'Test Structure & Hooks',
        tags: ['Hooks', 'Lifecycle', 'Cleanup'],
        exampleCode: `test.afterAll(async () => {
  // Clean up global resources, close servers
  await teardownDatabase();
});`,
      },
      {
        id: 'struct-before-each',
        name: 'Per-Test Setup (beforeEach)',
        syntax: 'test.beforeEach(async ({ page }) => { ... })',
        description: 'Runs before each individual test case in the suite. Receives fresh test fixtures like `page` and `context`.',
        category: 'Test Structure & Hooks',
        tags: ['Hooks', 'Lifecycle', 'Setup'],
        exampleCode: `test.beforeEach(async ({ page }) => {
  await page.goto('/dashboard');
});`,
        proTip: 'Use `beforeEach` to navigate to starting URLs or authenticate via API cookies.',
      },
      {
        id: 'struct-after-each',
        name: 'Per-Test Teardown (afterEach)',
        syntax: 'test.afterEach(async ({ page }) => { ... })',
        description: 'Runs after each individual test case finishes. Ideal for per-test cleanup or attaching custom metadata.',
        category: 'Test Structure & Hooks',
        tags: ['Hooks', 'Lifecycle', 'Cleanup'],
        exampleCode: `test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log(\`Test failed! URL was: \${page.url()}\`);
  }
});`,
      },
      {
        id: 'struct-describe',
        name: 'Group Suite (describe)',
        syntax: 'test.describe(name, () => { ... })',
        description: 'Groups related test cases into a structured block with shared scope, hooks, and configuration.',
        category: 'Test Structure & Hooks',
        tags: ['Structure', 'Suite', 'Grouping'],
        exampleCode: `test.describe('Shopping Cart Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
  });

  test('adds item to cart', async ({ page }) => { /* ... */ });
  test('removes item from cart', async ({ page }) => { /* ... */ });
});`,
      },
      {
        id: 'struct-skip',
        name: 'Skip Test (skip)',
        syntax: 'test.skip(condition?, reason?)',
        description: 'Skips execution of a test case or suite unconditionally or conditionally based on runtime variables.',
        category: 'Test Structure & Hooks',
        tags: ['Conditional', 'Skip'],
        exampleCode: `// Unconditional skip:
test.skip('not implemented yet', async ({ page }) => {});

// Conditional skip:
test('webkit only feature', async ({ page, browserName }) => {
  test.skip(browserName !== 'webkit', 'This feature is only for Safari');
});`,
      },
      {
        id: 'struct-only',
        name: 'Isolate Single Test (only)',
        syntax: 'test.only(title, async ({ page }) => { ... })',
        description: 'Runs exclusively this test case (or describe block), skipping all other tests in the project. Useful for rapid debugging.',
        category: 'Test Structure & Hooks',
        tags: ['Debug', 'Only', 'Isolation'],
        exampleCode: `test.only('focus on this test while coding', async ({ page }) => {
  await page.goto('/checkout');
});`,
        proTip: 'Be sure to remove `.only` before committing code to git or pushing to CI.',
      },
      {
        id: 'struct-step',
        name: 'Annotate Test Steps (test.step)',
        syntax: 'await test.step(stepName, async () => { ... })',
        description: 'Splits complex tests into readable, named sub-steps that appear in HTML reports and Trace Viewer.',
        category: 'Test Structure & Hooks',
        tags: ['Reporting', 'Trace', 'Steps'],
        exampleCode: `test('checkout order', async ({ page }) => {
  await test.step('Log in as customer', async () => {
    await page.goto('/login');
    // ...
  });

  await test.step('Add product to cart', async () => {
    await page.getByRole('button', { name: 'Add to Cart' }).click();
  });
});`,
        proTip: 'If a test fails inside a `test.step`, the report highlights precisely which step failed.',
      },
      {
        id: 'struct-fixme',
        name: 'Mark Broken Test (fixme)',
        syntax: 'test.fixme(condition?, reason?)',
        description: 'Marks a test as known broken. Playwright will not run the test and will output a warning in reports.',
        category: 'Test Structure & Hooks',
        tags: ['Conditional', 'Fixme'],
        exampleCode: `test.fixme('bug #1042 reported in JIRA', async ({ page }) => {
  // test code
});`,
      },
      {
        id: 'struct-expect',
        name: 'Assertions API (expect)',
        syntax: 'await expect(locator).toBeVisible()',
        description: 'The primary assertions entry point. Used with locators for auto-retrying web-first assertions or with raw values.',
        category: 'Test Structure & Hooks',
        tags: ['Expect', 'Assertions', 'Core'],
        exampleCode: `// Web-first assertion (auto-retrying):
await expect(page.getByRole('heading')).toHaveText('Welcome');

// Generic assertion (immediate, no retry):
expect(response.status()).toBe(200);`,
      },
    ],
  },
  {
    id: 'locators',
    title: 'Locators',
    iconName: 'Search',
    description: 'Strict, auto-waiting element selectors prioritized by accessibility and user-facing semantics.',
    badgeCount: 10,
    items: [
      {
        id: 'loc-get-by-role',
        name: 'By Accessible Role (Highest Priority)',
        syntax: "page.getByRole(role, { name?: string | RegExp, exact?: boolean })",
        description: 'Locates elements by their ARIA accessibility role, such as button, link, heading, checkbox, dialog, alert, or combobox. Closest to real user behavior.',
        category: 'Locators',
        tags: ['Accessibility', 'ARIA', 'Role', 'Recommended'],
        exampleCode: `// Locate button by visible text:
await page.getByRole('button', { name: 'Submit Application' }).click();

// Locate heading with regex:
await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();

// Locate checkbox with checked state:
await page.getByRole('checkbox', { name: 'Subscribe', checked: false }).check();`,
        proTip: 'Always prefer `getByRole`. It ensures your app is accessible and impervious to CSS class rewrites.',
        returns: 'Locator',
      },
      {
        id: 'loc-get-by-text',
        name: 'By Text Content',
        syntax: "page.getByText(text, { exact?: boolean })",
        description: 'Locates elements containing matching text. Supports substring matching or exact matches via options or regular expressions.',
        category: 'Locators',
        tags: ['Text', 'Content'],
        exampleCode: `// Substring match:
await page.getByText('Order Confirmation').click();

// Exact match:
await page.getByText('Log in', { exact: true }).click();

// Regex pattern match:
await expect(page.getByText(/total: \\$\\d+\\.\\d{2}/i)).toBeVisible();`,
        returns: 'Locator',
      },
      {
        id: 'loc-get-by-label',
        name: 'By Associated Label',
        syntax: "page.getByLabel(text, { exact?: boolean })",
        description: 'Locates form control inputs (input, textarea, select) by their associated `<label>` text or `aria-labelledby`/`aria-label` attribute.',
        category: 'Locators',
        tags: ['Forms', 'Input', 'Label'],
        exampleCode: `// <label for="email">Email Address</label><input id="email" />
await page.getByLabel('Email Address').fill('test@company.com');
await page.getByLabel('Password').fill('SecureP@ssw0rd!');`,
        proTip: 'Perfect for text fields, select dropdowns, and checkboxes that have readable labels.',
        returns: 'Locator',
      },
      {
        id: 'loc-get-by-placeholder',
        name: 'By Input Placeholder',
        syntax: "page.getByPlaceholder(text, { exact?: boolean })",
        description: 'Locates input or textarea elements by their `placeholder` attribute value.',
        category: 'Locators',
        tags: ['Input', 'Placeholder', 'Forms'],
        exampleCode: `// <input placeholder="Search products, brands and more..." />
await page.getByPlaceholder('Search products...').fill('laptop');
await page.keyboard.press('Enter');`,
        returns: 'Locator',
      },
      {
        id: 'loc-get-by-alt-text',
        name: 'By Image Alt Text',
        syntax: "page.getByAltText(text, { exact?: boolean })",
        description: 'Locates elements with alternative text attribute, typically `<img>` or `<area>` tags.',
        category: 'Locators',
        tags: ['Images', 'Alt', 'Accessibility'],
        exampleCode: `// <img alt="Company Logo" src="/logo.png" />
await expect(page.getByAltText('Company Logo')).toBeVisible();`,
        returns: 'Locator',
      },
      {
        id: 'loc-get-by-testid',
        name: 'By Test ID (data-testid)',
        syntax: "page.getByTestId(testId)",
        description: 'Locates elements by their test identifier attribute (default: `data-testid`). Configurable in playwright.config.ts.',
        category: 'Locators',
        tags: ['TestID', 'Resilient'],
        exampleCode: `// <button data-testid="checkout-btn">Checkout</button>
await page.getByTestId('checkout-btn').click();`,
        proTip: 'Use Test IDs when text content is dynamically localized across multiple spoken languages.',
        returns: 'Locator',
      },
      {
        id: 'loc-css-xpath',
        name: 'Generic CSS / XPath Locator',
        syntax: "page.locator('selector')",
        description: 'Locates elements using standard CSS selectors or XPath expressions. Useful when accessible locators are insufficient.',
        category: 'Locators',
        tags: ['CSS', 'XPath', 'Fallback'],
        exampleCode: `// CSS selector:
await page.locator('.cart-item-row:nth-child(2)').click();

// XPath:
await page.locator('//button[contains(@class, "pay")]').click();`,
        proTip: 'Use CSS/XPath as a last resort; accessible locators produce more resilient, user-aligned tests.',
        returns: 'Locator',
      },
      {
        id: 'loc-frame-locator',
        name: 'iFrame Locator (frameLocator)',
        syntax: "page.frameLocator('selector')",
        description: 'Locates an iframe and creates a frame-scoped locator tree to seamlessly interact with elements inside the embedded document.',
        category: 'Locators',
        tags: ['iFrame', 'Embed', 'Security'],
        exampleCode: `// Interact with Stripe payment iframe:
const paymentFrame = page.frameLocator('iframe#stripe-checkout');
await paymentFrame.getByLabel('Card number').fill('4242424242424242');
await paymentFrame.getByRole('button', { name: 'Pay' }).click();`,
        proTip: 'Playwright handles cross-origin iframes automatically without needing manual `switchTo().frame()` context switching.',
        returns: 'FrameLocator',
      },
      {
        id: 'loc-filter-chain',
        name: 'Locator Filtering & Chaining',
        syntax: "locator.filter({ hasText?: string, has?: Locator })",
        description: 'Narrows down matched elements by inner text, regular expressions, or descendant locators.',
        category: 'Locators',
        tags: ['Filtering', 'Chaining', 'Lists'],
        exampleCode: `// Find the table row that contains product 'MacBook Pro':
const row = page.getByRole('row').filter({ hasText: 'MacBook Pro' });
await row.getByRole('button', { name: 'Delete' }).click();

// Filter by child element:
const activeCard = page.locator('.card').filter({
  has: page.getByRole('badge', { name: 'Active' })
});`,
        returns: 'Locator',
      },
      {
        id: 'loc-nth-first-last',
        name: 'Index Locators (.first(), .last(), .nth())',
        syntax: "locator.first() | locator.last() | locator.nth(index)",
        description: 'Selects the first, last, or zero-indexed nth matching element from a collection.',
        category: 'Locators',
        tags: ['Index', 'Collections', 'Lists'],
        exampleCode: `const items = page.getByRole('listitem');
await items.first().click();
await items.last().hover();
await items.nth(2).click(); // 3rd item (0-indexed)`,
        returns: 'Locator',
      },
    ],
  },
  {
    id: 'actions',
    title: 'Actions',
    iconName: 'MousePointer',
    description: 'User interactions with built-in actionability checks (visible, stable, enabled, clickable).',
    badgeCount: 13,
    items: [
      {
        id: 'act-click',
        name: 'Click (click)',
        syntax: "await locator.click({ button?: 'left'|'right'|'middle', clickCount?: number, delay?: number })",
        description: 'Simulates a mouse click. Automatically waits for actionability checks (visible, stable, received pointer events, enabled).',
        category: 'Actions',
        tags: ['Mouse', 'Click', 'Actionability'],
        exampleCode: `await page.getByRole('button', { name: 'Submit' }).click();

// Right click:
await page.getByTestId('context-menu-target').click({ button: 'right' });

// Click with modifier key:
await page.getByRole('link', { name: 'Open in new tab' }).click({ modifiers: ['Meta'] });`,
        isAsync: true,
      },
      {
        id: 'act-dblclick',
        name: 'Double Click (dblclick)',
        syntax: "await locator.dblclick({ delay?: number })",
        description: 'Performs a rapid double-click on the target element.',
        category: 'Actions',
        tags: ['Mouse', 'Double Click'],
        exampleCode: `await page.getByTestId('editable-cell').dblclick();`,
        isAsync: true,
      },
      {
        id: 'act-fill',
        name: 'Fast Fill Input (fill)',
        syntax: "await locator.fill(value, { force?: boolean })",
        description: 'Clears the input field and fills the entire string at once. Dispatches input and change events immediately. Recommended for form inputs.',
        category: 'Actions',
        tags: ['Forms', 'Fill', 'Fast'],
        exampleCode: `await page.getByLabel('Email').fill('engineer@company.com');`,
        proTip: 'Prefer `fill()` over `type()` or `pressSequentially()` for 10x faster and deterministic test execution.',
        isAsync: true,
      },
      {
        id: 'act-type',
        name: 'Sequential Typing (pressSequentially)',
        syntax: "await locator.pressSequentially(text, { delay?: number })",
        description: 'Types characters one by one with optional delay, firing individual keydown, keypress, and keyup events for each keystroke.',
        category: 'Actions',
        tags: ['Keyboard', 'Type', 'Sequentially'],
        exampleCode: `// Useful for auto-complete dropdowns:
await page.getByPlaceholder('Search cities').pressSequentially('San Fran', { delay: 100 });`,
        isAsync: true,
      },
      {
        id: 'act-clear',
        name: 'Clear Input (clear)',
        syntax: "await locator.clear({ force?: boolean })",
        description: 'Clears the input or textarea field completely.',
        category: 'Actions',
        tags: ['Forms', 'Clear'],
        exampleCode: `await page.getByLabel('Search Query').clear();`,
        isAsync: true,
      },
      {
        id: 'act-press',
        name: 'Press Key (press)',
        syntax: "await locator.press(key)",
        description: 'Simulates pressing a specific keyboard key (Enter, Tab, Escape, ArrowDown, Backspace) while the element is focused.',
        category: 'Actions',
        tags: ['Keyboard', 'Keys', 'Shortcuts'],
        exampleCode: `await page.getByRole('textbox').press('Enter');
await page.getByRole('dialog').press('Escape');
await page.getByTestId('code-editor').press('Control+KeyA');`,
        isAsync: true,
      },
      {
        id: 'act-hover',
        name: 'Hover Mouse (hover)',
        syntax: "await locator.hover({ position?: { x: number, y: number } })",
        description: 'Moves the mouse pointer over the center of the element to trigger hover states, tooltips, or flyout menus.',
        category: 'Actions',
        tags: ['Mouse', 'Hover', 'Flyouts'],
        exampleCode: `await page.getByRole('navigation').getByText('Services').hover();
await expect(page.getByRole('menu', { name: 'Services' })).toBeVisible();`,
        isAsync: true,
      },
      {
        id: 'act-check-uncheck',
        name: 'Check / Uncheck (check, uncheck)',
        syntax: "await locator.check() / await locator.uncheck()",
        description: 'Ensures a checkbox or radio button is checked or unchecked. Does nothing if already in desired state.',
        category: 'Actions',
        tags: ['Checkbox', 'Radio', 'Forms'],
        exampleCode: `await page.getByLabel('I agree to the Terms of Service').check();
await page.getByLabel('Receive promotional newsletters').uncheck();`,
        isAsync: true,
      },
      {
        id: 'act-select-option',
        name: 'Select Dropdown Option (selectOption)',
        syntax: "await locator.selectOption(value | label | index | array)",
        description: 'Selects one or more options in a standard `<select>` element by option value, visible label text, or index.',
        category: 'Actions',
        tags: ['Select', 'Dropdown', 'Forms'],
        exampleCode: `// Select by value:
await page.getByLabel('Country').selectOption('US');

// Select by visible label:
await page.getByLabel('State').selectOption({ label: 'California' });

// Select multiple in multi-select:
await page.getByLabel('Skills').selectOption(['react', 'playwright', 'typescript']);`,
        isAsync: true,
      },
      {
        id: 'act-drag-to',
        name: 'Drag and Drop (dragTo / objectClick)',
        syntax: "await sourceLocator.dragTo(targetLocator)",
        description: 'Drags the source element and drops it onto the target destination element.',
        category: 'Actions',
        tags: ['Drag and Drop', 'Mouse'],
        exampleCode: `const card = page.getByRole('listitem', { name: 'Task #102' });
const doneColumn = page.getByTestId('column-done');
await card.dragTo(doneColumn);`,
        isAsync: true,
      },
      {
        id: 'act-focus-blur',
        name: 'Focus & Blur',
        syntax: "await locator.focus() / await locator.blur()",
        description: 'Explicitly sets or removes focus from the element.',
        category: 'Actions',
        tags: ['Focus', 'Keyboard'],
        exampleCode: `await page.getByLabel('Search').focus();
await page.getByLabel('Search').blur();`,
        isAsync: true,
      },
      {
        id: 'act-scroll',
        name: 'Scroll Into View (scrollIntoViewIfNeeded)',
        syntax: "await locator.scrollIntoViewIfNeeded({ timeout?: number })",
        description: 'Scrolls the page until the target element is visible in the viewport.',
        category: 'Actions',
        tags: ['Scroll', 'Viewport'],
        exampleCode: `await page.getByRole('contentinfo').scrollIntoViewIfNeeded();`,
        proTip: 'Playwright auto-scrolls elements into view before click/fill actions automatically!',
        isAsync: true,
      },
      {
        id: 'act-set-files',
        name: 'Upload Files (setInputFiles)',
        syntax: "await locator.setInputFiles(files)",
        description: 'Sets one or multiple files on an `<input type="file">` element without opening OS file picker dialogs.',
        category: 'Actions',
        tags: ['Files', 'Upload'],
        exampleCode: `// Single file:
await page.getByLabel('Upload Avatar').setInputFiles('tests/fixtures/profile.png');

// Multiple files:
await page.locator('input[type="file"]').setInputFiles([
  'tests/fixtures/doc1.pdf',
  'tests/fixtures/doc2.pdf'
]);`,
        isAsync: true,
      },
    ],
  },
  {
    id: 'assertions',
    title: 'Assertions',
    iconName: 'ShieldCheck',
    description: 'Web-first assertions that automatically poll the DOM and retry until conditions are satisfied or timeout.',
    badgeCount: 16,
    items: [
      {
        id: 'assert-visible',
        name: 'Element Visible (toBeVisible)',
        syntax: "await expect(locator).toBeVisible({ timeout?: number })",
        description: 'Asserts the element is present in the DOM, has non-empty bounding rect, and is not hidden by css display, opacity, or visibility.',
        category: 'Assertions',
        tags: ['Visibility', 'Auto-Retry', 'Web-First'],
        exampleCode: `await expect(page.getByRole('alert')).toBeVisible();
await expect(page.getByText('Saved successfully')).toBeVisible({ timeout: 10000 });`,
        isWebFirst: true,
        isAsync: true,
      },
      {
        id: 'assert-hidden',
        name: 'Element Hidden (toBeHidden)',
        syntax: "await expect(locator).toBeHidden({ timeout?: number })",
        description: 'Asserts the element is either detached from the DOM or has display:none, opacity:0, or visibility:hidden.',
        category: 'Assertions',
        tags: ['Visibility', 'Hidden', 'Web-First'],
        exampleCode: `await expect(page.getByTestId('loading-spinner')).toBeHidden();`,
        isWebFirst: true,
        isAsync: true,
      },
      {
        id: 'assert-text',
        name: 'Element Text (toHaveText)',
        syntax: "await expect(locator).toHaveText(expected, { ignoreCase?: boolean, useInnerText?: boolean })",
        description: 'Asserts the element has text matching exact string, array of strings, or regular expression.',
        category: 'Assertions',
        tags: ['Text', 'Web-First'],
        exampleCode: `await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dashboard');
await expect(page.getByTestId('order-id')).toHaveText(/Order #\\d{5}/);`,
        isWebFirst: true,
        isAsync: true,
      },
      {
        id: 'assert-contain-text',
        name: 'Contains Substring (toContainText)',
        syntax: "await expect(locator).toContainText(expected, { ignoreCase?: boolean })",
        description: 'Asserts the element contains the given substring within its text content.',
        category: 'Assertions',
        tags: ['Text', 'Substring', 'Web-First'],
        exampleCode: `await expect(page.getByRole('status')).toContainText('Operation finished');`,
        isWebFirst: true,
        isAsync: true,
      },
      {
        id: 'assert-attribute',
        name: 'Element Attribute (toHaveAttribute)',
        syntax: "await expect(locator).toHaveAttribute(name, value | RegExp)",
        description: 'Asserts an HTML element possesses the specified attribute and optional value.',
        category: 'Assertions',
        tags: ['Attribute', 'DOM', 'Web-First'],
        exampleCode: `await expect(page.getByRole('button', { name: 'Accordion' })).toHaveAttribute('aria-expanded', 'true');
await expect(page.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', /.*playwright\\.dev/);`,
        isWebFirst: true,
        isAsync: true,
      },
      {
        id: 'assert-url',
        name: 'Page URL (toHaveURL)',
        syntax: "await expect(page).toHaveURL(url | RegExp)",
        description: 'Asserts the browser page currently displays a URL matching the target string or regex.',
        category: 'Assertions',
        tags: ['URL', 'Page', 'Navigation', 'Web-First'],
        exampleCode: `await expect(page).toHaveURL(/.*\\/inventory\\.html/);
await expect(page).toHaveURL('https://myapp.com/dashboard');`,
        isWebFirst: true,
        isAsync: true,
      },
      {
        id: 'assert-title',
        name: 'Page Title (toHaveTitle)',
        syntax: "await expect(page).toHaveTitle(title | RegExp)",
        description: 'Asserts the document title tag matches the expected string or regular expression.',
        category: 'Assertions',
        tags: ['Title', 'Page', 'Web-First'],
        exampleCode: `await expect(page).toHaveTitle(/Playwright Automation/i);`,
        isWebFirst: true,
        isAsync: true,
      },
      {
        id: 'assert-screenshot',
        name: 'Visual Screenshot Match (toHaveScreenshot)',
        syntax: "await expect(page | locator).toHaveScreenshot(name?, options?)",
        description: 'Compares a live pixel screenshot of the page or locator against a committed golden baseline image.',
        category: 'Assertions',
        tags: ['Visual', 'Regression', 'Screenshots', 'Web-First'],
        exampleCode: `// Page screenshot comparison:
await expect(page).toHaveScreenshot('landing-page.png', { maxDiffPixelRatio: 0.05 });

// Component-level snapshot:
await expect(page.getByTestId('hero-card')).toHaveScreenshot('hero-card.png');`,
        isWebFirst: true,
        isAsync: true,
      },
      {
        id: 'assert-enabled',
        name: 'Element Enabled (toBeEnabled)',
        syntax: "await expect(locator).toBeEnabled()",
        description: 'Asserts an interactive button, input, or control is enabled and not disabled.',
        category: 'Assertions',
        tags: ['State', 'Enabled', 'Web-First'],
        exampleCode: `await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled();`,
        isWebFirst: true,
        isAsync: true,
      },
      {
        id: 'assert-disabled',
        name: 'Element Disabled (toBeDisabled)',
        syntax: "await expect(locator).toBeDisabled()",
        description: 'Asserts an element possesses the `disabled` HTML attribute.',
        category: 'Assertions',
        tags: ['State', 'Disabled', 'Web-First'],
        exampleCode: `await expect(page.getByRole('button', { name: 'Checkout' })).toBeDisabled();`,
        isWebFirst: true,
        isAsync: true,
      },
      {
        id: 'assert-checked',
        name: 'Element Checked (toBeChecked)',
        syntax: "await expect(locator).toBeChecked()",
        description: 'Asserts a checkbox or radio button element is in the checked state.',
        category: 'Assertions',
        tags: ['State', 'Checked', 'Web-First'],
        exampleCode: `await expect(page.getByLabel('Accept Terms')).toBeChecked();`,
        isWebFirst: true,
        isAsync: true,
      },
      {
        id: 'assert-unchecked',
        name: 'Element Unchecked (toBeUnchecked)',
        syntax: "await expect(locator).toBeUnchecked()",
        description: 'Asserts a checkbox or radio button element is unchecked.',
        category: 'Assertions',
        tags: ['State', 'Unchecked', 'Web-First'],
        exampleCode: `await expect(page.getByLabel('Marketing Opt-in')).toBeUnchecked();`,
        isWebFirst: true,
        isAsync: true,
      },
      {
        id: 'assert-count',
        name: 'Element List Count (toHaveCount)',
        syntax: "await expect(locator).toHaveCount(expectedCount)",
        description: 'Asserts the locator resolves to exactly the expected number of matching DOM elements.',
        category: 'Assertions',
        tags: ['Count', 'Lists', 'Web-First'],
        exampleCode: `await expect(page.getByRole('listitem')).toHaveCount(5);`,
        isWebFirst: true,
        isAsync: true,
      },
      {
        id: 'assert-value',
        name: 'Input Field Value (toHaveValue)',
        syntax: "await expect(locator).toHaveValue(expectedValue | RegExp)",
        description: 'Asserts an input, textarea, or select element currently has the specified value.',
        category: 'Assertions',
        tags: ['Value', 'Forms', 'Web-First'],
        exampleCode: `await expect(page.getByLabel('First Name')).toHaveValue('Jane');`,
        isWebFirst: true,
        isAsync: true,
      },
      {
        id: 'assert-truthy-falsy',
        name: 'Generic Truthy & Falsy (toBeTruthy, toBeFalsy)',
        syntax: "expect(value).toBeTruthy() / expect(value).toBeFalsy()",
        description: 'Standard Jest/Playwright assertion verifying if a JavaScript primitive or object evaluates to truthy or falsy.',
        category: 'Assertions',
        tags: ['Primitives', 'Boolean', 'Generic'],
        exampleCode: `const isAvailable = await checkStockAPI();
expect(isAvailable).toBeTruthy();
expect(null).toBeFalsy();`,
      },
      {
        id: 'assert-soft',
        name: 'Soft Assertions (expect.soft)',
        syntax: "await expect.soft(locator).toBeVisible()",
        description: 'Executes an assertion without terminating test execution on failure. Collects all errors and reports them at test end.',
        category: 'Assertions',
        tags: ['Soft Assertions', 'Advanced'],
        exampleCode: `// Test continues even if one banner is missing:
await expect.soft(page.getByTestId('header')).toBeVisible();
await expect.soft(page.getByTestId('promo-banner')).toBeVisible();
await expect.soft(page.getByTestId('footer')).toBeVisible();`,
        isWebFirst: true,
        isAsync: true,
      },
    ],
  },
  {
    id: 'navigation',
    title: 'Navigation & Waits',
    iconName: 'Compass',
    description: 'Page routing, history navigation, URL transitions, and deterministic lifecycle event waits.',
    badgeCount: 8,
    items: [
      {
        id: 'nav-goto',
        name: 'Navigate to URL (goto)',
        syntax: "await page.goto(url, { waitUntil?: 'load'|'domcontentloaded'|'networkidle'|'commit' })",
        description: 'Navigates to a given URL. By default waits until the browser window triggers the `load` event.',
        category: 'Navigation & Waits',
        tags: ['Navigation', 'URL', 'Load'],
        exampleCode: `// Simple navigation:
await page.goto('/login');

// Using relative path when baseURL is configured:
await page.goto('/checkout', { waitUntil: 'domcontentloaded' });`,
        isAsync: true,
      },
      {
        id: 'nav-back-forward',
        name: 'History Back & Forward (goBack, goForward)',
        syntax: "await page.goBack() / await page.goForward()",
        description: 'Navigates backward or forward in the browser session history stack.',
        category: 'Navigation & Waits',
        tags: ['Navigation', 'History'],
        exampleCode: `await page.goBack();
await page.goForward();`,
        isAsync: true,
      },
      {
        id: 'nav-reload',
        name: 'Reload Page (reload)',
        syntax: "await page.reload({ waitUntil?: 'load'|'domcontentloaded' })",
        description: 'Reloads the current web page document.',
        category: 'Navigation & Waits',
        tags: ['Navigation', 'Reload'],
        exampleCode: `await page.reload();
await expect(page.getByText('Updated')).toBeVisible();`,
        isAsync: true,
      },
      {
        id: 'nav-close',
        name: 'Close Page (close)',
        syntax: "await page.close()",
        description: 'Closes the current browser tab / page window.',
        category: 'Navigation & Waits',
        tags: ['Page', 'Lifecycle'],
        exampleCode: `await popupPage.close();`,
        isAsync: true,
      },
      {
        id: 'nav-wait-selector',
        name: 'Wait for Selector (waitForSelector)',
        syntax: "await page.waitForSelector(selector, { state?: 'attached'|'detached'|'visible'|'hidden' })",
        description: 'Explicitly waits for an element matching a selector to enter a specific DOM state.',
        category: 'Navigation & Waits',
        tags: ['Wait', 'Selector', 'DOM'],
        exampleCode: `await page.waitForSelector('.live-data-widget', { state: 'visible' });`,
        proTip: 'Prefer web-first assertions like `expect(locator).toBeVisible()` over manual `waitForSelector()`.',
        isAsync: true,
      },
      {
        id: 'nav-wait-url',
        name: 'Wait for URL (waitForURL)',
        syntax: "await page.waitForURL(url | RegExp, { timeout?: number })",
        description: 'Waits until the current page URL matches the specified string or regular expression.',
        category: 'Navigation & Waits',
        tags: ['Wait', 'URL', 'Routing'],
        exampleCode: `await page.getByRole('button', { name: 'Log in' }).click();
await page.waitForURL('**/dashboard');`,
        isAsync: true,
      },
      {
        id: 'nav-wait-load-state',
        name: 'Wait for Load State (waitForLoadState)',
        syntax: "await page.waitForLoadState('load' | 'domcontentloaded' | 'networkidle')",
        description: 'Waits until the page reaches a specific document or network lifecycle state.',
        category: 'Navigation & Waits',
        tags: ['Lifecycle', 'Network', 'DOM'],
        exampleCode: `// Wait until there are no network connections for at least 500ms:
await page.waitForLoadState('networkidle');`,
        proTip: 'Use `networkidle` sparingly on apps with ongoing polling/WebSockets, as it may timeout.',
        isAsync: true,
      },
      {
        id: 'nav-wait-function',
        name: 'Wait for JS Predicate (waitForFunction)',
        syntax: "await page.waitForFunction(fn, arg?, options?)",
        description: 'Evaluates a JavaScript function in the browser page context until it returns a truthy value.',
        category: 'Navigation & Waits',
        tags: ['Custom Wait', 'JavaScript'],
        exampleCode: `await page.waitForFunction(() => window.myAppReady === true);`,
        isAsync: true,
      },
    ],
  },
  {
    id: 'browser',
    title: 'Browser & Context',
    iconName: 'Layers',
    description: 'Browser instances, multi-context session isolation, storage state authentication, and scripts.',
    badgeCount: 9,
    items: [
      {
        id: 'brw-launch',
        name: 'Launch Browser (chromium.launch)',
        syntax: "await chromium.launch({ headless?: boolean, slowMo?: number })",
        description: 'Launches a fresh browser executable process (Chromium, Firefox, or WebKit). Usually managed by Playwright test fixtures.',
        category: 'Browser & Context',
        tags: ['Browser', 'Launch', 'Engine'],
        exampleCode: `import { chromium } from 'playwright';

const browser = await chromium.launch({
  headless: false,
  slowMo: 100 // Slow down actions by 100ms
});`,
        isAsync: true,
      },
      {
        id: 'brw-new-context',
        name: 'Create Isolated Context (browser.newContext)',
        syntax: "await browser.newContext(options?)",
        description: 'Creates a completely isolated incognito-like browser context. Share zero cookies, cache, or localStorage with other contexts.',
        category: 'Browser & Context',
        tags: ['Context', 'Isolation', 'Incognito'],
        exampleCode: `// Create admin context and customer context in the same browser:
const adminContext = await browser.newContext();
const userContext = await browser.newContext();`,
        isAsync: true,
      },
      {
        id: 'brw-new-page',
        name: 'Create Page / Tab (context.newPage)',
        syntax: "await context.newPage()",
        description: 'Opens a new tab/page inside the specified browser context.',
        category: 'Browser & Context',
        tags: ['Page', 'Tab'],
        exampleCode: `const page = await context.newPage();
await page.goto('https://playwright.dev');`,
        isAsync: true,
      },
      {
        id: 'brw-page-context',
        name: 'Get Parent Context (page.context)',
        syntax: "page.context()",
        description: 'Returns the parent browser context that owns the page.',
        category: 'Browser & Context',
        tags: ['Context', 'Access'],
        exampleCode: `const context = page.context();
await context.clearCookies();`,
      },
      {
        id: 'brw-close-context',
        name: 'Close Context (browserContext.close)',
        syntax: "await context.close()",
        description: 'Closes the browser context and all pages/tabs associated with it, purging temporary storage.',
        category: 'Browser & Context',
        tags: ['Cleanup', 'Context'],
        exampleCode: `await context.close();`,
        isAsync: true,
      },
      {
        id: 'brw-close-browser',
        name: 'Close Browser Instance (browser.close)',
        syntax: "await browser.close()",
        description: 'Closes the browser binary process entirely.',
        category: 'Browser & Context',
        tags: ['Cleanup', 'Browser'],
        exampleCode: `await browser.close();`,
        isAsync: true,
      },
      {
        id: 'brw-storage-state',
        name: 'Save & Reuse Auth State (storageState)',
        syntax: "await context.storageState({ path: 'auth.json' })",
        description: 'Dumps all cookies and localStorage items from the current context to a JSON file to bypass UI login in subsequent tests.',
        category: 'Browser & Context',
        tags: ['Auth', 'Storage', 'Optimization'],
        exampleCode: `// In auth setup test:
await page.goto('/login');
await page.getByLabel('User').fill('admin');
await page.getByRole('button', { name: 'Login' }).click();
await page.context().storageState({ path: 'playwright/.auth/user.json' });

// In playwright.config.ts use:
// use: { storageState: 'playwright/.auth/user.json' }`,
        proTip: 'Eliminates redundant UI login steps across hundreds of tests, slashing test suite runtimes by up to 70%.',
        isAsync: true,
      },
      {
        id: 'brw-init-script',
        name: 'Add Init Script (context.addInitScript)',
        syntax: "await context.addInitScript(script)",
        description: 'Injects and executes a JavaScript snippet in every page before any other scripts run.',
        category: 'Browser & Context',
        tags: ['Init', 'Polyfill', 'Mock'],
        exampleCode: `await context.addInitScript(() => {
  // Mock feature flag or date:
  window.localStorage.setItem('feature_dark_mode', 'true');
});`,
        isAsync: true,
      },
      {
        id: 'brw-permissions-geo',
        name: 'Permissions & Geolocation',
        syntax: "await context.grantPermissions(perms, { origin })",
        description: 'Grants browser permissions (notifications, geolocation, camera, microphone) without prompts.',
        category: 'Browser & Context',
        tags: ['Permissions', 'Geolocation'],
        exampleCode: `await context.grantPermissions(['geolocation'], { origin: 'https://maps.google.com' });
await context.setGeolocation({ latitude: 37.7749, longitude: -122.4194 });`,
        isAsync: true,
      },
    ],
  },
  {
    id: 'input',
    title: 'Keyboard & Input',
    iconName: 'Keyboard',
    description: 'Hardware keyboard simulation, modifier keys, chord shortcuts, and low-level mouse coordinate actions.',
    badgeCount: 7,
    items: [
      {
        id: 'inp-key-press',
        name: 'Keyboard Press (keyboard.press)',
        syntax: "await page.keyboard.press(key)",
        description: 'Simulates pressing and immediately releasing a keyboard key or shortcut chord combination.',
        category: 'Keyboard & Input',
        tags: ['Keyboard', 'Shortcuts'],
        exampleCode: `await page.keyboard.press('Escape');
await page.keyboard.press('Control+KeyC'); // Copy shortcut
await page.keyboard.press('Shift+Tab');`,
        isAsync: true,
      },
      {
        id: 'inp-key-type',
        name: 'Keyboard Type (keyboard.type)',
        syntax: "await page.keyboard.type(text, { delay?: number })",
        description: 'Types characters one after another into whatever element currently has DOM focus.',
        category: 'Keyboard & Input',
        tags: ['Keyboard', 'Typing'],
        exampleCode: `await page.keyboard.type('Hello World!', { delay: 50 });`,
        isAsync: true,
      },
      {
        id: 'inp-key-down-up',
        name: 'Hold & Release Key (down, up)',
        syntax: "await page.keyboard.down(key) / await page.keyboard.up(key)",
        description: 'Holds a modifier or key down across subsequent actions, then releases it.',
        category: 'Keyboard & Input',
        tags: ['Keyboard', 'Modifier', 'Hold'],
        exampleCode: `await page.keyboard.down('Shift');
for (let i = 0; i < 3; i++) {
  await page.keyboard.press('ArrowDown');
}
await page.keyboard.up('Shift');`,
        isAsync: true,
      },
      {
        id: 'inp-key-insert',
        name: 'Insert Text (keyboard.insertText)',
        syntax: "await page.keyboard.insertText(text)",
        description: 'Directly inserts text into the focused element without triggering keydown or keyup events (paste behavior).',
        category: 'Keyboard & Input',
        tags: ['Keyboard', 'Paste'],
        exampleCode: `await page.keyboard.insertText('Bulk clipboard content');`,
        isAsync: true,
      },
      {
        id: 'inp-mouse-click',
        name: 'Mouse Click at Coordinates',
        syntax: "await page.mouse.click(x, y, { button?, clickCount? })",
        description: 'Clicks the mouse at precise pixel coordinates (X, Y) relative to the top-left of the viewport.',
        category: 'Keyboard & Input',
        tags: ['Mouse', 'Coordinates'],
        exampleCode: `await page.mouse.click(250, 400);
await page.mouse.dblclick(250, 400);`,
        isAsync: true,
      },
      {
        id: 'inp-mouse-move',
        name: 'Mouse Move & Drag',
        syntax: "await page.mouse.move(x, y, { steps?: number })",
        description: 'Moves the mouse pointer along coordinates with optional intermediate steps for fluid motion simulation.',
        category: 'Keyboard & Input',
        tags: ['Mouse', 'Move', 'Canvas'],
        exampleCode: `// Draw on HTML5 canvas:
await page.mouse.move(100, 100);
await page.mouse.down();
await page.mouse.move(200, 200, { steps: 10 });
await page.mouse.up();`,
        isAsync: true,
      },
      {
        id: 'inp-mouse-wheel',
        name: 'Mouse Wheel Scroll (mouse.wheel)',
        syntax: "await page.mouse.wheel(deltaX, deltaY)",
        description: 'Simulates mouse wheel scrolling by deltaX and deltaY pixels.',
        category: 'Keyboard & Input',
        tags: ['Mouse', 'Scroll'],
        exampleCode: `await page.mouse.wheel(0, 500); // Scroll down 500px`,
        isAsync: true,
      },
    ],
  },
  {
    id: 'network',
    title: 'Network & API Testing',
    iconName: 'Globe',
    description: 'Intercepting and mocking HTTP requests, waiting for responses, and direct API testing via request fixture.',
    badgeCount: 8,
    items: [
      {
        id: 'net-route-mock',
        name: 'Mock Network Requests (page.route)',
        syntax: "await page.route(url | RegExp, async route => { ... })",
        description: 'Intercepts matching HTTP requests to mock responses, abort them, or modify headers and payloads.',
        category: 'Network & API',
        tags: ['Mocking', 'Route', 'Network', 'Offline'],
        exampleCode: `// Intercept API call and return mock JSON data:
await page.route('**/api/users', async route => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ id: 1, name: 'Alice Test' }])
  });
});`,
        proTip: 'Mock slow third-party analytics or ads with `route.abort()` to accelerate test runs.',
        isAsync: true,
      },
      {
        id: 'net-route-abort',
        name: 'Block Requests (route.abort)',
        syntax: "await route.abort(errorCode?)",
        description: 'Aborts a request (e.g. blocking images, tracking pixels, or simulating network failure).',
        category: 'Network & API',
        tags: ['Network', 'Block', 'Performance'],
        exampleCode: `await page.route('**/*.{png,jpg,jpeg,svg}', route => route.abort());`,
        isAsync: true,
      },
      {
        id: 'net-wait-response',
        name: 'Wait for Network Response',
        syntax: "await page.waitForResponse(urlOrPredicate, { timeout?: number })",
        description: 'Waits for a specific network response to complete. Essential for verifying backend API calls triggered by UI clicks.',
        category: 'Network & API',
        tags: ['Network', 'Response', 'Wait'],
        exampleCode: `// Click button and await specific API response simultaneously:
const [response] = await Promise.all([
  page.waitForResponse(res => res.url().includes('/api/checkout') && res.status() === 200),
  page.getByRole('button', { name: 'Place Order' }).click()
]);

const data = await response.json();
expect(data.orderId).toBeDefined();`,
        isAsync: true,
      },
      {
        id: 'net-request-get',
        name: 'Send GET API Request',
        syntax: "await request.get(url, { headers?, params? })",
        description: 'Sends an HTTP GET request using Playwright APIRequestContext fixture without launching a browser.',
        category: 'Network & API',
        tags: ['API', 'GET', 'HTTP'],
        exampleCode: `test('query items API', async ({ request }) => {
  const response = await request.get('/api/items', {
    headers: { 'Authorization': 'Bearer test-token' }
  });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.items.length).toBeGreaterThan(0);
});`,
        isAsync: true,
      },
      {
        id: 'net-request-post',
        name: 'Send POST API Request',
        syntax: "await request.post(url, { data?, headers? })",
        description: 'Sends an HTTP POST request with JSON payload or form data.',
        category: 'Network & API',
        tags: ['API', 'POST', 'HTTP'],
        exampleCode: `test('create user via API', async ({ request }) => {
  const response = await request.post('/api/users', {
    data: { name: 'Bob', role: 'developer' }
  });
  expect(response.status()).toBe(201);
});`,
        isAsync: true,
      },
      {
        id: 'net-request-put-del',
        name: 'PUT / DELETE Requests',
        syntax: "await request.put(url, { data? }) / await request.delete(url)",
        description: 'Sends HTTP PUT, PATCH, or DELETE requests for full REST API testing.',
        category: 'Network & API',
        tags: ['API', 'REST', 'PUT', 'DELETE'],
        exampleCode: `await request.put('/api/users/12', { data: { role: 'admin' } });
await request.delete('/api/users/12');`,
        isAsync: true,
      },
      {
        id: 'net-response-json',
        name: 'Parse Response JSON (response.json)',
        syntax: "await response.json()",
        description: 'Parses the HTTP response body stream as a JavaScript object.',
        category: 'Network & API',
        tags: ['API', 'JSON'],
        exampleCode: `const payload = await response.json();
expect(payload.status).toBe('SUCCESS');`,
        isAsync: true,
      },
      {
        id: 'net-unroute',
        name: 'Remove Network Routes (page.unroute)',
        syntax: "await page.unroute(url | RegExp)",
        description: 'Removes previously registered route interceptors so requests pass through to the real network.',
        category: 'Network & API',
        tags: ['Route', 'Cleanup'],
        exampleCode: `await page.unroute('**/api/users');`,
        isAsync: true,
      },
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced Playwright Functionality',
    iconName: 'Sparkles',
    description: 'Tabs and popups, browser dialogs, screenshot baselines, file uploads/downloads, page events, and custom fixtures.',
    badgeCount: 12,
    items: [
      {
        id: 'adv-new-tab',
        name: 'Multiple Tabs & Windows',
        syntax: "const [newPage] = await Promise.all([context.waitForEvent('page'), locator.click()])",
        description: 'Listens for and captures newly opened tabs/windows triggered by links with `target="_blank"`.',
        category: 'Advanced Functionality',
        subcategory: 'Multiple Tabs/Windows',
        tags: ['Tabs', 'Windows', 'Events'],
        exampleCode: `// Click link that opens new tab:
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.getByRole('link', { name: 'Help Documentation' }).click()
]);

await newPage.waitForLoadState();
await expect(newPage).toHaveTitle(/Help/);
await newPage.close();`,
        isAsync: true,
      },
      {
        id: 'adv-popups',
        name: 'Handle Popups',
        syntax: "const [popup] = await Promise.all([page.waitForEvent('popup'), locator.click()])",
        description: 'Waits for and captures windows opened via `window.open()` popups.',
        category: 'Advanced Functionality',
        subcategory: 'Multiple Tabs/Windows',
        tags: ['Popups', 'Windows'],
        exampleCode: `const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.getByRole('button', { name: 'Log in with Google' }).click()
]);
await popup.getByLabel('Email').fill('google-user@gmail.com');`,
        isAsync: true,
      },
      {
        id: 'adv-dialogs',
        name: 'Alerts, Confirms & Prompts (dialog)',
        syntax: "page.on('dialog', async dialog => { await dialog.accept(promptText?) })",
        description: 'Listens for browser native JavaScript dialogs (`alert()`, `confirm()`, `prompt()`) and accepts or dismisses them.',
        category: 'Advanced Functionality',
        subcategory: 'Alerts/Dialogs',
        tags: ['Dialogs', 'Alerts', 'Confirms'],
        exampleCode: `// Automatically dismiss or accept dialog:
page.on('dialog', async dialog => {
  expect(dialog.message()).toBe('Are you sure you want to delete this?');
  expect(dialog.type()).toBe('confirm');
  await dialog.accept(); // or dialog.dismiss()
});

await page.getByRole('button', { name: 'Delete Account' }).click();`,
        proTip: 'By default, Playwright automatically dismisses all dialogs if no listener is attached, avoiding test hangs.',
      },
      {
        id: 'adv-screenshots',
        name: 'Capture Screenshots',
        syntax: "await page.screenshot({ path: 'shot.png', fullPage?: boolean })",
        description: 'Captures full page or viewport PNG screenshots for diagnostics or audit logs.',
        category: 'Advanced Functionality',
        subcategory: 'Screenshots',
        tags: ['Screenshots', 'Diagnostics'],
        exampleCode: `// Full page screenshot (scrolled down):
await page.screenshot({ path: 'screenshots/full-page.png', fullPage: true });

// Element-specific screenshot:
await page.getByTestId('invoice-preview').screenshot({ path: 'screenshots/invoice.png' });`,
        isAsync: true,
      },
      {
        id: 'adv-downloads',
        name: 'File Downloads',
        syntax: "const [download] = await Promise.all([page.waitForEvent('download'), locator.click()])",
        description: 'Captures browser file download events and saves the downloaded stream to a local path.',
        category: 'Advanced Functionality',
        subcategory: 'File Operations',
        tags: ['Downloads', 'Files'],
        exampleCode: `const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByRole('button', { name: 'Download CSV Export' }).click()
]);

// Wait for download to finish:
const suggestedFileName = download.suggestedFilename();
await download.saveAs(\`./downloads/\${suggestedFileName}\`);`,
        isAsync: true,
      },
      {
        id: 'adv-page-events-console',
        name: 'Monitor Console Logs',
        syntax: "page.on('console', msg => ...)",
        description: 'Subscribes to browser console log messages (log, info, error, warning) to catch frontend errors.',
        category: 'Advanced Functionality',
        subcategory: 'Page Events',
        tags: ['Events', 'Console', 'Diagnostics'],
        exampleCode: `page.on('console', msg => {
  if (msg.type() === 'error') {
    console.error(\`Page Error detected: \${msg.text()}\`);
  }
});`,
      },
      {
        id: 'adv-page-events-errors',
        name: 'Catch Unhandled Page Errors',
        syntax: "page.on('pageerror', error => ...)",
        description: 'Listens for unhandled exceptions or uncaught errors thrown inside the browser window.',
        category: 'Advanced Functionality',
        subcategory: 'Page Events',
        tags: ['Events', 'Errors', 'Exceptions'],
        exampleCode: `page.on('pageerror', exception => {
  console.log(\`Uncaught exception: "\${exception.message}"\`);
});`,
      },
      {
        id: 'adv-page-events-req-res',
        name: 'Monitor Requests & Responses',
        syntax: "page.on('request', req => ...) / page.on('response', res => ...)",
        description: 'Attaches real-time listeners for all outgoing network requests and incoming responses.',
        category: 'Advanced Functionality',
        subcategory: 'Page Events',
        tags: ['Events', 'Network', 'Telemetry'],
        exampleCode: `page.on('request', req => console.log('>>', req.method(), req.url()));
page.on('response', res => console.log('<<', res.status(), res.url()));`,
      },
      {
        id: 'adv-test-use',
        name: 'Configure Options (test.use)',
        syntax: "test.use({ locale?: string, viewport?: { width, height } })",
        description: 'Configures fixtures or environment overrides for an entire file or describe block.',
        category: 'Advanced Functionality',
        subcategory: 'Fixtures & Configuration',
        tags: ['Fixtures', 'Options', 'Configuration'],
        exampleCode: `// Configure mobile viewport and French locale for this file:
test.use({
  viewport: { width: 390, height: 844 },
  locale: 'fr-FR',
  timezoneId: 'Europe/Paris'
});`,
      },
      {
        id: 'adv-test-extend',
        name: 'Custom Fixtures (test.extend)',
        syntax: "export const test = base.extend<{ myFixture: FixtureType }>({ ... })",
        description: 'Creates reusable custom test fixtures that encapsulate setup and teardown logic with dependency injection.',
        category: 'Advanced Functionality',
        subcategory: 'Fixtures & Configuration',
        tags: ['Fixtures', 'Extension', 'Page Object Model'],
        exampleCode: `import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

type MyFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage); // Provide to test
    // Optional teardown after test finishes
  },
});`,
      },
      {
        id: 'adv-config-file',
        name: 'Configuration Options (playwright.config.ts)',
        syntax: "export default defineConfig({ testDir, timeout, retries, workers, reporter, use })",
        description: 'Central configuration file managing global timeouts, test discovery, browser matrix projects, retries, and artifacts.',
        category: 'Advanced Functionality',
        subcategory: 'Fixtures & Configuration',
        tags: ['Config', 'Architecture', 'Settings'],
        exampleCode: `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'https://staging.example.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});`,
        proTip: 'Centralize baseURL, viewport, and trace settings in `use: {}` so your spec files remain clean and focused on business logic.',
      },
      {
        id: 'adv-serial-mode',
        name: 'Serial Execution (test.describe.serial)',
        syntax: "test.describe.serial(name, () => { ... })",
        description: 'Runs tests in serial mode on the same worker process. If any test fails, subsequent tests are skipped.',
        category: 'Advanced Functionality',
        subcategory: 'Fixtures & Configuration',
        tags: ['Serial', 'Dependencies', 'Order'],
        exampleCode: `test.describe.serial('E2E Onboarding Wizard', () => {
  test('step 1: enter personal info', async ({ page }) => { /* ... */ });
  test('step 2: verify phone SMS', async ({ page }) => { /* ... */ });
  test('step 3: confirm registration', async ({ page }) => { /* ... */ });
});`,
      },
    ],
  },
];

export interface DebuggingChallenge {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Enterprise';
  symptom: string;
  errorOutput: string;
  failingCode: string;
  fixedCode: string;
  hints: string[];
  rootCause: string;
  productionPreventionStrategy: string;
}

export const DEBUGGING_CHALLENGES: DebuggingChallenge[] = [
  {
    id: 'dbg-01',
    title: 'Strict Mode Locator Violation',
    category: 'Strict Locator Violation',
    difficulty: 'Intermediate',
    symptom: 'Test crashes immediately on click with "strict mode violation" even though the button is clearly visible.',
    errorOutput: `Error: locator.click: Error: strict mode violation: locator('button') resolved to 3 elements:
    1) <button class="btn nav-btn">Home</button> aka getByRole('button', { name: 'Home' })
    2) <button class="btn submit-btn">Save Changes</button> aka getByRole('button', { name: 'Save Changes' })
    3) <button class="btn cancel-btn">Cancel</button> aka getByRole('button', { name: 'Cancel' })

    at /tests/profile.spec.ts:18:28`,
    failingCode: `import { test, expect } from '@playwright/test';

test('save user profile settings', async ({ page }) => {
  await page.goto('/settings/profile');
  await page.getByLabel('Display Name').fill('Alex Rivera');
  
  // BROKEN: Generic selector matches multiple buttons on the page
  await page.locator('button').click();

  await expect(page.getByText('Profile updated')).toBeVisible();
});`,
    fixedCode: `import { test, expect } from '@playwright/test';

test('save user profile settings', async ({ page }) => {
  await page.goto('/settings/profile');
  await page.getByLabel('Display Name').fill('Alex Rivera');
  
  // FIXED: Explicit accessible name with exact matching
  await page.getByRole('button', { name: 'Save Changes', exact: true }).click();

  await expect(page.getByText('Profile updated')).toBeVisible();
});`,
    hints: [
      'Hint 1: Playwright enforces "strict mode" by default: if a locator resolves to >1 element, any action throws.',
      'Hint 2: Instead of a tag name locator("button"), target the specific button using accessible semantics.',
      'Hint 3: Use page.getByRole("button", { name: "Save Changes" }).'
    ],
    rootCause: 'Playwright locator actions strictly require a single unique element match. When locator("button") was called, the DOM contained three buttons (Home, Save Changes, Cancel). Because Playwright refuses to guess which button you intended, it threw a strict mode violation to prevent accidental clicks on the wrong element.',
    productionPreventionStrategy: 'Always use semantic, role-based locators with accessible names (getByRole("button", { name: "..." })) or filter by test ID. Never use bare tag selectors for interactive elements.'
  },
  {
    id: 'dbg-02',
    title: 'Flaky Animation Race Condition',
    category: 'Race Condition & Wait',
    difficulty: 'Intermediate',
    symptom: 'Modal button clicks intermittently fail in CI headless runs, but usually pass in headed local mode.',
    errorOutput: `Error: locator.click: Target closed
Call log:
  - waiting for locator('button.confirm-delete')
  - locator resolved to <button class="confirm-delete">Delete Project</button>
  - attempting click action
  - waiting for element to be visible, enabled and stable
  - element is not stable - scrolling or animating
  - retrying click action...
  - element was detached from the DOM, retrying...
Timeout 30000ms exceeded.`,
    failingCode: `import { test, expect } from '@playwright/test';

test('delete project modal confirmation', async ({ page }) => {
  await page.goto('/projects/123');
  await page.getByRole('button', { name: /delete/i }).click();

  // BROKEN: Modal has a 400ms CSS slide-in animation. 
  // Clicking an animating CSS class without auto-stability assertion causes flakiness
  await page.locator('button.confirm-delete').click({ force: true });

  await expect(page.getByText('Project deleted')).toBeVisible();
});`,
    fixedCode: `import { test, expect } from '@playwright/test';

test('delete project modal confirmation', async ({ page }) => {
  await page.goto('/projects/123');
  await page.getByRole('button', { name: /delete/i }).click();

  // FIXED: Await modal dialog visibility, let Playwright ensure element is stable naturally, remove force: true
  const dialog = page.getByRole('dialog', { name: /confirm deletion/i });
  await expect(dialog).toBeVisible();
  
  await dialog.getByRole('button', { name: 'Delete Project' }).click();

  await expect(page.getByText('Project deleted')).toBeVisible();
});`,
    hints: [
      'Hint 1: Using { force: true } disables Playwright auto-waiting actionability checks, causing clicks to dispatch while the button is still moving or detaching.',
      'Hint 2: First assert that the modal dialog itself is fully visible.',
      'Hint 3: Scope your button locator within the dialog: dialog.getByRole("button", { name: ... }).'
    ],
    rootCause: 'The developer used { force: true } to suppress animation warnings. In CI, headless browser rendering differs slightly in frame timing: forcing the click during a CSS transform hit the element while its bounding box was shifting, or triggered the click before event listeners were bound.',
    productionPreventionStrategy: 'Never use force: true as a workaround for animations. Scope queries to the parent modal dialog and wait for the dialog container to be visible (await expect(dialog).toBeVisible()), allowing Playwright natural actionability checks to wait for the element to stabilize.'
  },
  {
    id: 'dbg-03',
    title: 'Silent Iframe Context Drop',
    category: 'Iframe Context Lost',
    difficulty: 'Advanced',
    symptom: 'Payment fields (Credit Card Number, CVV) throw NoSuchElement / TimeoutError even though they are clearly visible on the screen.',
    errorOutput: `Error: locator.fill: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('#card-number')
  - locator('#card-number') was not found in page DOM hierarchy.

    at /tests/payment.spec.ts:14:42`,
    failingCode: `import { test, expect } from '@playwright/test';

test('enter credit card info in payment checkout', async ({ page }) => {
  await page.goto('/checkout');
  
  // BROKEN: The card input is hosted inside a Stripe iframe (<iframe src="stripe.com/...">)
  // Querying page.locator() looks only at the top-level document!
  await page.locator('#card-number').fill('4242 4242 4242 4242');
  await page.locator('#card-cvv').fill('123');

  await page.getByRole('button', { name: /pay now/i }).click();
});`,
    fixedCode: `import { test, expect } from '@playwright/test';

test('enter credit card info in payment checkout', async ({ page }) => {
  await page.goto('/checkout');
  
  // FIXED: Traverse into the iframe using frameLocator()
  const stripeFrame = page.frameLocator('iframe[name="__privateStripeFrame"]');
  
  await stripeFrame.getByLabel('Card Number').fill('4242 4242 4242 4242');
  await stripeFrame.getByLabel('CVC').fill('123');

  // Top-level page button
  await page.getByRole('button', { name: /pay now/i }).click();
});`,
    hints: [
      'Hint 1: Browser security restricts cross-origin iframes. page.locator() cannot pierce iframe boundaries.',
      'Hint 2: Use page.frameLocator(iframeSelector) to create an iframe-scoped locator.',
      'Hint 3: Once you have the frame locator, call getByLabel or locator on the frame object.'
    ],
    rootCause: 'Third-party payment gateways (Stripe, PayPal) render form inputs inside embedded <iframe> elements for PCI-DSS compliance. Standard page.locator() only traverses the root DOM. Calling fill directly on the page fails because #card-number does not exist in the outer document.',
    productionPreventionStrategy: 'Encapsulate third-party iframes in Page Components using page.frameLocator(selector). frameLocator auto-waits for the iframe to load and dynamically re-evaluates if the iframe reloads.'
  },
  {
    id: 'dbg-04',
    title: 'Parallel Worker State Leak & Shared Cookie Collision',
    category: 'Fixture Scope Problem',
    difficulty: 'Advanced',
    symptom: 'Running tests with 1 worker always passes. When increasing to --workers=4, tests randomly fail with wrong user dashboard or unexpected logged-out state.',
    errorOutput: `Error: expect(received).toHaveText(expected)
Expected: "Welcome back, User_A"
Received: "Welcome back, User_B"

    at /tests/dashboard.spec.ts:32:45
    Workers: 4 parallel workers`,
    failingCode: `import { test, expect } from '@playwright/test';

// BROKEN: Global mutable state shared across all tests and workers in the file!
let activeUserToken = '';

test.beforeAll(async () => {
  // Overwrites global variable on every test file import
  activeUserToken = 'user_session_' + Math.random();
});

test('verify user profile loads correct data', async ({ page }) => {
  await page.setExtraHTTPHeaders({ 'Authorization': \`Bearer \${activeUserToken}\` });
  await page.goto('/dashboard');
  await expect(page.getByTestId('welcome-msg')).toHaveText('Welcome back, User_A');
});`,
    fixedCode: `import { test as base, expect } from '@playwright/test';

// FIXED: Use test-scoped fixtures to ensure complete isolation per test
type TestFixtures = {
  userSession: { token: string; username: string };
};

const test = base.extend<TestFixtures>({
  userSession: async ({}, use) => {
    // Isolated setup per test execution
    const session = {
      token: 'user_session_' + Math.random().toString(36).substring(7),
      username: 'User_A'
    };
    await use(session);
  }
});

test('verify user profile loads correct data', async ({ page, userSession }) => {
  await page.setExtraHTTPHeaders({ 'Authorization': \`Bearer \${userSession.token}\` });
  await page.goto('/dashboard');
  await expect(page.getByTestId('welcome-msg')).toHaveText(\`Welcome back, \${userSession.username}\`);
});`,
    hints: [
      'Hint 1: Global let variables in test files create race conditions across tests.',
      'Hint 2: Playwright executes tests concurrently across isolated Node worker processes.',
      'Hint 3: Replace file-level global variables with test-scoped fixtures (base.extend).'
    ],
    rootCause: 'Module-level variables (let activeUserToken) are shared within a worker process. When tests run in parallel or when test files share worker threads, concurrent tests overwrite the shared variable mid-execution, causing User B token to bleed into User A test.',
    productionPreventionStrategy: 'Treat all automation code as multi-threaded. Never store test-specific state in global or module-level variables. Use Playwright custom fixtures (test.extend) to provide clean, isolated dependencies for every single test execution.'
  }
];

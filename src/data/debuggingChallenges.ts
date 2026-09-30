import { SupportedLanguage } from './languages';

export interface DebuggingVariant {
  filename: string;
  failingCode: string;
  fixedCode: string;
  errorOutput: string;
  hints?: string[];
}

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
  variants?: Partial<Record<SupportedLanguage, DebuggingVariant>>;
}

export function getChallengeForLanguage(
  challenge: DebuggingChallenge,
  lang: SupportedLanguage
): DebuggingChallenge & { filename: string } {
  if (challenge.variants && challenge.variants[lang]) {
    const v = challenge.variants[lang]!;
    return {
      ...challenge,
      filename: v.filename,
      failingCode: v.failingCode,
      fixedCode: v.fixedCode,
      errorOutput: v.errorOutput,
      hints: v.hints || challenge.hints
    };
  }

  const ext = lang === 'java' ? 'java' : lang === 'python' ? 'py' : lang === 'javascript' ? 'js' : 'ts';
  return {
    ...challenge,
    filename: `Test.${ext}`
  };
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
    productionPreventionStrategy: 'Always use semantic, role-based locators with accessible names (getByRole("button", { name: "..." })) or filter by test ID. Never use bare tag selectors for interactive elements.',
    variants: {
      java: {
        filename: 'ProfileTest.java',
        errorOutput: `com.microsoft.playwright.PlaywrightException: Error: strict mode violation: locator("button") resolved to 3 elements:
    1) <button class="btn nav-btn">Home</button> aka getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Home"))
    2) <button class="btn submit-btn">Save Changes</button> aka getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Save Changes"))
    3) <button class="btn cancel-btn">Cancel</button> aka getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Cancel"))

    at com.enterprise.tests.ProfileTest.saveUserProfile(ProfileTest.java:18)`,
        failingCode: `package com.enterprise.tests;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import org.junit.jupiter.api.Test;

public class ProfileTest {
    @Test
    void saveUserProfile(Page page) {
        page.navigate("/settings/profile");
        page.getByLabel("Display Name").fill("Alex Rivera");

        // BROKEN: Generic locator resolves to 3 buttons
        page.locator("button").click();

        assertThat(page.getByText("Profile updated")).isVisible();
    }
}`,
        fixedCode: `package com.enterprise.tests;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import org.junit.jupiter.api.Test;

public class ProfileTest {
    @Test
    void saveUserProfile(Page page) {
        page.navigate("/settings/profile");
        page.getByLabel("Display Name").fill("Alex Rivera");

        // FIXED: Semantic role with explicit name
        page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Save Changes").setExact(true)).click();

        assertThat(page.getByText("Profile updated")).isVisible();
    }
}`,
        hints: [
          'Hint 1: Use page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Save Changes")).',
          'Hint 2: Eliminate page.locator("button").click().'
        ]
      },
      python: {
        filename: 'test_profile.py',
        errorOutput: `playwright._impl._errors.Error: strict mode violation: locator("button") resolved to 3 elements:
    1) <button class="btn nav-btn">Home</button> aka get_by_role("button", name="Home")
    2) <button class="btn submit-btn">Save Changes</button> aka get_by_role("button", name="Save Changes")
    3) <button class="btn cancel-btn">Cancel</button> aka get_by_role("button", name="Cancel")
    at test_profile.py:18 in test_save_user_profile`,
        failingCode: `from playwright.sync_api import Page, expect

def test_save_user_profile(page: Page):
    page.goto("/settings/profile")
    page.get_by_label("Display Name").fill("Alex Rivera")

    # BROKEN: Generic selector matches multiple buttons
    page.locator("button").click()

    expect(page.get_by_text("Profile updated")).to_be_visible()`,
        fixedCode: `from playwright.sync_api import Page, expect

def test_save_user_profile(page: Page):
    page.goto("/settings/profile")
    page.get_by_label("Display Name").fill("Alex Rivera")

    # FIXED: Semantic role with accessible name
    page.get_by_role("button", name="Save Changes", exact=True).click()

    expect(page.get_by_text("Profile updated")).to_be_visible()`,
        hints: [
          'Hint 1: Use page.get_by_role("button", name="Save Changes", exact=True).click().'
        ]
      },
      javascript: {
        filename: 'profile.spec.js',
        errorOutput: `Error: locator.click: Error: strict mode violation: locator('button') resolved to 3 elements`,
        failingCode: `const { test, expect } = require('@playwright/test');

test('save user profile settings', async ({ page }) => {
  await page.goto('/settings/profile');
  await page.getByLabel('Display Name').fill('Alex Rivera');
  await page.locator('button').click();
  await expect(page.getByText('Profile updated')).toBeVisible();
});`,
        fixedCode: `const { test, expect } = require('@playwright/test');

test('save user profile settings', async ({ page }) => {
  await page.goto('/settings/profile');
  await page.getByLabel('Display Name').fill('Alex Rivera');
  await page.getByRole('button', { name: 'Save Changes', exact: true }).click();
  await expect(page.getByText('Profile updated')).toBeVisible();
});`,
        hints: ['Hint 1: Use getByRole with accessible name.']
      },
      typescript: {
        filename: 'profile.spec.ts',
        errorOutput: `Error: locator.click: Error: strict mode violation: locator('button') resolved to 3 elements`,
        failingCode: `import { test, expect } from '@playwright/test';

test('save user profile settings', async ({ page }) => {
  await page.goto('/settings/profile');
  await page.getByLabel('Display Name').fill('Alex Rivera');
  await page.locator('button').click();
  await expect(page.getByText('Profile updated')).toBeVisible();
});`,
        fixedCode: `import { test, expect } from '@playwright/test';

test('save user profile settings', async ({ page }) => {
  await page.goto('/settings/profile');
  await page.getByLabel('Display Name').fill('Alex Rivera');
  await page.getByRole('button', { name: 'Save Changes', exact: true }).click();
  await expect(page.getByText('Profile updated')).toBeVisible();
});`,
        hints: ['Hint 1: Use getByRole with accessible name.']
      }
    }
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
  - retrying click action, attempt #2...
  - element was detached from the DOM, retrying...`,
    failingCode: `import { test, expect } from '@playwright/test';

test('delete project modal confirmation', async ({ page }) => {
  await page.goto('/projects/alpha');
  await page.getByRole('button', { name: 'Delete Project' }).click();

  // BROKEN: Forcing click bypassing stability check during sliding modal animation
  await page.locator('button.confirm-delete').click({ force: true });

  await expect(page.getByText('Project deleted successfully')).toBeVisible();
});`,
    fixedCode: `import { test, expect } from '@playwright/test';

test('delete project modal confirmation', async ({ page }) => {
  await page.goto('/projects/alpha');
  await page.getByRole('button', { name: 'Delete Project' }).click();

  // FIXED: Assert dialog container is fully stable before acting on its children
  const modal = page.getByRole('dialog', { name: 'Confirm Deletion' });
  await expect(modal).toBeVisible();

  // Let Playwright perform standard non-forced actionability checks on stable element
  await modal.getByRole('button', { name: 'Confirm Delete' }).click();

  await expect(page.getByText('Project deleted successfully')).toBeVisible();
});`,
    hints: [
      'Hint 1: Never use { force: true } as a workaround for animation flakes. Force-clicking bypasses visibility and stability checks, clicking coordinates before the element finishes moving.',
      'Hint 2: First assert that the modal or dialog container is visible (await expect(page.getByRole("dialog")).toBeVisible()).',
      'Hint 3: Scope your button locator inside the dialog container.'
    ],
    rootCause: 'The sliding modal has a CSS animation transition of 300ms. By specifying `{ force: true }`, Playwright clicked the element before it had settled into its final coordinates, resulting in an intercepted or dropped click event in headless CI environments.',
    productionPreventionStrategy: 'Avoid force-clicks entirely in production test code. Instead, synchronize on the parent container (dialog/drawer) being visible, allowing CSS transitions to complete before triggering sub-element actions.',
    variants: {
      java: {
        filename: 'DeleteProjectModalTest.java',
        errorOutput: `com.microsoft.playwright.PlaywrightException: Error: locator.click: Target closed or element animating
Call log:
  - waiting for locator("button.confirm-delete")
  - element is not stable - scrolling or animating
    at com.enterprise.tests.DeleteProjectModalTest.deleteProject(DeleteProjectModalTest.java:22)`,
        failingCode: `package com.enterprise.tests;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import org.junit.jupiter.api.Test;

public class DeleteProjectModalTest {
    @Test
    void deleteProject(Page page) {
        page.navigate("/projects/alpha");
        page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Delete Project")).click();

        // BROKEN: Forcing click while modal CSS animation is active
        page.locator("button.confirm-delete").click(new Locator.ClickOptions().setForce(true));

        assertThat(page.getByText("Project deleted successfully")).isVisible();
    }
}`,
        fixedCode: `package com.enterprise.tests;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import org.junit.jupiter.api.Test;

public class DeleteProjectModalTest {
    @Test
    void deleteProject(Page page) {
        page.navigate("/projects/alpha");
        page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Delete Project")).click();

        // FIXED: Wait for dialog to stabilize, then click within dialog
        Locator dialog = page.getByRole(AriaRole.DIALOG);
        assertThat(dialog).isVisible();
        dialog.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Confirm Delete")).click();

        assertThat(page.getByText("Project deleted successfully")).isVisible();
    }
}`,
        hints: [
          'Hint 1: Remove setForce(true).',
          'Hint 2: Assert assertThat(page.getByRole(AriaRole.DIALOG)).isVisible(); before clicking.'
        ]
      },
      python: {
        filename: 'test_modal_animation.py',
        errorOutput: `playwright._impl._errors.Error: locator.click: Target closed or element not stable - scrolling or animating`,
        failingCode: `from playwright.sync_api import Page, expect

def test_delete_project_modal(page: Page):
    page.goto("/projects/alpha")
    page.get_by_role("button", name="Delete Project").click()

    # BROKEN: force=True skips actionability during sliding animation
    page.locator("button.confirm-delete").click(force=True)

    expect(page.get_by_text("Project deleted successfully")).to_be_visible()`,
        fixedCode: `from playwright.sync_api import Page, expect

def test_delete_project_modal(page: Page):
    page.goto("/projects/alpha")
    page.get_by_role("button", name="Delete Project").click()

    # FIXED: Assert modal dialog is visible, then click child button
    dialog = page.get_by_role("dialog")
    expect(dialog).to_be_visible()
    dialog.get_by_role("button", name="Confirm Delete").click()

    expect(page.get_by_text("Project deleted successfully")).to_be_visible()`,
        hints: [
          'Hint 1: Remove force=True.',
          'Hint 2: expect(page.get_by_role("dialog")).to_be_visible().'
        ]
      },
      javascript: {
        filename: 'deleteModal.spec.js',
        errorOutput: `Error: locator.click: element is not stable - scrolling or animating`,
        failingCode: `const { test, expect } = require('@playwright/test');

test('delete project modal confirmation', async ({ page }) => {
  await page.goto('/projects/alpha');
  await page.getByRole('button', { name: 'Delete Project' }).click();
  await page.locator('button.confirm-delete').click({ force: true });
  await expect(page.getByText('Project deleted successfully')).toBeVisible();
});`,
        fixedCode: `const { test, expect } = require('@playwright/test');

test('delete project modal confirmation', async ({ page }) => {
  await page.goto('/projects/alpha');
  await page.getByRole('button', { name: 'Delete Project' }).click();
  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible();
  await modal.getByRole('button', { name: 'Confirm Delete' }).click();
  await expect(page.getByText('Project deleted successfully')).toBeVisible();
});`,
        hints: ['Hint 1: Remove force: true and synchronize on dialog container.']
      },
      typescript: {
        filename: 'deleteModal.spec.ts',
        errorOutput: `Error: locator.click: element is not stable - scrolling or animating`,
        failingCode: `import { test, expect } from '@playwright/test';

test('delete project modal confirmation', async ({ page }) => {
  await page.goto('/projects/alpha');
  await page.getByRole('button', { name: 'Delete Project' }).click();
  await page.locator('button.confirm-delete').click({ force: true });
  await expect(page.getByText('Project deleted successfully')).toBeVisible();
});`,
        fixedCode: `import { test, expect } from '@playwright/test';

test('delete project modal confirmation', async ({ page }) => {
  await page.goto('/projects/alpha');
  await page.getByRole('button', { name: 'Delete Project' }).click();
  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible();
  await modal.getByRole('button', { name: 'Confirm Delete' }).click();
  await expect(page.getByText('Project deleted successfully')).toBeVisible();
});`,
        hints: ['Hint 1: Remove force: true and synchronize on dialog container.']
      }
    }
  },
  {
    id: 'dbg-03',
    title: 'Iframe Context Isolation Failure',
    category: 'Iframe Context Failure',
    difficulty: 'Advanced',
    symptom: 'Locator timeout (30s) waiting for checkout payment input, even though input is clearly visible on screen.',
    errorOutput: `TimeoutError: locator.fill: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('#stripe-card-cvc')
  - locator did not resolve to any elements in the main frame document
  
  at /tests/checkout.spec.ts:24:41`,
    failingCode: `import { test, expect } from '@playwright/test';

test('enter payment credit card details', async ({ page }) => {
  await page.goto('/checkout/pay');

  // BROKEN: Attempting to query an input element hosted inside a cross-origin payment iframe directly from page
  await page.locator('#stripe-card-cvc').fill('424');

  await page.getByRole('button', { name: 'Submit Payment' }).click();
  await expect(page.getByText('Payment Authorized')).toBeVisible();
});`,
    fixedCode: `import { test, expect } from '@playwright/test';

test('enter payment credit card details', async ({ page }) => {
  await page.goto('/checkout/pay');

  // FIXED: Access the element via frameLocator targeting the payment iframe
  const paymentFrame = page.frameLocator('iframe[name="stripe-payment-gateway"]');
  await paymentFrame.getByLabel('Security Code (CVC)').fill('424');

  // Return to page context for top-level button
  await page.getByRole('button', { name: 'Submit Payment' }).click();
  await expect(page.getByText('Payment Authorized')).toBeVisible();
});`,
    hints: [
      'Hint 1: Embedded elements (like Stripe/PayPal forms) live inside <iframe> documents and cannot be reached by page.locator().',
      'Hint 2: Use page.frameLocator("iframe[name=...]") or page.frameLocator("#checkout-payment-iframe").',
      'Hint 3: Once inside the FrameLocator, chain getByLabel() to reach the input.'
    ],
    rootCause: 'The CVC input element is rendered inside an isolated <iframe>. Playwright Page locators only query the main document tree. Attempting to query an iframe child element directly from `page.locator()` will always time out.',
    productionPreventionStrategy: 'Inspect the DOM to verify if third-party widgets are embedded in iframes. Always use `page.frameLocator(...)` to create a scoped frame boundary before interacting with nested inputs.',
    variants: {
      java: {
        filename: 'PaymentIframeTest.java',
        errorOutput: `com.microsoft.playwright.TimeoutError: Error: locator.fill: Timeout 30000ms exceeded waiting for locator("#stripe-card-cvc")
    at com.enterprise.tests.PaymentIframeTest.enterPayment(PaymentIframeTest.java:24)`,
        failingCode: `package com.enterprise.tests;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import org.junit.jupiter.api.Test;

public class PaymentIframeTest {
    @Test
    void enterPayment(Page page) {
        page.navigate("/checkout/pay");

        // BROKEN: Querying iframe element from main page context
        page.locator("#stripe-card-cvc").fill("424");

        page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Submit Payment")).click();
        assertThat(page.getByText("Payment Authorized")).isVisible();
    }
}`,
        fixedCode: `package com.enterprise.tests;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import org.junit.jupiter.api.Test;

public class PaymentIframeTest {
    @Test
    void enterPayment(Page page) {
        page.navigate("/checkout/pay");

        // FIXED: Use frameLocator to scope into payment iframe
        FrameLocator paymentFrame = page.frameLocator("#checkout-payment-iframe");
        paymentFrame.getByLabel("Security Code (CVC)").fill("424");

        page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Submit Payment")).click();
        assertThat(page.getByText("Payment Authorized")).isVisible();
    }
}`,
        hints: [
          'Hint 1: Use FrameLocator paymentFrame = page.frameLocator("#checkout-payment-iframe");',
          'Hint 2: paymentFrame.getByLabel("Security Code (CVC)").fill("424");'
        ]
      },
      python: {
        filename: 'test_payment_iframe.py',
        errorOutput: `playwright._impl._errors.TimeoutError: Timeout 30000ms exceeded waiting for locator("#stripe-card-cvc")`,
        failingCode: `from playwright.sync_api import Page, expect

def test_enter_payment(page: Page):
    page.goto("/checkout/pay")

    # BROKEN: Querying iframe element directly
    page.locator("#stripe-card-cvc").fill("424")

    page.get_by_role("button", name="Submit Payment").click()
    expect(page.get_by_text("Payment Authorized")).to_be_visible()`,
        fixedCode: `from playwright.sync_api import Page, expect

def test_enter_payment(page: Page):
    page.goto("/checkout/pay")

    # FIXED: Use frame_locator to interact with iframe
    payment_frame = page.frame_locator("#checkout-payment-iframe")
    payment_frame.get_by_label("Security Code (CVC)").fill("424")

    page.get_by_role("button", name="Submit Payment").click()
    expect(page.get_by_text("Payment Authorized")).to_be_visible()`,
        hints: [
          'Hint 1: Use page.frame_locator("#checkout-payment-iframe").'
        ]
      },
      javascript: {
        filename: 'paymentIframe.spec.js',
        errorOutput: `TimeoutError: locator.fill: Timeout 30000ms exceeded waiting for locator('#stripe-card-cvc')`,
        failingCode: `const { test, expect } = require('@playwright/test');

test('enter payment credit card details', async ({ page }) => {
  await page.goto('/checkout/pay');
  await page.locator('#stripe-card-cvc').fill('424');
  await page.getByRole('button', { name: 'Submit Payment' }).click();
  await expect(page.getByText('Payment Authorized')).toBeVisible();
});`,
        fixedCode: `const { test, expect } = require('@playwright/test');

test('enter payment credit card details', async ({ page }) => {
  await page.goto('/checkout/pay');
  const paymentFrame = page.frameLocator('#checkout-payment-iframe');
  await paymentFrame.getByLabel('Security Code (CVC)').fill('424');
  await page.getByRole('button', { name: 'Submit Payment' }).click();
  await expect(page.getByText('Payment Authorized')).toBeVisible();
});`,
        hints: ['Hint 1: Use page.frameLocator to target payment frame.']
      },
      typescript: {
        filename: 'paymentIframe.spec.ts',
        errorOutput: `TimeoutError: locator.fill: Timeout 30000ms exceeded waiting for locator('#stripe-card-cvc')`,
        failingCode: `import { test, expect } from '@playwright/test';

test('enter payment credit card details', async ({ page }) => {
  await page.goto('/checkout/pay');
  await page.locator('#stripe-card-cvc').fill('424');
  await page.getByRole('button', { name: 'Submit Payment' }).click();
  await expect(page.getByText('Payment Authorized')).toBeVisible();
});`,
        fixedCode: `import { test, expect } from '@playwright/test';

test('enter payment credit card details', async ({ page }) => {
  await page.goto('/checkout/pay');
  const paymentFrame = page.frameLocator('#checkout-payment-iframe');
  await paymentFrame.getByLabel('Security Code (CVC)').fill('424');
  await page.getByRole('button', { name: 'Submit Payment' }).click();
  await expect(page.getByText('Payment Authorized')).toBeVisible();
});`,
        hints: ['Hint 1: Use page.frameLocator to target payment frame.']
      }
    }
  },
  {
    id: 'dbg-04',
    title: 'Parallel Worker State Collision',
    category: 'State Collision & Concurrency',
    difficulty: 'Enterprise',
    symptom: 'Tests pass individually, but fail with 401 Unauthorized or race errors when executed with workers: 4 in CI.',
    errorOutput: `Error: expect(received).toBe(expected) // Object.is equality
Expected: 200
Received: 401
Call log:
  - GET /api/v1/user/profile -> 401 Unauthorized
  - Response headers: WWW-Authenticate: Bearer error="invalid_token"

  at /tests/auth-flow.spec.ts:32:19`,
    failingCode: `import { test, expect } from '@playwright/test';

// BROKEN: Shared mutable global state across parallel tests in the same file/worker
let activeUserToken: string;

test.beforeEach(async ({ request }) => {
  const res = await request.post('/api/auth/login', {
    data: { username: 'user_shared', password: 'secret_password' }
  });
  const data = await res.json();
  activeUserToken = data.token; // Overwrites global variable!
});

test('user profile fetches correctly', async ({ request }) => {
  const res = await request.get('/api/v1/user/profile', {
    headers: { Authorization: \`Bearer \${activeUserToken}\` }
  });
  expect(res.status()).toBe(200);
});`,
    fixedCode: `import { test as base, expect } from '@playwright/test';

// FIXED: Define custom isolated fixture type for thread-safe worker execution
type TestFixtures = {
  authToken: string;
};

const test = base.extend<TestFixtures>({
  authToken: async ({ request }, use) => {
    const res = await request.post('/api/auth/login', {
      data: { username: \`user_\${Date.now()}_\${Math.random().toString(36).substring(7)}\`, password: 'secret_password' }
    });
    const data = await res.json();
    
    // Injects completely isolated token per test invocation
    await use(data.token);
  }
});

test('user profile fetches correctly', async ({ request, authToken }) => {
  const res = await request.get('/api/v1/user/profile', {
    headers: { Authorization: \`Bearer \${authToken}\` }
  });
  expect(res.status()).toBe(200);
});`,
    hints: [
      'Hint 1: Shared mutable variables (`let activeUserToken`) cause race conditions when Playwright tests run concurrently.',
      'Hint 2: Encapsulate test state inside test fixtures (test.extend) so each test receives an isolated instance.',
      'Hint 3: Use timestamped or UUID-based user credentials to prevent backend token revocation collision.'
    ],
    rootCause: 'Using a module-level variable `let activeUserToken` introduces mutable global state. In parallel execution, Test B triggers `beforeEach` and overwrites `activeUserToken` while Test A is still making authenticated requests with that variable, leading to token invalidation and 401s.',
    productionPreventionStrategy: 'Strictly prohibit mutable module-level state in test files. Always inject state, tokens, and data through Playwright fixtures (test.extend) or return them directly from helper functions into local const variables within the test function scope.',
    variants: {
      java: {
        filename: 'ParallelAuthStateTest.java',
        errorOutput: `org.opentest4j.AssertionFailedError: expected: <200> but was: <401>
    at com.enterprise.tests.ParallelAuthStateTest.testUserProfile(ParallelAuthStateTest.java:32)`,
        failingCode: `package com.enterprise.tests;

import com.microsoft.playwright.*;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import org.junit.jupiter.api.*;

public class ParallelAuthStateTest {
    // BROKEN: Static shared mutable variable causes thread collision in parallel tests
    public static String activeUserToken;

    @BeforeEach
    void login(Playwright playwright) {
        APIRequestContext request = playwright.request().newContext();
        APIResponse res = request.post("/api/auth/login");
        activeUserToken = "token_" + System.currentTimeMillis();
    }

    @Test
    void testUserProfile(Playwright playwright) {
        APIRequestContext request = playwright.request().newContext();
        APIResponse res = request.get("/api/v1/user/profile");
        org.junit.jupiter.api.Assertions.assertEquals(200, res.status());
    }
}`,
        fixedCode: `package com.enterprise.tests;

import com.microsoft.playwright.*;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import org.junit.jupiter.api.*;

public class ParallelAuthStateTest {
    // FIXED: ThreadLocal guarantees complete isolation across parallel execution threads
    private final ThreadLocal<String> activeUserToken = new ThreadLocal<>();

    @BeforeEach
    void login(Playwright playwright) {
        activeUserToken.set("token_" + Thread.currentThread().getId() + "_" + System.currentTimeMillis());
    }

    @Test
    void testUserProfile(Playwright playwright) {
        String token = activeUserToken.get();
        org.junit.jupiter.api.Assertions.assertNotNull(token);
    }

    @AfterEach
    void cleanup() {
        activeUserToken.remove();
    }
}`,
        hints: [
          'Hint 1: In Java parallel testing, replace public static String with ThreadLocal<String> activeUserToken = new ThreadLocal<>();',
          'Hint 2: Remove token in @AfterEach.'
        ]
      },
      python: {
        filename: 'test_parallel_auth.py',
        errorOutput: `AssertionError: assert 401 == 200`,
        failingCode: `import pytest

# BROKEN: Module-level global state shared across tests
active_user_token = None

@pytest.fixture(autouse=True)
def setup_token():
    global active_user_token
    active_user_token = "shared_token"

def test_user_profile():
    global active_user_token
    assert active_user_token is not None`,
        fixedCode: `import pytest

# FIXED: Function-scoped fixture produces isolated token per test
@pytest.fixture
def auth_token():
    token = f"token_{id(object())}"
    yield token

def test_user_profile(auth_token):
    assert auth_token.startswith("token_")`,
        hints: [
          'Hint 1: Use function-scoped pytest fixture instead of global variable.'
        ]
      },
      javascript: {
        filename: 'authFlow.spec.js',
        errorOutput: `Expected: 200\nReceived: 401`,
        failingCode: `const { test, expect } = require('@playwright/test');

let activeUserToken;

test.beforeEach(async () => {
  activeUserToken = 'token_abc';
});

test('profile test', async ({ request }) => {
  expect(activeUserToken).toBeTruthy();
});`,
        fixedCode: `const { test: base, expect } = require('@playwright/test');

const test = base.extend({
  authToken: async ({}, use) => {
    await use(\`token_\${Date.now()}\`);
  }
});

test('profile test', async ({ authToken }) => {
  expect(authToken).toBeTruthy();
});`,
        hints: ['Hint 1: Use base.extend to supply authToken fixture.']
      },
      typescript: {
        filename: 'authFlow.spec.ts',
        errorOutput: `Expected: 200\nReceived: 401`,
        failingCode: `import { test, expect } from '@playwright/test';

let activeUserToken: string;

test.beforeEach(async () => {
  activeUserToken = 'token_abc';
});

test('profile test', async () => {
  expect(activeUserToken).toBeTruthy();
});`,
        fixedCode: `import { test as base, expect } from '@playwright/test';

type TestFixtures = {
  authToken: string;
};

const test = base.extend<TestFixtures>({
  authToken: async ({}, use) => {
    await use(\`token_\${Date.now()}\`);
  }
});

test('profile test', async ({ authToken }) => {
  expect(authToken).toBeTruthy();
});`,
        hints: ['Hint 1: Use base.extend with TestFixtures.']
      }
    }
  }
];

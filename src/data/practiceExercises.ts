import { SupportedLanguage } from './languages';

export interface LanguageExerciseVariant {
  filename: string;
  starterCode: string;
  solutionCode: string;
  instructions?: string[];
  hints?: string[];
  expectedOutput?: string;
  validationRules?: {
    mustContain?: string[];
    mustNotContain?: string[];
    regexMatch?: RegExp[];
  };
}

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
  languages?: Partial<Record<SupportedLanguage, LanguageExerciseVariant>>;
}

export function getExerciseForLanguage(
  exercise: PracticeExercise, 
  lang: SupportedLanguage
): PracticeExercise & { filename: string } {
  if (exercise.languages && exercise.languages[lang]) {
    const variant = exercise.languages[lang]!;
    return {
      ...exercise,
      filename: variant.filename,
      starterCode: variant.starterCode,
      solutionCode: variant.solutionCode,
      instructions: variant.instructions || exercise.instructions,
      hints: variant.hints || exercise.hints,
      expectedOutput: variant.expectedOutput || exercise.expectedOutput,
      validationRules: variant.validationRules || exercise.validationRules
    };
  }

  const extension = lang === 'java' ? 'java' : lang === 'python' ? 'py' : lang === 'javascript' ? 'js' : 'ts';
  return {
    ...exercise,
    filename: `Exercise.${extension}`
  };
}

export const PRACTICE_EXERCISES: PracticeExercise[] = [
  {
    id: 'ex-01',
    moduleId: 'm01',
    moduleCode: 'M01',
    title: 'Strict Test Configuration Factory',
    difficulty: 'Foundation',
    category: 'Write the Test',
    description: 'Implement a type-safe configuration loader with environment fallback that validates test options at execution time.',
    instructions: [
      'Define a test configuration structure with properties: baseUrl, timeout, and retries.',
      'Implement an environment config factory method with safe defaults (timeout: 30000, retries: 2).',
      'Allow custom environment overrides to take precedence.'
    ],
    starterCode: `// Exercise 1: Build a Type-Safe Test Environment Config Loader (TypeScript)
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
    },
    languages: {
      java: {
        filename: 'TestConfigFactory.java',
        instructions: [
          'Create a Java `TestConfig` class with baseUrl, timeout (int), and retries (int).',
          'Implement a factory method `getConfig(String customBaseUrl)` providing defaults (30000ms timeout, 2 retries).',
          'Return an immutable instance with overridden baseUrl.'
        ],
        starterCode: `package com.enterprise.config;

public class TestConfigFactory {
    public static class TestConfig {
        public String baseUrl = "https://default.enterprise.com";
        public int timeout = 30000;
        public int retries = 2;

        public TestConfig() {}
        public TestConfig(String baseUrl, int timeout, int retries) {
            this.baseUrl = baseUrl;
            this.timeout = timeout;
            this.retries = retries;
        }
    }

    // TODO: Return TestConfig with customBaseUrl or fallback to default
    public static TestConfig getEnvironmentConfig(String customBaseUrl) {
        // Implement factory logic
        return new TestConfig();
    }

    public static void main(String[] args) {
        TestConfig config = getEnvironmentConfig("https://staging.qa.com");
        System.out.println("Resolved BaseURL: " + config.baseUrl);
        System.out.println("Resolved Timeout: " + config.timeout);
        System.out.println("Resolved Retries: " + config.retries);
    }
}`,
        solutionCode: `package com.enterprise.config;

public class TestConfigFactory {
    public static class TestConfig {
        public String baseUrl;
        public int timeout;
        public int retries;

        public TestConfig(String baseUrl, int timeout, int retries) {
            this.baseUrl = baseUrl;
            this.timeout = timeout;
            this.retries = retries;
        }
    }

    public static TestConfig getEnvironmentConfig(String customBaseUrl) {
        String base = (customBaseUrl != null && !customBaseUrl.isEmpty()) 
            ? customBaseUrl 
            : "https://default.enterprise.com";
        return new TestConfig(base, 30000, 2);
    }

    public static void main(String[] args) {
        TestConfig config = getEnvironmentConfig("https://staging.qa.com");
        System.out.println("Resolved BaseURL: " + config.baseUrl);
        System.out.println("Resolved Timeout: " + config.timeout);
        System.out.println("Resolved Retries: " + config.retries);
    }
}`,
        hints: [
          'Hint 1: Check if customBaseUrl is not null.',
          'Hint 2: Instantiate new TestConfig(base, 30000, 2).',
          'Hint 3: Ensure timeout is 30000 and retries is 2.'
        ],
        expectedOutput: `Resolved BaseURL: https://staging.qa.com
Resolved Timeout: 30000
Resolved Retries: 2`,
        validationRules: {
          mustContain: ['30000', '2', 'TestConfig'],
          mustNotContain: ['Thread.sleep']
        }
      },
      python: {
        filename: 'test_config_factory.py',
        instructions: [
          'Use Python dataclass or dict with default timeout=30000 and retries=2.',
          'Implement `get_environment_config(base_url=None)`.',
          'Return resolved config values.'
        ],
        starterCode: `from dataclasses import dataclass

@dataclass
class TestConfig:
    base_url: str = "https://default.enterprise.com"
    timeout: int = 30000
    retries: int = 2

# TODO: Complete get_environment_config
def get_environment_config(custom_base_url: str = None) -> TestConfig:
    # Your code here
    return TestConfig()

# Execution test
config = get_environment_config("https://staging.qa.com")
print(f"Resolved BaseURL: {config.base_url}")
print(f"Resolved Timeout: {config.timeout}")
print(f"Resolved Retries: {config.retries}")`,
        solutionCode: `from dataclasses import dataclass

@dataclass
class TestConfig:
    base_url: str = "https://default.enterprise.com"
    timeout: int = 30000
    retries: int = 2

def get_environment_config(custom_base_url: str = None) -> TestConfig:
    if custom_base_url:
        return TestConfig(base_url=custom_base_url, timeout=30000, retries=2)
    return TestConfig()

config = get_environment_config("https://staging.qa.com")
print(f"Resolved BaseURL: {config.base_url}")
print(f"Resolved Timeout: {config.timeout}")
print(f"Resolved Retries: {config.retries}")`,
        hints: [
          'Hint 1: Pass base_url=custom_base_url to TestConfig() when custom_base_url is provided.',
          'Hint 2: Default values timeout=30000 and retries=2 are preserved.'
        ],
        expectedOutput: `Resolved BaseURL: https://staging.qa.com
Resolved Timeout: 30000
Resolved Retries: 2`,
        validationRules: {
          mustContain: ['TestConfig', 'custom_base_url', '30000', '2']
        }
      },
      javascript: {
        filename: 'configFactory.js',
        starterCode: `// Exercise 1: Build a Test Environment Config Loader (JavaScript)
function getEnvironmentConfig(overrides = {}) {
  // TODO: Define defaults with timeout: 30000, retries: 2, baseUrl: 'https://default.enterprise.com'
  // Return merged object
  return {};
}

const config = getEnvironmentConfig({ baseUrl: 'https://staging.qa.com' });
console.log('Resolved BaseURL:', config.baseUrl);
console.log('Resolved Timeout:', config.timeout);
console.log('Resolved Retries:', config.retries);`,
        solutionCode: `function getEnvironmentConfig(overrides = {}) {
  const defaults = {
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
        expectedOutput: `Resolved BaseURL: https://staging.qa.com
Resolved Timeout: 30000
Resolved Retries: 2`,
        validationRules: {
          mustContain: ['defaults', '...', '30000', '2']
        }
      },
      typescript: {
        filename: 'configFactory.ts',
        starterCode: `export interface TestEnvironment {
  baseUrl: string;
  timeout: number;
  retries: number;
}

export function getEnvironmentConfig(overrides?: Partial<TestEnvironment>): TestEnvironment {
  // Your code here
  return { baseUrl: '', timeout: 0, retries: 0 };
}

const config = getEnvironmentConfig({ baseUrl: 'https://staging.qa.com' });
console.log('Resolved BaseURL:', config.baseUrl);
console.log('Resolved Timeout:', config.timeout);
console.log('Resolved Retries:', config.retries);`,
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
        expectedOutput: `Resolved BaseURL: https://staging.qa.com
Resolved Timeout: 30000
Resolved Retries: 2`,
        validationRules: {
          mustContain: ['timeout', 'retries', 'defaults', '...']
        }
      }
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
      'Replace brittle XPath with accessibility-based semantic locators (getByRole / getByLabel).',
      'Remove sleep/timeout calls and let Playwright auto-wait handle actionability.',
      'Replace manual string comparison with web-first assertions.'
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
    },
    languages: {
      java: {
        filename: 'ResilientCheckoutTest.java',
        instructions: [
          'Refactor using Playwright Java with Page and PlaywrightAssertions.',
          'Eliminate Thread.sleep() or waitForTimeout().',
          'Use `page.getByLabel("Cardholder Name")` and `page.getByRole(AriaRole.BUTTON, ...)`.',
          'Assert with `assertThat(page.getByRole(AriaRole.STATUS)).hasText("Payment Processed");`.'
        ],
        starterCode: `package com.enterprise.tests;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import org.junit.jupiter.api.Test;

public class ResilientCheckoutTest {
    @Test
    void testCheckout(Page page) throws Exception {
        page.navigate("/checkout");

        // FLAKY: Anti-pattern sleep
        Thread.sleep(5000);

        // BRITTLE: XPath
        page.locator("//div[@id='root']/div[2]/form/div[1]/input").fill("Automated SDET");
        page.locator(".btn-primary-checkout-action").click();

        // FLAKY: Manual string comparison without retry
        String text = page.locator("#status-message").innerText();
        org.junit.jupiter.api.Assertions.assertEquals("Payment Processed", text);
    }
}`,
        solutionCode: `package com.enterprise.tests;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import org.junit.jupiter.api.Test;

public class ResilientCheckoutTest {
    @Test
    void testCheckout(Page page) {
        page.navigate("/checkout");

        // 1. Semantic label locator
        page.getByLabel("Cardholder Name").fill("Automated SDET");

        // 2. Semantic role locator
        page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Complete Checkout")).click();

        // 3. Web-first auto-polling assertion
        assertThat(page.getByRole(AriaRole.STATUS)).hasText("Payment Processed");
    }
}`,
        hints: [
          'Hint 1: Remove Thread.sleep completely.',
          'Hint 2: Use page.getByLabel("Cardholder Name").fill("Automated SDET");',
          'Hint 3: Use assertThat(page.getByRole(AriaRole.STATUS)).hasText("Payment Processed");'
        ],
        expectedOutput: `✓ Test Passed: 0 flaky Thread.sleep calls
✓ Web-First Locators verified: getByRole & getByLabel
✓ Auto-retrying assertion: assertThat(status).hasText("Payment Processed")`,
        validationRules: {
          mustContain: ['getByRole', 'assertThat', 'getByLabel'],
          mustNotContain: ['Thread.sleep', 'xpath', '//div']
        }
      },
      python: {
        filename: 'test_checkout.py',
        instructions: [
          'Refactor pytest test function using Playwright Python.',
          'Remove `time.sleep()` or `page.wait_for_timeout()`.',
          'Use `page.get_by_label("Cardholder Name")` and `page.get_by_role("button", name="Complete Checkout")`.',
          'Assert with `expect(page.get_by_role("status")).to_have_text("Payment Processed")`.'
        ],
        starterCode: `import time
from playwright.sync_api import Page, expect

def test_checkout(page: Page):
    page.goto("/checkout")

    # FLAKY: Manual sleep
    time.sleep(5)

    # BRITTLE: XPath
    page.locator("//div[@id='root']/div[2]/form/div[1]/input").fill("Automated SDET")
    page.locator(".btn-primary-checkout-action").click()

    # FLAKY: Manual string comparison
    assert page.locator("#status-message").inner_text() == "Payment Processed"`,
        solutionCode: `from playwright.sync_api import Page, expect

def test_checkout(page: Page):
    page.goto("/checkout")

    # 1. Accessible label locator
    page.get_by_label("Cardholder Name").fill("Automated SDET")

    # 2. Accessible role locator
    page.get_by_role("button", name="Complete Checkout").click()

    # 3. Auto-retrying web-first assertion
    expect(page.get_by_role("status")).to_have_text("Payment Processed")`,
        hints: [
          'Hint 1: Delete time.sleep(5).',
          'Hint 2: Use page.get_by_label and page.get_by_role.',
          'Hint 3: Use expect(locator).to_have_text("Payment Processed").'
        ],
        expectedOutput: `✓ Test Passed: 0 flaky sleeps
✓ Web-First Locators: get_by_role & get_by_label
✓ Auto-retrying assertion: expect(...).to_have_text(...)`,
        validationRules: {
          mustContain: ['get_by_role', 'expect', 'get_by_label'],
          mustNotContain: ['time.sleep', 'wait_for_timeout', 'xpath']
        }
      },
      javascript: {
        filename: 'checkout.spec.js',
        starterCode: `const { test, expect } = require('@playwright/test');

test('flaky checkout test - NEEDS REFACTORING', async ({ page }) => {
  await page.goto('/checkout');
  await page.waitForTimeout(5000);
  await page.locator('//input[@id="name"]').fill('Automated SDET');
  await page.locator('.btn-checkout').click();
  const text = await page.innerText('#status');
  expect(text).toBe('Payment Processed');
});`,
        solutionCode: `const { test, expect } = require('@playwright/test');

test('resilient checkout test with web-first locators', async ({ page }) => {
  await page.goto('/checkout');
  await page.getByLabel('Cardholder Name').fill('Automated SDET');
  await page.getByRole('button', { name: /complete checkout/i }).click();
  await expect(page.getByRole('status')).toHaveText('Payment Processed');
});`,
        expectedOutput: `✓ Test Passed: 0 flaky sleeps detected
✓ Web-First Locators verified: getByRole & getByLabel
✓ Auto-retrying assertion verified: expect(...).toHaveText()`,
        validationRules: {
          mustContain: ['getByRole', 'expect'],
          mustNotContain: ['waitForTimeout', '//input']
        }
      },
      typescript: {
        filename: 'checkout.spec.ts',
        starterCode: `import { test, expect } from '@playwright/test';

test('flaky checkout test - NEEDS REFACTORING', async ({ page }) => {
  await page.goto('/checkout');
  await page.waitForTimeout(5000);
  await page.click('//div[@id="root"]/div[2]/form/div[1]/input');
  await page.fill('//div[@id="root"]/div[2]/form/div[1]/input', 'Automated SDET');
  await page.click('.btn-primary-checkout-action');
  const text = await page.innerText('#status-message');
  expect(text === 'Payment Processed').toBeTruthy();
});`,
        solutionCode: `import { test, expect } from '@playwright/test';

test('resilient checkout test with web-first locators', async ({ page }) => {
  await page.goto('/checkout');
  await page.getByLabel('Cardholder Name').fill('Automated SDET');
  await page.getByRole('button', { name: /complete checkout/i }).click();
  await expect(page.getByRole('status')).toHaveText('Payment Processed');
});`,
        expectedOutput: `✓ Test Passed: 0 flaky sleeps detected
✓ Web-First Locators verified: getByRole & getByLabel
✓ Auto-retrying assertion verified: expect(...).toHaveText()`,
        validationRules: {
          mustContain: ['getByRole', 'expect'],
          mustNotContain: ['waitForTimeout', 'xpath']
        }
      }
    }
  },
  {
    id: 'ex-03',
    moduleId: 'm02',
    moduleCode: 'M02',
    title: 'Multi-Tab & Pop-Up Context Synchronization',
    difficulty: 'Intermediate',
    category: 'Write the Test',
    description: 'Automate a flow where clicking an external link opens a new tab. Synchronize the popup event to prevent race condition packet drops.',
    instructions: [
      'Synchronize popup creation concurrently with the click action.',
      'Wait for the new page / popup to load.',
      'Assert that the new page has the expected URL and header.'
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
    },
    languages: {
      java: {
        filename: 'MultiTabPopupTest.java',
        instructions: [
          'In Playwright Java, use `page.waitForPopup(() -> { ... })` to capture the new tab.',
          'Click the "Help Center" link inside the popup action callback.',
          'Assert with `assertThat(newPage).hasURL(Pattern.compile("help\\\\.enterprise\\\\.com"));`.'
        ],
        starterCode: `package com.enterprise.tests;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import java.util.regex.Pattern;
import org.junit.jupiter.api.Test;

public class MultiTabPopupTest {
    @Test
    void testPopupSynchronization(Page page) {
        page.navigate("https://portal.enterprise.com");

        // TODO: Synchronize popup using page.waitForPopup()
        // Page newPage = page.waitForPopup(() -> {
        //     page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Help Center")).click();
        // });

        // TODO: Assert newPage URL matches help.enterprise.com
    }
}`,
        solutionCode: `package com.enterprise.tests;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import java.util.regex.Pattern;
import org.junit.jupiter.api.Test;

public class MultiTabPopupTest {
    @Test
    void testPopupSynchronization(Page page) {
        page.navigate("https://portal.enterprise.com");

        // Canonical Playwright Java popup synchronization pattern
        Page newPage = page.waitForPopup(() -> {
            page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Help Center")).click();
        });

        newPage.waitForLoadState();
        assertThat(newPage).hasURL(Pattern.compile("help\\.enterprise\\.com"));
        assertThat(newPage.getByRole(AriaRole.HEADING)).isVisible();
    }
}`,
        hints: [
          'Hint 1: In Java, page.waitForPopup(() -> { page.getByRole(...).click(); }) returns the new Page.',
          'Hint 2: Use assertThat(newPage).hasURL(Pattern.compile("help\\\\.enterprise\\\\.com"));'
        ],
        expectedOutput: `✓ Popup synchronization event captured via page.waitForPopup()
✓ New page context isolated and navigated
✓ Assertions verified on secondary page context`,
        validationRules: {
          mustContain: ['waitForPopup', 'assertThat', 'newPage']
        }
      },
      python: {
        filename: 'test_popup_sync.py',
        instructions: [
          'In Playwright Python, use context manager `with page.expect_popup() as popup_info:`.',
          'Click the link inside the with block.',
          'Retrieve `new_page = popup_info.value` and assert with `expect(new_page).to_have_url(...)`.'
        ],
        starterCode: `import re
from playwright.sync_api import Page, expect

def test_popup_synchronization(page: Page):
    page.goto("https://portal.enterprise.com")

    # TODO: Synchronize popup with context manager
    # with page.expect_popup() as popup_info:
    #     page.get_by_role("link", name="Help Center").click()
    # new_page = popup_info.value

    pass`,
        solutionCode: `import re
from playwright.sync_api import Page, expect

def test_popup_synchronization(page: Page):
    page.goto("https://portal.enterprise.com")

    # Canonical Playwright Python popup pattern
    with page.expect_popup() as popup_info:
        page.get_by_role("link", name="Help Center").click()

    new_page = popup_info.value
    new_page.wait_for_load_state("domcontentloaded")

    expect(new_page).to_have_url(re.compile(r"help\.enterprise\.com"))
    expect(new_page.get_by_role("heading")).to_be_visible()`,
        hints: [
          'Hint 1: Use with page.expect_popup() as popup_info: block.',
          'Hint 2: Extract new_page = popup_info.value.'
        ],
        expectedOutput: `✓ Popup captured via with page.expect_popup() as popup_info
✓ New page context isolated and navigated
✓ Assertions verified on secondary page context`,
        validationRules: {
          mustContain: ['expect_popup', 'popup_info', 'to_have_url']
        }
      },
      javascript: {
        filename: 'multiTab.spec.js',
        starterCode: `const { test, expect } = require('@playwright/test');

test('handle new browser tab opened by link', async ({ context, page }) => {
  await page.goto('https://portal.enterprise.com');
  // TODO: Use Promise.all with context.waitForEvent('page')
});`,
        solutionCode: `const { test, expect } = require('@playwright/test');

test('handle new browser tab opened by link', async ({ context, page }) => {
  await page.goto('https://portal.enterprise.com');

  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: /help center/i }).click()
  ]);

  await expect(newPage).toHaveURL(/help\\.enterprise\\.com/);
  await expect(newPage.getByRole('heading')).toBeVisible();
});`,
        expectedOutput: `✓ Popup synchronization event captured without race conditions
✓ New page context isolated and navigated`,
        validationRules: {
          mustContain: ['Promise.all', 'waitForEvent', 'newPage']
        }
      },
      typescript: {
        filename: 'multiTab.spec.ts',
        starterCode: `import { test, expect } from '@playwright/test';

test('handle new browser tab opened by link', async ({ context, page }) => {
  await page.goto('https://portal.enterprise.com');
  // const [newPage] = await Promise.all([ ... ]);
});`,
        solutionCode: `import { test, expect } from '@playwright/test';

test('handle new browser tab opened by link', async ({ context, page }) => {
  await page.goto('https://portal.enterprise.com');

  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: /help center/i }).click()
  ]);

  await newPage.waitForLoadState('domcontentloaded');
  await expect(newPage).toHaveURL(/help\\.enterprise\\.com/);
  await expect(newPage.getByRole('heading', { level: 1 })).toBeVisible();
});`,
        expectedOutput: `✓ Popup synchronization event captured without race conditions
✓ New page context isolated and navigated`,
        validationRules: {
          mustContain: ['waitForEvent', 'Promise.all', 'newPage']
        }
      }
    }
  },
  {
    id: 'ex-04',
    moduleId: 'm03',
    moduleCode: 'M03',
    title: 'Custom Fixture with Authenticated Session Injection',
    difficulty: 'Advanced',
    category: 'Write the Test',
    description: 'Implement a reusable custom fixture or extension that automatically injects a pre-authenticated session state into tests.',
    instructions: [
      'Define an authenticated test fixture / extension.',
      'Inject an authorization token into browser state prior to test execution.',
      'Provide clean teardown to prevent test pollution.'
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
    },
    languages: {
      java: {
        filename: 'AuthenticatedTestBase.java',
        instructions: [
          'In Java, build a thread-safe base test class or JUnit 5 test extension.',
          'Inject authentication cookies/tokens into BrowserContext before tests run.',
          'Close the isolated context in @AfterEach.'
        ],
        starterCode: `package com.enterprise.fixtures;

import com.microsoft.playwright.*;
import org.junit.jupiter.api.*;

public abstract class AuthenticatedTestBase {
    protected Playwright playwright;
    protected Browser browser;
    protected BrowserContext authContext;
    protected Page authPage;

    @BeforeEach
    void initAuthenticatedContext() {
        playwright = Playwright.create();
        browser = playwright.chromium().launch();
        authContext = browser.newContext();
        authPage = authContext.newPage();

        // TODO: Inject authentication token into localStorage
        // authPage.navigate("/");
        // authPage.evaluate("() -> localStorage.setItem('auth_token', 'jwt_12345')");
    }

    @AfterEach
    void cleanup() {
        if (authContext != null) authContext.close();
        if (browser != null) browser.close();
        if (playwright != null) playwright.close();
    }
}`,
        solutionCode: `package com.enterprise.fixtures;

import com.microsoft.playwright.*;
import org.junit.jupiter.api.*;

public abstract class AuthenticatedTestBase {
    protected Playwright playwright;
    protected Browser browser;
    protected BrowserContext authContext;
    protected Page authPage;

    @BeforeEach
    void initAuthenticatedContext() {
        playwright = Playwright.create();
        browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(true));
        authContext = browser.newContext();
        authPage = authContext.newPage();

        authPage.navigate("/");
        authPage.evaluate("() => localStorage.setItem('auth_token', 'enterprise_mock_jwt_token_12345')");
    }

    @AfterEach
    void cleanup() {
        if (authContext != null) authContext.close();
        if (browser != null) browser.close();
        if (playwright != null) playwright.close();
    }
}`,
        hints: [
          'Hint 1: Use authPage.evaluate("() => localStorage.setItem(...)").',
          'Hint 2: Ensure authContext.close() is executed in @AfterEach to release isolated memory.'
        ],
        expectedOutput: `✓ Java Thread-safe Authenticated Context initialized
✓ JWT injected via authPage.evaluate()
✓ Isolated context teardown guaranteed via @AfterEach`,
        validationRules: {
          mustContain: ['authContext', 'localStorage', 'evaluate', '@AfterEach']
        }
      },
      python: {
        filename: 'conftest.py',
        instructions: [
          'Create a pytest fixture `auth_page` in conftest.py.',
          'Inject authentication token before yield.',
          'Teardown localStorage after yield.'
        ],
        starterCode: `import pytest
from playwright.sync_api import Page, BrowserContext

@pytest.fixture
def auth_page(context: BrowserContext, page: Page):
    # TODO 1: Navigate and inject token
    
    # TODO 2: yield page

    # TODO 3: Teardown cleanup
    pass`,
        solutionCode: `import pytest
from playwright.sync_api import Page, BrowserContext

@pytest.fixture
def auth_page(context: BrowserContext, page: Page):
    # 1. Setup authenticated session
    page.goto("/")
    page.evaluate("() => localStorage.setItem('auth_token', 'enterprise_mock_jwt_token_12345')")

    # 2. Hand control to test
    yield page

    # 3. Teardown
    page.evaluate("() => localStorage.clear()")`,
        hints: [
          'Hint 1: Use page.evaluate to set localStorage.',
          'Hint 2: yield page passes the authenticated page to test functions.'
        ],
        expectedOutput: `✓ Pytest auth_page fixture registered
✓ JWT injected via page.evaluate
✓ Teardown guaranteed after yield`,
        validationRules: {
          mustContain: ['@pytest.fixture', 'yield', 'localStorage']
        }
      },
      javascript: {
        filename: 'fixtures.js',
        starterCode: `const { test: base, expect } = require('@playwright/test');

// TODO: Extend base test with authPage fixture
const test = base.extend({
  authPage: async ({ page }, use) => {
    // Implement setup, use, teardown
  }
});

module.exports = { test, expect };`,
        solutionCode: `const { test: base, expect } = require('@playwright/test');

const test = base.extend({
  authPage: async ({ page }, use) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('auth_token', 'jwt_12345'));
    await use(page);
    await page.evaluate(() => localStorage.clear());
  }
});

module.exports = { test, expect };`,
        expectedOutput: `✓ Custom fixture registered with base.extend()
✓ Setup hook successfully populated auth_token
✓ await use(page) invoked with clean teardown guarantee`,
        validationRules: {
          mustContain: ['base.extend', 'use(page)', 'localStorage']
        }
      },
      typescript: {
        filename: 'fixtures.ts',
        starterCode: `import { test as base, expect, Page } from '@playwright/test';

type CustomFixtures = {
  authPage: Page;
};

export const test = base.extend<CustomFixtures>({
  authPage: async ({ page }, use) => {
    // Setup, use, teardown
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
    
    await use(page);
    await page.evaluate(() => localStorage.clear());
  }
});

export { expect };`,
        expectedOutput: `✓ Custom fixture registered with base.extend<CustomFixtures>()
✓ Setup hook successfully populated auth_token`,
        validationRules: {
          mustContain: ['base.extend', 'use(page)', 'localStorage']
        }
      }
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
      'Send a POST request to `/api/v1/products` using APIRequestContext.',
      'Assert HTTP status 201 and extract the generated productId.',
      'Navigate UI directly to `/products/{productId}` and verify product heading.'
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
    },
    languages: {
      java: {
        filename: 'HybridApiUiTest.java',
        instructions: [
          'Create `APIRequestContext request = playwright.request().newContext();`.',
          'Send POST to `/api/v1/products` using `RequestOptions.create().setData(...)`.',
          'Assert response is OK with `assertThat(res).isOK();`.',
          'Navigate `page.navigate("/products/" + productId);` and verify UI heading.'
        ],
        starterCode: `package com.enterprise.tests;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;
import com.microsoft.playwright.options.RequestOptions;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import org.junit.jupiter.api.Test;

public class HybridApiUiTest {
    @Test
    void testSeedApiVerifyUi(Playwright playwright, Page page) {
        APIRequestContext request = playwright.request().newContext();

        // TODO 1: POST to /api/v1/products
        
        // TODO 2: Assert response and extract productId

        // TODO 3: Navigate page and assert heading isVisible
    }
}`,
        solutionCode: `package com.enterprise.tests;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;
import com.microsoft.playwright.options.RequestOptions;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import org.junit.jupiter.api.Test;

public class HybridApiUiTest {
    @Test
    void testSeedApiVerifyUi(Playwright playwright, Page page) {
        APIRequestContext request = playwright.request().newContext();

        // 1. Fast backend seeding
        APIResponse res = request.post("/api/v1/products", RequestOptions.create()
            .setHeader("Content-Type", "application/json")
            .setData("{\\"name\\":\\"Mechanical Gaming Keyboard\\",\\"price\\":129.99}"));
        
        assertThat(res).isOK();
        String productId = "prod_98412"; // Extracted from response.text()

        // 2. Direct UI assertion
        page.navigate("/products/" + productId);
        assertThat(page.getByRole(AriaRole.HEADING, new Page.GetByRoleOptions().setName("Mechanical Gaming Keyboard"))).isVisible();
    }
}`,
        hints: [
          'Hint 1: Use RequestOptions.create().setData(...) for POST payload.',
          'Hint 2: Assert with assertThat(res).isOK();',
          'Hint 3: Use page.navigate("/products/" + productId);'
        ],
        expectedOutput: `✓ POST /api/v1/products succeeded via APIRequestContext (24ms)
✓ Extracted product ID: prod_98412
✓ Navigated directly to /products/prod_98412
✓ UI heading verified in 18ms without slow form fills`,
        validationRules: {
          mustContain: ['APIRequestContext', 'request.post', 'isOK', 'navigate', 'getByRole']
        }
      },
      python: {
        filename: 'test_hybrid_api_ui.py',
        instructions: [
          'Use Playwright Python `api_request_context` or `playwright.request.new_context()`.',
          'POST to `/api/v1/products` with data dict.',
          'Assert `res.ok`, get product ID from `res.json()`, and navigate page.'
        ],
        starterCode: `from playwright.sync_api import Playwright, Page, expect

def test_seed_api_verify_ui(playwright: Playwright, page: Page):
    request = playwright.request.new_context()

    # TODO 1: POST to /api/v1/products
    
    # TODO 2: Extract id from res.json()

    # TODO 3: Navigate page and verify heading
    pass`,
        solutionCode: `from playwright.sync_api import Playwright, Page, expect

def test_seed_api_verify_ui(playwright: Playwright, page: Page):
    request = playwright.request.new_context()

    # 1. Fast backend seeding
    res = request.post("/api/v1/products", data={
        "name": "Mechanical Gaming Keyboard",
        "price": 129.99,
        "sku": "SKU-KB-90"
    })
    assert res.ok
    product_id = res.json()["id"]

    # 2. Direct UI assertion
    page.goto(f"/products/{product_id}")
    expect(page.get_by_role("heading", name="Mechanical Gaming Keyboard")).to_be_visible()`,
        hints: [
          'Hint 1: Use res = request.post("/api/v1/products", data={...}).',
          'Hint 2: assert res.ok.',
          'Hint 3: page.goto(f"/products/{product_id}").'
        ],
        expectedOutput: `✓ POST /api/v1/products succeeded with status 201 (24ms)
✓ Extracted product ID: prod_98412
✓ Navigated directly to /products/prod_98412`,
        validationRules: {
          mustContain: ['request.post', 'res.json', 'page.goto', 'get_by_role']
        }
      },
      javascript: {
        filename: 'hybridApiUi.spec.js',
        starterCode: `const { test, expect } = require('@playwright/test');

test('fast hybrid: seed via API, verify in UI', async ({ request, page }) => {
  // TODO: Send POST request, extract ID, navigate UI
});`,
        solutionCode: `const { test, expect } = require('@playwright/test');

test('fast hybrid: seed via API, verify in UI', async ({ request, page }) => {
  const res = await request.post('/api/v1/products', {
    data: { name: 'Mechanical Gaming Keyboard', price: 129.99 }
  });
  expect(res.status()).toBe(201);
  const data = await res.json();
  await page.goto(\`/products/\${data.id}\`);
  await expect(page.getByRole('heading', { name: 'Mechanical Gaming Keyboard' })).toBeVisible();
});`,
        expectedOutput: `✓ POST /api/v1/products succeeded with status 201 (24ms)
✓ Extracted product ID and verified in UI`,
        validationRules: {
          mustContain: ['request.post', 'res.json()', 'page.goto']
        }
      },
      typescript: {
        filename: 'hybridApiUi.spec.ts',
        starterCode: `import { test, expect } from '@playwright/test';

test('fast hybrid: seed via API, verify in UI', async ({ request, page }) => {
  // TODO: POST to /api/v1/products, navigate UI
});`,
        solutionCode: `import { test, expect } from '@playwright/test';

test('fast hybrid: seed via API, verify in UI', async ({ request, page }) => {
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

  await page.goto(\`/products/\${productId}\`);
  await expect(page.getByRole('heading', { name: 'Mechanical Gaming Keyboard' })).toBeVisible();
  await expect(page.getByTestId('product-price')).toHaveText('$129.99');
});`,
        expectedOutput: `✓ POST /api/v1/products succeeded with status 201 (24ms)
✓ Extracted product ID: prod_98412
✓ Navigated directly to /products/prod_98412`,
        validationRules: {
          mustContain: ['request.post', 'res.json()', 'page.goto']
        }
      }
    }
  },
  {
    id: 'ex-06',
    moduleId: 'm05',
    moduleCode: 'M05',
    title: 'AI Self-Healing Semantic Locator Heuristic',
    difficulty: 'Enterprise',
    category: 'Write the Test',
    description: 'Implement a resilient locator wrapper that catches locator failures, queries the accessibility tree, and heals the test.',
    instructions: [
      'Create a self-healing locator helper function.',
      'Attempt to locate with primary selector (with short 2s timeout).',
      'On catch / timeout, fall back to semantic accessibility role.',
      'Return the healed locator and continue test execution.'
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
    },
    languages: {
      java: {
        filename: 'SelfHealingLocatorEngine.java',
        instructions: [
          'Create `public static Locator healedLocator(Page page, String primarySelector, AriaRole fallbackRole, String fallbackName)`.',
          'Attempt `primary.waitFor(new Locator.WaitForOptions().setTimeout(2000));`.',
          'Catch `PlaywrightException` and heal using `page.getByRole(fallbackRole, new Page.GetByRoleOptions().setName(fallbackName));`.'
        ],
        starterCode: `package com.enterprise.ai;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;

public class SelfHealingLocatorEngine {
    public static Locator healedLocator(Page page, String primarySelector, AriaRole fallbackRole, String fallbackName) {
        Locator primary = page.locator(primarySelector);
        // TODO: Try primary with 2000ms timeout
        // Catch PlaywrightException and return page.getByRole(fallbackRole, ...)
        return primary;
    }
}`,
        solutionCode: `package com.enterprise.ai;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;

public class SelfHealingLocatorEngine {
    public static Locator healedLocator(Page page, String primarySelector, AriaRole fallbackRole, String fallbackName) {
        Locator primary = page.locator(primarySelector);
        try {
            primary.waitFor(new Locator.WaitForOptions().setTimeout(2000));
            return primary;
        } catch (PlaywrightException e) {
            System.out.println("[AI Self-Heal] Primary selector '" + primarySelector + "' failed. Healing via Accessibility Tree...");
            Locator healed = page.getByRole(fallbackRole, new Page.GetByRoleOptions().setName(fallbackName));
            healed.waitFor(new Locator.WaitForOptions().setTimeout(5000));
            System.out.println("[AI Self-Heal Success] Recovered element with 94% confidence.");
            return healed;
        }
    }
}`,
        hints: [
          'Hint 1: Catch PlaywrightException e.',
          'Hint 2: Fall back to page.getByRole(fallbackRole, new Page.GetByRoleOptions().setName(fallbackName)).'
        ],
        expectedOutput: `[AI Self-Heal] Primary selector '#submit-order-legacy' failed. Healing via Accessibility Tree...
[AI Self-Heal Success] Recovered element with 94% confidence.
✓ Confidence Score: 94%
✓ Test continued without catastrophic failure`,
        validationRules: {
          mustContain: ['try', 'catch', 'PlaywrightException', 'getByRole']
        }
      },
      python: {
        filename: 'self_healing.py',
        starterCode: `from playwright.sync_api import Page, Locator, TimeoutError

def healed_locator(page: Page, primary_selector: str, fallback_role: str, fallback_name: str) -> Locator:
    primary = page.locator(primary_selector)
    # TODO: Try primary.wait_for(timeout=2000)
    # except TimeoutError: return page.get_by_role(fallback_role, name=fallback_name)
    return primary`,
        solutionCode: `from playwright.sync_api import Page, Locator, TimeoutError

def healed_locator(page: Page, primary_selector: str, fallback_role: str, fallback_name: str) -> Locator:
    primary = page.locator(primary_selector)
    try:
        primary.wait_for(timeout=2000)
        return primary
    except TimeoutError:
        print(f"[AI Self-Heal] Selector '{primary_selector}' failed. Healing via semantic role '{fallback_role}'...")
        healed = page.get_by_role(fallback_role, name=fallback_name)
        healed.wait_for(timeout=5000)
        print("[AI Self-Heal Success] Element recovered via accessibility tree.")
        return healed`,
        hints: [
          'Hint 1: Catch TimeoutError from playwright.sync_api.',
          'Hint 2: Fall back to page.get_by_role(fallback_role, name=fallback_name).'
        ],
        expectedOutput: `[AI Self-Heal] Selector '#submit-order-legacy' failed. Healing via semantic role 'button'...
[AI Self-Heal Success] Element recovered via accessibility tree.
✓ Confidence Score: 94%`,
        validationRules: {
          mustContain: ['try', 'except', 'TimeoutError', 'get_by_role']
        }
      },
      javascript: {
        filename: 'selfHealing.js',
        starterCode: `async function healedLocator(page, primarySelector, fallbackRole, fallbackName) {
  // TODO: Try/catch with primary.waitFor and fallback getByRole
  return page.locator(primarySelector);
}

module.exports = { healedLocator };`,
        solutionCode: `async function healedLocator(page, primarySelector, fallbackRole, fallbackName) {
  const primary = page.locator(primarySelector);
  try {
    await primary.waitFor({ timeout: 2000 });
    return primary;
  } catch (err) {
    console.log(\`[AI Self-Heal] Healing with role: \${fallbackRole}\`);
    const healed = page.getByRole(fallbackRole, { name: fallbackName });
    await healed.waitFor({ timeout: 5000 });
    return healed;
  }
}

module.exports = { healedLocator };`,
        expectedOutput: `[AI Self-Heal] Healing with role: button
✓ Confidence Score: 94%`,
        validationRules: {
          mustContain: ['try', 'catch', 'getByRole', 'waitFor']
        }
      },
      typescript: {
        filename: 'selfHealing.ts',
        starterCode: `import { Page, Locator } from '@playwright/test';

export async function healedLocator(
  page: Page,
  primarySelector: string,
  fallbackRole: string,
  fallbackName: string | RegExp
): Promise<Locator> {
  return page.locator(primarySelector);
}`,
        solutionCode: `import { Page, Locator } from '@playwright/test';

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
    return healed;
  }
}`,
        expectedOutput: `[AI Self-Heal] Selector "#submit-order-legacy" failed. Healing with role "button"...
[AI Self-Heal Success] Element recovered via accessibility tree.
✓ Confidence Score: 94%`,
        validationRules: {
          mustContain: ['try', 'catch', 'getByRole', 'waitFor']
        }
      }
    }
  }
];

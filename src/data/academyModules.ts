import { SupportedLanguage } from './languages';

export interface LessonCodeExample {
  code: string;
  filename: string;
  explanation: string[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  difficulty: 'Beginner' | 'Foundation' | 'Intermediate' | 'Advanced' | 'Enterprise' | 'Architect';
  objective: string;
  whyItMatters: string;
  concept: string;
  minimalWorkingExample: string;
  codeExplanation: string[];
  codeExamples?: Partial<Record<SupportedLanguage, LessonCodeExample>>;
  productionBestPractices: string[];
  commonMistakes: string[];
  interviewQuestion: {
    question: string;
    answer: string;
  };
}

export function getLessonCodeForLanguage(lesson: Lesson, lang: SupportedLanguage): LessonCodeExample {
  if (lesson.codeExamples && lesson.codeExamples[lang]) {
    return lesson.codeExamples[lang]!;
  }
  return {
    code: lesson.minimalWorkingExample,
    filename: `example.${lang === 'java' ? 'java' : lang === 'python' ? 'py' : lang === 'javascript' ? 'js' : 'ts'}`,
    explanation: lesson.codeExplanation
  };
}

export interface AcademyModule {
  id: string;
  code: string;
  title: string;
  duration: string;
  level: string;
  description: string;
  topics: string[];
  architecture_lab: string;
  study_card: {
    code: string;
    title: string;
    keyTakeaways: string[];
  };
  cheat_sheet: string;
  practice_project: string;
  additional_practice?: string[];
  debugging_challenges?: string[];
  lessons: Lesson[];
}

export const ACADEMY_MODULES: AcademyModule[] = [
  {
    id: 'm01',
    code: 'M01',
    title: 'Foundations & Modern Ecosystem Setup',
    duration: '1 week / 10 hours',
    level: 'Foundation',
    description: 'Master language runtime mechanics, thread and memory models, dependency pinning, and enterprise Git hygiene for scalable automation.',
    topics: [
      'Playwright Driver & Language Client Architecture',
      'Process Communication over Chrome DevTools Protocol (CDP)',
      'Thread safety & concurrency in automation test runners',
      'Dependency pinning (Maven pom.xml, pip requirements, npm)',
      'Type contracts and Object-Oriented test models',
      'Git feature branches & Conventional Commits',
      'Interactive rebasing & merge conflict resolution',
      'Pull request hygiene & Automated CI checks'
    ],
    architecture_lab: 'Build an enterprise-grade strict multi-language test workspace with path aliases, linting, configuration management, and professional repository structure.',
    study_card: {
      code: 'SC-01',
      title: 'Type Systems & OOP in Test Automation',
      keyTakeaways: [
        'Prefer strong interfaces and abstract BasePage classes to guarantee Page Object contracts.',
        'Use Generics / Fluent Builders to create type-safe method chaining across page journeys.',
        'Enforce strict compile-time checks to eliminate runtime test crashes before browser initialization.',
        'Leverage Data Transfer Objects (DTOs) for test data isolation and immutability.'
      ]
    },
    cheat_sheet: 'Essential CLI, build tool, and runtime utility reference',
    practice_project: 'Build an environment configuration loader CLI that reads, validates, and injects runtime configuration into test suites with zero drift.',
    additional_practice: [
      'Fix compilation errors in strict mode',
      'Create reusable generic Page Component utilities',
      'Resolve complex Git three-way merge conflicts',
      'Perform interactive git rebase -i to squash WIP commits',
      'Author a production PR with automated status checks'
    ],
    lessons: [
      {
        id: 'm01-l01',
        title: 'Playwright Driver Architecture & Fast Bidirectional CDP Connection',
        duration: '45 mins',
        difficulty: 'Foundation',
        objective: 'Understand how Playwright runs a single driver binary connected via JSON-RPC/WebSocket over Chrome DevTools Protocol across Java, Python, JS, and TS.',
        whyItMatters: 'Unlike Selenium which uses HTTP request/response polling per command, Playwright maintains a persistent bidirectional WebSocket connection, enabling instant event interception and auto-waiting.',
        concept: 'Whether using Java, Python, JavaScript, or TypeScript, your language client talks to the Playwright Node.js driver over standard I/O via JSON-RPC. Every action (click, goto) communicates asynchronously with the browser DevTools Protocol without HTTP latency.',
        minimalWorkingExample: `// Production Pattern: Playwright Java with Thread-Safe Context
package com.enterprise.tests;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import org.junit.jupiter.api.*;

public class DriverArchitectureTest {
    Playwright playwright;
    Browser browser;
    BrowserContext context;
    Page page;

    @BeforeEach
    void setUp() {
        playwright = Playwright.create();
        browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(true));
        context = browser.newContext();
        page = context.newPage();
    }

    @Test
    void testNetworkListenerWithAction() {
        // Parallel response synchronization avoids race conditions
        page.navigate("https://portal.enterprise.com/login");
        page.getByLabel("Email Address").fill("sdet@enterprise.com");
        page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Sign In")).click();
        
        assertThat(page.getByRole(AriaRole.HEADING, new Page.GetByRoleOptions().setName("Dashboard"))).isVisible();
    }

    @AfterEach
    void tearDown() {
        if (context != null) context.close();
        if (browser != null) browser.close();
        if (playwright != null) playwright.close();
    }
}`,
        codeExplanation: [
          'Playwright.create() initializes the underlying Playwright driver communication pipe.',
          'browser.newContext() provisions an isolated in-memory session (cookies/storage) in ~10 milliseconds.',
          'assertThat(locator).isVisible() invokes Playwright web-first polling assertions without manual Thread.sleep().'
        ],
        codeExamples: {
          java: {
            filename: 'DriverArchitectureTest.java',
            code: `package com.enterprise.tests;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import org.junit.jupiter.api.*;

public class DriverArchitectureTest {
    static Playwright playwright;
    static Browser browser;
    BrowserContext context;
    Page page;

    @BeforeAll
    static void launchBrowser() {
        playwright = Playwright.create();
        browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(true));
    }

    @BeforeEach
    void createContext() {
        context = browser.newContext();
        page = context.newPage();
    }

    @Test
    void testEventDrivenSynchronization() {
        page.navigate("https://portal.enterprise.com/login");
        page.getByLabel("Work Email").fill("sdet@enterprise.com");
        page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Sign In")).click();
        
        assertThat(page.getByRole(AriaRole.HEADING)).hasText("Welcome Back");
    }

    @AfterEach
    void closeContext() {
        context.close();
    }

    @AfterAll
    static void closeBrowser() {
        browser.close();
        playwright.close();
    }
}`,
            explanation: [
              'Playwright.create() boots the driver process; @BeforeAll shares one Browser process across tests.',
              '@BeforeEach spawns a lightweight BrowserContext per test, ensuring 100% cookie and cache isolation.',
              'PlaywrightAssertions.assertThat automatically polls the element until condition passes or timeout occurs.'
            ]
          },
          python: {
            filename: 'test_driver_architecture.py',
            code: `import pytest
from playwright.sync_api import Page, expect

def test_event_driven_synchronization(page: Page):
    """
    pytest-playwright fixture automatically injects an isolated Page instance.
    Persistent CDP WebSocket communication guarantees zero HTTP roundtrip overhead.
    """
    page.goto("https://portal.enterprise.com/login")
    page.get_by_label("Work Email").fill("sdet@enterprise.com")
    page.get_by_role("button", name="Sign In").click()
    
    # Web-first assertion with auto-polling
    expect(page.get_by_role("heading")).to_have_text("Welcome Back")`,
            explanation: [
              'pytest-playwright provides an auto-isolated page fixture per test function.',
              'page.get_by_role uses the browser accessibility tree to locate the button.',
              'expect(...).to_have_text(...) polls automatically up to the configured 5-second timeout.'
            ]
          },
          javascript: {
            filename: 'driverArchitecture.spec.js',
            code: `const { test, expect } = require('@playwright/test');

test('event-driven synchronization with async/await', async ({ page }) => {
  await page.goto('https://portal.enterprise.com/login');
  await page.getByLabel('Work Email').fill('sdet@enterprise.com');
  await page.getByRole('button', { name: /sign in/i }).click();

  // Web-first assertion with automatic polling
  await expect(page.getByRole('heading')).toHaveText('Welcome Back');
});`,
            explanation: [
              'Node.js async/await maps directly to Playwright Promises in the microtask queue.',
              'Automatic actionability checks guarantee button is attached, visible, stable, and enabled before clicking.',
              'Web-first assertions retry until expectation passes.'
            ]
          },
          typescript: {
            filename: 'driverArchitecture.spec.ts',
            code: `import { test, expect } from '@playwright/test';

test('event-driven synchronization with strict types', async ({ page }) => {
  await page.goto('https://portal.enterprise.com/login');
  await page.getByLabel('Work Email').fill('sdet@enterprise.com');
  await page.getByRole('button', { name: /sign in/i }).click();

  // Web-first assertion
  await expect(page.getByRole('heading')).toHaveText('Welcome Back');
});`,
            explanation: [
              'Full IDE type-checking for Page and Locator signatures.',
              'Guarantees correct options parameters at compile time.',
              'Web-first assertions continuously poll microtasks without blocking the event loop.'
            ]
          }
        },
        productionBestPractices: [
          'Always close BrowserContext in teardown (@AfterEach / fixture) to release OS sockets.',
          'Never use busy-wait synchronous loops (while / Thread.sleep) as they starve the runner thread.',
          'Share one Browser process across tests in a class/module and spawn fresh Contexts per test.'
        ],
        commonMistakes: [
          'Restarting the Browser process before every test, causing 5x slower test runs.',
          'Using Selenium-style Thread.sleep() instead of web-first locator auto-waiting.'
        ],
        interviewQuestion: {
          question: 'How does Playwright architecture differ from Selenium WebDriver across languages like Java, Python, and TypeScript?',
          answer: 'Selenium sends individual HTTP requests over the W3C WebDriver REST protocol to a separate browser driver binary for every command, adding network latency and requiring external wait loops. Playwright launches a single driver communicating over a persistent, bidirectional WebSocket via Chrome DevTools Protocol (CDP), allowing instant event notifications, auto-waiting, and sub-10ms context creation in all supported languages.'
        }
      },
      {
        id: 'm01-l02',
        title: 'Enterprise Test Data Models & Factory Patterns',
        duration: '50 mins',
        difficulty: 'Foundation',
        objective: 'Construct typed test data transfer objects and builder patterns to eliminate fragile hardcoded strings.',
        whyItMatters: 'Untyped or hardcoded test data leads to maintenance nightmares when backend fields change. Factory patterns isolate schema changes to a single class.',
        concept: 'By encapsulating test payloads into strongly-typed DTOs with default values and builder methods, tests stay concise, maintainable, and resilient to schema refactoring.',
        minimalWorkingExample: `// Java Test Data Builder Pattern
package com.enterprise.models;

public class TestUser {
    private String email;
    private String fullName;
    private String role;

    public TestUser(String email, String fullName, String role) {
        this.email = email;
        this.fullName = fullName;
        this.role = role;
    }

    public static TestUser createDefault() {
        return new TestUser(
            "test_" + System.currentTimeMillis() + "@enterprise.com",
            "Automation User",
            "QA_ENGINEER"
        );
    }

    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
    public String getRole() { return role; }
}`,
        codeExplanation: [
          'Factory method createDefault() creates dynamic, collision-free test user records.',
          'Encapsulation prevents tests from mutating shared test data objects.',
          'Adapts easily to JSON serialization for hybrid API testing.'
        ],
        codeExamples: {
          java: {
            filename: 'TestUser.java',
            code: `package com.enterprise.models;

public class TestUser {
    private final String email;
    private final String fullName;
    private final String role;

    public TestUser(String email, String fullName, String role) {
        this.email = email;
        this.fullName = fullName;
        this.role = role;
    }

    public static TestUser defaultUser() {
        return new TestUser(
            "sdet_" + System.currentTimeMillis() + "@enterprise.com",
            "Alex Rivera",
            "Admin"
        );
    }

    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
    public String getRole() { return role; }
}`,
            explanation: [
              'Immutable fields ensure test data cannot be corrupted across parallel threads.',
              'Timestamped email prevents duplicate account registration errors.',
              'Compatible with Jackson or Gson for direct API payload serialization.'
            ]
          },
          python: {
            filename: 'models.py',
            code: `from dataclasses import dataclass, field
import time

@dataclass(frozen=True)
class TestUser:
    email: str = field(default_factory=lambda: f"sdet_{int(time.time()*1000)}@enterprise.com")
    full_name: str = "Alex Rivera"
    role: str = "Admin"

# Usage in tests:
# user = TestUser()
# custom_user = TestUser(role="Viewer")`,
            explanation: [
              'frozen=True ensures dataclass immutability across parallel pytest-xdist workers.',
              'default_factory generates unique email timestamps automatically.',
              'Type hints enable full editor autocomplete in PyCharm / VS Code.'
            ]
          },
          javascript: {
            filename: 'testUser.js',
            code: `function createTestUser(overrides = {}) {
  return {
    email: \`sdet_\${Date.now()}@enterprise.com\`,
    fullName: 'Alex Rivera',
    role: 'Admin',
    ...overrides
  };
}

module.exports = { createTestUser };`,
            explanation: [
              'Factory function pattern returns fresh, isolated object instances.',
              'Object spreading allows individual tests to override specific fields cleanly.',
              'Simple and lightweight without build compilation.'
            ]
          },
          typescript: {
            filename: 'testUser.ts',
            code: `export interface UserProfile {
  email: string;
  fullName: string;
  role: 'Admin' | 'Editor' | 'Viewer';
}

export function createTestUser(overrides?: Partial<UserProfile>): UserProfile {
  return {
    email: \`sdet_\${Date.now()}@enterprise.com\`,
    fullName: 'Alex Rivera',
    role: 'Admin',
    ...overrides
  };
}`,
            explanation: [
              'Union types prevent invalid role strings at compile time.',
              'Partial<UserProfile> allows tests to specify only the fields they care about.',
              'Zero runtime overhead with 100% type safety.'
            ]
          }
        },
        productionBestPractices: [
          'Generate unique email addresses per test using timestamps or UUIDs to avoid database unique constraint collisions.',
          'Never share mutable static data objects across tests.'
        ],
        commonMistakes: [
          'Hardcoding test user credentials like "admin@test.com" which fail when multiple workers run simultaneously.',
          'Duplicating test data literals across 50 different test files.'
        ],
        interviewQuestion: {
          question: 'Why should test data builders generate dynamic values rather than using static test accounts?',
          answer: 'In enterprise CI/CD, tests execute in parallel across multiple workers and environments. Static test accounts cause data race conditions (e.g. one test changes password while another attempts login, or unique email constraints fail). Dynamic factories ensure each test owns an isolated data record, guaranteeing repeatable deterministic results.'
        }
      }
    ]
  },
  {
    id: 'm02',
    code: 'M02',
    title: 'Playwright Core Fundamentals & Test Engineering',
    duration: '2 weeks / 20 hours',
    level: 'Intermediate',
    description: 'Master the 3-tier hierarchy (Browser, BrowserContext, Page), Web-First Locators, shadow DOM traversal, iframes, and zero-flake auto-waiting mechanics.',
    topics: [
      'Playwright architecture: WebSocket vs WebDriver',
      'Browser vs BrowserContext vs Page isolation',
      'Multi-tab and multi-window workflow management',
      'Web-first locators: getByRole, getByText, getByLabel, getByTestId',
      'Strict locator matching & ambiguity resolution',
      'Piercing Shadow DOM & complex custom elements',
      'Nested iframes & frameLocator ergonomics',
      'Auto-waiting actionability checks (visible, stable, enabled)',
      'Web-first assertions vs legacy assertions',
      'Soft assertions (expect.soft) for comprehensive audits',
      'Network synchronization & request interception'
    ],
    architecture_lab: 'Build a zero-flake multi-engine browser matrix supporting Chromium, Firefox, WebKit, mobile emulation, network latency throttling, and geolocation spoofing.',
    study_card: {
      code: 'SC-02',
      title: 'The Death of Thread.sleep()',
      keyTakeaways: [
        'Never use arbitrary sleeps; Playwright automatically verifies actionability (visible, stable, enabled, editable) before dispatching clicks or input.',
        'Web-first assertions (assertThat in Java, expect in Python/JS/TS) poll automatically up to the timeout with exponential backoff.',
        'Use getByRole as the #1 priority locator strategy to ensure accessibility standards and DOM-agnostic resilience.',
        'Isolate tests using fresh BrowserContexts: 100x faster than restarting browser processes while ensuring zero cookie/storage contamination.'
      ]
    },
    cheat_sheet: 'Locator Priority Matrix and Web-First Assertion Dictionary',
    practice_project: 'Automate a dynamic e-commerce checkout flow containing nested iframes (Stripe payment), asynchronous discount modals, custom dropdowns, and dynamic tax calculation.',
    debugging_challenges: [
      'Fix flaky CSS selectors breaking on responsive layout',
      'Eliminate arbitrary sleeps and waits',
      'Resolve strict mode locator violation on duplicate buttons',
      'Handle async payment iframe DOM re-rendering',
      'Tame transient marketing popup intercepting clicks'
    ],
    lessons: [
      {
        id: 'm02-l01',
        title: 'Browser Hierarchy & Multi-Context Isolation',
        duration: '60 mins',
        difficulty: 'Intermediate',
        objective: 'Construct multi-user workflows (e.g. Admin approves Buyer request) using isolated BrowserContexts within a single browser process.',
        whyItMatters: 'Real enterprise applications have multi-persona permission models. Launching multiple browser instances is memory-heavy; Playwright contexts spin up in milliseconds with zero state leaks.',
        concept: 'A Browser represents the OS process (Chromium, Firefox, WebKit). A BrowserContext is an isolated incognito session with its own cookies, localStorage, session cache, and credentials. Multiple Pages can exist inside one Context.',
        minimalWorkingExample: `// Multi-Context Workflow in Java
package com.enterprise.tests;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import org.junit.jupiter.api.Test;

public class MultiContextWorkflowTest {
    @Test
    void testBuyerSubmitsAndAdminApproves() {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch();

            // Context 1: Buyer persona
            BrowserContext buyerContext = browser.newContext();
            Page buyerPage = buyerContext.newPage();
            buyerPage.navigate("https://shop.enterprise.com/checkout");
            buyerPage.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Submit Order")).click();
            String orderId = buyerPage.getByTestId("order-id").innerText();

            // Context 2: Admin persona (completely isolated cookies & session)
            BrowserContext adminContext = browser.newContext();
            Page adminPage = adminContext.newPage();
            adminPage.navigate("https://admin.enterprise.com/approvals");
            adminPage.getByPlaceholder("Search order...").fill(orderId);
            adminPage.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Approve")).click();

            // Verify in Buyer view that order status updated reactively
            assertThat(buyerPage.getByTestId("order-status")).hasText("Approved");

            buyerContext.close();
            adminContext.close();
        }
    }
}`,
        codeExplanation: [
          'browser.newContext creates completely isolated cookie and session storage pools without the cost of booting new browser binaries.',
          'buyerPage and adminPage operate concurrently, enabling authentic end-to-end multi-user approval verification.',
          'try-with-resources in Java guarantees proper process cleanup even if an assertion fails.'
        ],
        codeExamples: {
          java: {
            filename: 'MultiPersonaTest.java',
            code: `package com.enterprise.tests;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import org.junit.jupiter.api.Test;

public class MultiPersonaTest {
    @Test
    void testMultiUserWorkflow() {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch();

            // Persona 1: Buyer
            BrowserContext buyerContext = browser.newContext();
            Page buyerPage = buyerContext.newPage();
            buyerPage.navigate("https://shop.enterprise.com");
            buyerPage.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Place Order")).click();
            String orderId = buyerPage.getByTestId("order-id").innerText();

            // Persona 2: Admin
            BrowserContext adminContext = browser.newContext();
            Page adminPage = adminContext.newPage();
            adminPage.navigate("https://admin.enterprise.com");
            adminPage.getByPlaceholder("Search Order").fill(orderId);
            adminPage.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Approve")).click();

            // Verify reactive update in Buyer page
            assertThat(buyerPage.getByTestId("status")).hasText("Approved");

            buyerContext.close();
            adminContext.close();
        }
    }
}`,
            explanation: [
              'Two BrowserContexts created from a single Browser process in Java.',
              'Zero state bleeding between buyer and admin credentials.',
              'Fast execution without spawning heavy secondary browser windows.'
            ]
          },
          python: {
            filename: 'test_multi_persona.py',
            code: `from playwright.sync_api import Browser, expect

def test_buyer_and_admin_workflow(browser: Browser):
    # Context 1: Buyer persona
    buyer_context = browser.new_context()
    buyer_page = buyer_context.new_page()
    buyer_page.goto("https://shop.enterprise.com")
    buyer_page.get_by_role("button", name="Place Order").click()
    order_id = buyer_page.get_by_test_id("order-id").inner_text()

    # Context 2: Admin persona
    admin_context = browser.new_context()
    admin_page = admin_context.new_page()
    admin_page.goto("https://admin.enterprise.com")
    admin_page.get_by_placeholder("Search Order").fill(order_id)
    admin_page.get_by_role("button", name="Approve").click()

    # Verify reactive update
    expect(buyer_page.get_by_test_id("status")).to_have_text("Approved")

    buyer_context.close()
    admin_context.close()`,
            explanation: [
              'pytest injects the shared browser fixture cleanly.',
              'Both contexts run concurrently inside the same Python process.',
              'expect() polls buyer_page automatically until the approval webhook updates the DOM.'
            ]
          },
          javascript: {
            filename: 'multiPersona.spec.js',
            code: `const { test, expect } = require('@playwright/test');

test('multi-persona workflow: buyer submits, admin approves', async ({ browser }) => {
  const buyerContext = await browser.newContext();
  const buyerPage = await buyerContext.newPage();
  await buyerPage.goto('https://shop.enterprise.com');
  await buyerPage.getByRole('button', { name: 'Place Order' }).click();
  const orderId = await buyerPage.getByTestId('order-id').innerText();

  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  await adminPage.goto('https://admin.enterprise.com');
  await adminPage.getByPlaceholder('Search Order').fill(orderId);
  await adminPage.getByRole('button', { name: 'Approve' }).click();

  await expect(buyerPage.getByTestId('status')).toHaveText('Approved');

  await buyerContext.close();
  await adminContext.close();
});`,
            explanation: [
              'Asynchronous JavaScript context management.',
              'buyerContext and adminContext are completely isolated.',
              'await expect auto-retries until backend updates UI.'
            ]
          },
          typescript: {
            filename: 'multiPersona.spec.ts',
            code: `import { test, expect } from '@playwright/test';

test('multi-persona workflow: buyer submits, admin approves', async ({ browser }) => {
  const buyerContext = await browser.newContext();
  const buyerPage = await buyerContext.newPage();
  await buyerPage.goto('https://shop.enterprise.com');
  await buyerPage.getByRole('button', { name: 'Place Order' }).click();
  const orderId = await buyerPage.getByTestId('order-id').innerText();

  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  await adminPage.goto('https://admin.enterprise.com');
  await adminPage.getByPlaceholder('Search Order').fill(orderId);
  await adminPage.getByRole('button', { name: 'Approve' }).click();

  await expect(buyerPage.getByTestId('status')).toHaveText('Approved');

  await buyerContext.close();
  await adminContext.close();
});`,
            explanation: [
              'Strict TypeScript types for BrowserContext and Page.',
              'Zero state bleeding between test roles.',
              'Web-first assertion with auto-polling.'
            ]
          }
        },
        productionBestPractices: [
          'Utilize storageState JSON files to bypass repeated UI logins for secondary personas.',
          'Always close created contexts in teardown or finally blocks.'
        ],
        commonMistakes: [
          'Reusing a single page instance for multi-user tests, causing session override conflicts.',
          'Calling browser.close() inside individual tests instead of context.close().'
        ],
        interviewQuestion: {
          question: 'How do Playwright BrowserContexts differ from Selenium WebDriver instances in terms of resource utilization?',
          answer: 'A Selenium test launches a new operating system process for each WebDriver instance (consuming 300MB+ RAM and taking 3-5 seconds per start). Playwright starts one shared Browser process and spawns lightweight BrowserContexts (under 10MB RAM, created in ~10ms), providing equivalent incognito isolation with 10x faster execution and vastly lower CI infrastructure cost.'
        }
      },
      {
        id: 'm02-l02',
        title: 'Mastering Web-First Locators & Actionability Pipeline',
        duration: '55 mins',
        difficulty: 'Intermediate',
        objective: 'Implement resilient locators following accessibility priority guidelines and understand Playwright actionability checks.',
        whyItMatters: 'Fragile CSS and XPath locators break with every minor redesign. Web-first locators simulate how real users find elements and survive DOM restructuring.',
        concept: 'Playwright prioritizes user-facing accessibility semantics. Before executing an action (like click), Playwright checks that the element is Attached, Visible, Stable, Receives Events, and Enabled. If not, it automatically retries until the timeout.',
        minimalWorkingExample: `// Playwright Java: Accessible Role & Web-First Assertions
package com.enterprise.tests;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import org.junit.jupiter.api.Test;

public class ResilientLocatorsTest {
    @Test
    void testAccessibilityHierarchy(Page page) {
        page.navigate("https://portal.enterprise.com/dashboard");

        // Priority 1: User-facing role + accessible name
        Locator submitBtn = page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Submit Purchase").setExact(true));
        submitBtn.click();

        // Priority 2: Label associated with input form control
        page.getByLabel("Delivery Instructions").fill("Front reception desk");

        // Priority 3: Placeholder
        page.getByPlaceholder("Search products...").fill("Automation Tools");

        // Priority 4: Test ID
        assertThat(page.getByTestId("cart-total")).hasText("$499.00");
    }
}`,
        codeExplanation: [
          'getByRole queries the Accessibility Tree rather than HTML tags, making it resilient to styling updates.',
          'setExact(true) guarantees precise string matching when buttons share partial names.',
          'Actionability pipeline automatically awaits element visibility and stability without manual sleeps.'
        ],
        codeExamples: {
          java: {
            filename: 'ResilientLocatorsTest.java',
            code: `package com.enterprise.tests;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class ResilientLocatorsTest {
    public static void run(Page page) {
        page.navigate("/dashboard");

        // Priority 1: Accessible Role
        page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Confirm Order")).click();

        // Priority 2: Form Label
        page.getByLabel("Shipping Address").fill("100 Innovation Way");

        // Priority 3: Web-first assertion
        assertThat(page.getByRole(AriaRole.ALERT)).hasText("Order Placed Successfully");
    }
}`,
            explanation: [
              'AriaRole.BUTTON ensures only actionable button elements are targeted.',
              'getByLabel locates inputs associated with <label> tags via "for" attribute or nesting.',
              'assertThat verifies auto-polling condition without sleeps.'
            ]
          },
          python: {
            filename: 'test_resilient_locators.py',
            code: `from playwright.sync_api import Page, expect

def test_accessible_locators(page: Page):
    page.goto("/dashboard")

    # Priority 1: Accessible Role
    page.get_by_role("button", name="Confirm Order").click()

    # Priority 2: Form Label
    page.get_by_label("Shipping Address").fill("100 Innovation Way")

    # Priority 3: Web-first assertion
    expect(page.get_by_role("alert")).to_have_text("Order Placed Successfully")`,
            explanation: [
              'Snake_case API: get_by_role, get_by_label, get_by_test_id.',
              'Auto-waiting actionability pipeline executes before click() or fill().',
              'expect() assertion retries automatically until timeout.'
            ]
          },
          javascript: {
            filename: 'locators.spec.js',
            code: `const { test, expect } = require('@playwright/test');

test('resilient locators', async ({ page }) => {
  await page.goto('/dashboard');
  await page.getByRole('button', { name: 'Confirm Order' }).click();
  await page.getByLabel('Shipping Address').fill('100 Innovation Way');
  await expect(page.getByRole('alert')).toHaveText('Order Placed Successfully');
});`,
            explanation: [
              'Standard Node.js Playwright syntax.',
              'Web-first locators eliminate brittle CSS class selectors.',
              'Auto-retrying assertions handle async animations.'
            ]
          },
          typescript: {
            filename: 'locators.spec.ts',
            code: `import { test, expect } from '@playwright/test';

test('resilient locators', async ({ page }) => {
  await page.goto('/dashboard');
  await page.getByRole('button', { name: 'Confirm Order' }).click();
  await page.getByLabel('Shipping Address').fill('100 Innovation Way');
  await expect(page.getByRole('alert')).toHaveText('Order Placed Successfully');
});`,
            explanation: [
              'Strict TypeScript types for options and matchers.',
              'Accessible roles simulate real user assistive technology interaction.',
              'Zero sleeps needed.'
            ]
          }
        },
        productionBestPractices: [
          'Order locator strategy: getByRole > getByLabel > getByText > getByTestId > CSS (only as last resort).',
          'Avoid XPath (/html/body/div[2]/form/div/button) completely in modern Playwright suites.'
        ],
        commonMistakes: [
          'Using locator("button:has-text(\'Save\')") when getByRole("button", { name: "Save" }) is available.',
          'Adding arbitrary sleeps before clicking an element that Playwright already auto-waits for.'
        ],
        interviewQuestion: {
          question: 'What are the 5 actionability checks Playwright performs before executing a click action across all language bindings?',
          answer: 'Playwright verifies: 1) Attached: element is connected to the DOM, 2) Visible: non-zero size and not display:none or visibility:hidden, 3) Stable: element has finished animating/moving, 4) Receives Events: element is not obscured by other elements at the click point, and 5) Enabled: element does not have the disabled attribute.'
        }
      }
    ]
  },
  {
    id: 'm03',
    code: 'M03',
    title: 'Enterprise Framework Architecture & Design Patterns',
    duration: '2 weeks / 20 hours',
    level: 'Advanced',
    description: 'Design modular frameworks using Page Object Model, Component Composition, Custom Test Fixtures, Dependency Injection, and configuration loaders.',
    topics: [
      'Page Object Model: BasePage, inheritance vs composition',
      'Fluent interfaces & method chaining best practices',
      'Dependency injection & fixture lifecycle management',
      'Thread-safe test runners and parallel execution',
      'Data-driven testing with JSON, CSV and data factories',
      'Runtime schema validation and environment management',
      'Secure secrets management & environment hygiene',
      'Custom assertion matchers & enterprise reporting hooks'
    ],
    architecture_lab: 'Build a scalable Playwright framework from scratch using Page Objects, configuration loaders, schema validation, and environment-aware execution.',
    study_card: {
      code: 'SC-03',
      title: 'Dependency Injection vs Global State',
      keyTakeaways: [
        'Replace static singleton managers with dependency injection fixtures for automatic parallel-safe isolation.',
        'Prefer Page Component Composition (SearchWidget, NavHeader) over monolithic Page Object classes.',
        'Isolate test state to prevent thread collisions in concurrent execution.',
        'Validate external test configuration at load time to catch misconfigurations before browser launch.'
      ]
    },
    cheat_sheet: 'Fixture lifecycle and configuration matrix',
    practice_project: 'Refactor a legacy monolithic automation suite into an enterprise-grade data-driven framework with reusable components.',
    lessons: [
      {
        id: 'm03-l01',
        title: 'Page Object Model & Component Composition',
        duration: '60 mins',
        difficulty: 'Advanced',
        objective: 'Construct reusable, thread-safe Page Object Models that encapsulate element locators and expose user intent methods.',
        whyItMatters: 'Writing raw locator queries directly in test files leads to massive duplication. Page Objects centralize selectors and business actions.',
        concept: 'A Page Object represents a web page or modular component. It receives the Page instance through constructor dependency injection and provides fluent action methods that return the next destination page.',
        minimalWorkingExample: `// Java Page Object Model with Fluent Interface
package com.enterprise.pages;

import com.microsoft.playwright.Page;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.options.AriaRole;

public class LoginPage {
    private final Page page;
    private final Locator emailInput;
    private final Locator passwordInput;
    private final Locator submitButton;

    public LoginPage(Page page) {
        this.page = page;
        this.emailInput = page.getByLabel("Email Address");
        this.passwordInput = page.getByLabel("Password");
        this.submitButton = page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Sign In"));
    }

    public DashboardPage login(String email, String password) {
        emailInput.fill(email);
        passwordInput.fill(password);
        submitButton.click();
        return new DashboardPage(page);
    }
}`,
        codeExplanation: [
          'Page is injected via constructor, keeping the Page Object stateless and thread-safe.',
          'Locators are declared as private final fields initialized using accessible roles and labels.',
          'login(...) returns a new DashboardPage, enabling fluent test chaining: loginPage.login(...).verifyHeader();'
        ],
        codeExamples: {
          java: {
            filename: 'LoginPage.java',
            code: `package com.enterprise.pages;

import com.microsoft.playwright.Page;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.options.AriaRole;

public class LoginPage {
    private final Page page;
    private final Locator emailField;
    private final Locator passwordField;
    private final Locator submitBtn;

    public LoginPage(Page page) {
        this.page = page;
        this.emailField = page.getByLabel("Email");
        this.passwordField = page.getByLabel("Password");
        this.submitBtn = page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Sign In"));
    }

    public DashboardPage loginAs(String email, String password) {
        emailField.fill(email);
        passwordField.fill(password);
        submitBtn.click();
        return new DashboardPage(page);
    }
}`,
            explanation: [
              'Pure Java OOP encapsulation with constructor dependency injection.',
              'Method chaining returns the target DashboardPage.',
              'Thread-safe: multiple tests can instantiate LoginPage on different threads simultaneously.'
            ]
          },
          python: {
            filename: 'login_page.py',
            code: `from playwright.sync_api import Page
from pages.dashboard_page import DashboardPage

class LoginPage:
    def __init__(self, page: Page):
        self.page = page
        self.email_input = page.get_by_label("Email")
        self.password_input = page.get_by_label("Password")
        self.submit_btn = page.get_by_role("button", name="Sign In")

    def login_as(self, email: str, password: str) -> DashboardPage:
        self.email_input.fill(email)
        self.password_input.fill(password)
        self.submit_btn.click()
        return DashboardPage(self.page)`,
            explanation: [
              'Clean Python class with type annotations.',
              'Encapsulates user interactions into self-describing methods.',
              'Returns DashboardPage instance for fluent assertions.'
            ]
          },
          javascript: {
            filename: 'LoginPage.js',
            code: `class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitBtn = page.getByRole('button', { name: 'Sign In' });
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitBtn.click();
  }
}

module.exports = { LoginPage };`,
            explanation: [
              'Standard ES6 class pattern.',
              'Receives page in constructor.',
              'Async method encapsulates fill and click steps.'
            ]
          },
          typescript: {
            filename: 'LoginPage.ts',
            code: `import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitBtn = page.getByRole('button', { name: 'Sign In' });
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitBtn.click();
  }
}`,
            explanation: [
              'Strict readonly properties ensure locators cannot be mutated.',
              'Strongly typed method signatures prevent missing argument bugs.',
              'Easily injectable into custom fixtures.'
            ]
          }
        },
        productionBestPractices: [
          'Never put assertions inside action methods in Page Objects; return page objects or locator getters and assert in the test.',
          'Decompose large pages into Page Components (e.g. NavigationBar, SearchWidget, Footer).'
        ],
        commonMistakes: [
          'Storing WebDriver or Page instances in static singleton variables, breaking parallel test execution.',
          'Returning raw strings or booleans instead of Locators or new Page Objects.'
        ],
        interviewQuestion: {
          question: 'How do you structure Page Objects to prevent flakiness in parallel multi-threaded test runs?',
          answer: 'Every Page Object must receive the Page instance dynamically through constructor dependency injection rather than accessing a shared static variable. State must remain strictly scoped to the test execution thread, ensuring multiple threads running in parallel never overwrite each other page references or browser sessions.'
        }
      }
    ]
  },
  {
    id: 'm04',
    code: 'M04',
    title: 'API Testing, CI/CD Pipelines & Advanced Reporting',
    duration: '2 weeks / 20 hours',
    level: 'Advanced',
    description: 'Integrate API testing for fast backend data seeding, containerize test runners, and author production CI/CD workflows across Java, Python, and JS/TS.',
    topics: [
      'Playwright APIRequestContext architecture across languages',
      'REST API test authoring: GET, POST, PUT, DELETE',
      'Authentication headers, JWT injection & session reuse',
      'Hybrid UI/API testing patterns (Seed via API, Verify via UI)',
      'Intercepting & mocking network requests with page.route()',
      'Docker containerization with official Playwright images',
      'GitHub Actions workflow automation & matrix sharding',
      'Jenkins pipeline orchestration & parallel worker sharding',
      'Trace Viewer deep diagnostics (DOM snapshots, console, network)',
      'Allure & HTML enterprise report generation'
    ],
    architecture_lab: 'Build a Dockerized CI pipeline that executes Playwright tests across parallel worker shards, collects traces on failure, generates reports, and uploads artifacts.',
    study_card: {
      code: 'SC-04',
      title: 'Hybrid UI-API Test Design Patterns',
      keyTakeaways: [
        'Seed prerequisites (create user, populate cart) via API in 50ms rather than spending 15 seconds navigating forms.',
        'Use request context to authenticate via backend endpoint and reuse storageState for instant browser context injection.',
        'Run Playwright tests in headless Linux containers using official Playwright images for 100% CI parity.',
        'Configure traces to retain on failure to record full network traffic, DOM snapshots, and action screencasts with near-zero overhead.'
      ]
    },
    cheat_sheet: 'Docker, GitHub Actions, Jenkins and Allure reference',
    practice_project: 'Register a user through an API endpoint, validate backend database state, authenticate without UI login, verify the shopping cart via UI, and publish an automated CI report.',
    lessons: [
      {
        id: 'm04-l01',
        title: 'Hybrid UI/API Automation & Data Seeding',
        duration: '50 mins',
        difficulty: 'Advanced',
        objective: 'Construct hybrid tests that prepare preconditions using APIRequestContext before performing UI assertions.',
        whyItMatters: 'UI-only end-to-end tests are slow and fragile. By creating 90% of test data through fast API endpoints, test execution time drops from 10 minutes to 30 seconds.',
        concept: 'APIRequestContext allows tests to send HTTP requests directly without browser overhead. A test can POST an order via API, capture the generated orderId, and immediately navigate to /orders/{id} in the browser to verify visual rendering.',
        minimalWorkingExample: `// Java Hybrid UI/API Test
package com.enterprise.tests;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.RequestOptions;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import org.junit.jupiter.api.Test;

public class HybridOrderTest {
    @Test
    void testSeedViaApiAndVerifyInUi() {
        try (Playwright playwright = Playwright.create()) {
            // 1. Fast API Seeding (30ms)
            APIRequestContext request = playwright.request().newContext(
                new APIRequest.NewContextOptions().setBaseURL("https://api.enterprise.com")
            );
            APIResponse response = request.post("/api/v1/orders", 
                RequestOptions.create().setData("{\\"sku\\": \\"PRO-01\\", \\"quantity\\": 2}")
            );
            Assertions.assertEquals(201, response.status());

            // 2. Focused UI Verification
            Browser browser = playwright.chromium().launch();
            Page page = browser.newPage();
            page.navigate("https://shop.enterprise.com/orders/PRO-01");
            assertThat(page.getByTestId("order-quantity")).hasText("2");

            request.dispose();
            browser.close();
        }
    }
}`,
        codeExplanation: [
          'playwright.request().newContext() initializes an APIRequestContext without launching a browser binary.',
          'POST request seeds the order in milliseconds directly against backend services.',
          'Browser is used solely for visual and functional verification of the specific order screen.'
        ],
        codeExamples: {
          java: {
            filename: 'HybridApiTest.java',
            code: `package com.enterprise.tests;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.RequestOptions;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import org.junit.jupiter.api.*;

public class HybridApiTest {
    @Test
    void testSeedViaApiVerifyInUi() {
        try (Playwright playwright = Playwright.create()) {
            APIRequestContext request = playwright.request().newContext();
            APIResponse res = request.post("https://api.enterprise.com/orders",
                RequestOptions.create().setData("{\\"item\\": \\"Laptop\\", \\"price\\": 999.99}")
            );
            Assertions.assertEquals(201, res.status());

            Browser browser = playwright.chromium().launch();
            Page page = browser.newPage();
            page.navigate("https://shop.enterprise.com/orders");
            assertThat(page.getByText("Laptop")).isVisible();

            request.dispose();
            browser.close();
        }
    }
}`,
            explanation: [
              'APIRequestContext in Java handles HTTP calls directly.',
              'Eliminates navigating multiple checkout pages to set up test state.',
              'Ensures high-speed execution with zero UI flake during setup.'
            ]
          },
          python: {
            filename: 'test_hybrid_api.py',
            code: `from playwright.sync_api import Playwright, Page, expect

def test_hybrid_seeding(playwright: Playwright, page: Page):
    # Fast backend seeding via APIRequestContext
    api_context = playwright.request.new_context(base_url="https://api.enterprise.com")
    response = api_context.post("/orders", data={"item": "Laptop", "price": 999.99})
    assert response.status == 201

    # Targeted UI verification
    page.goto("https://shop.enterprise.com/orders")
    expect(page.get_by_text("Laptop")).to_be_visible()

    api_context.dispose()`,
            explanation: [
              'playwright.request fixture provides synchronous HTTP client.',
              'Sub-second execution for precondition setup.',
              'expect() asserts UI reflects the seeded data.'
            ]
          },
          javascript: {
            filename: 'hybrid.spec.js',
            code: `const { test, expect } = require('@playwright/test');

test('hybrid API seeding and UI verification', async ({ request, page }) => {
  const res = await request.post('/api/orders', {
    data: { item: 'Laptop', price: 999.99 }
  });
  expect(res.status()).toBe(201);

  await page.goto('/orders');
  await expect(page.getByText('Laptop')).toBeVisible();
});`,
            explanation: [
              'Built-in request fixture in @playwright/test.',
              'Preconditions seeded in 30ms.',
              'UI verifies critical customer invoice view.'
            ]
          },
          typescript: {
            filename: 'hybrid.spec.ts',
            code: `import { test, expect } from '@playwright/test';

test('hybrid API seeding and UI verification', async ({ request, page }) => {
  const res = await request.post('/api/orders', {
    data: { item: 'Laptop', price: 999.99 }
  });
  expect(res.status()).toBe(201);

  await page.goto('/orders');
  await expect(page.getByText('Laptop')).toBeVisible();
});`,
            explanation: [
              'Type-safe request fixtures.',
              'Massive runtime savings in enterprise suites.',
              'Direct failure isolation between API and UI.'
            ]
          }
        },
        productionBestPractices: [
          'Always clean up seeded backend entities in test teardown or use isolated ephemeral databases.',
          'Reuse auth tokens between APIRequestContext and BrowserContext to eliminate redundant logins.'
        ],
        commonMistakes: [
          'Navigating through 10 pages in the UI just to prepare data for a 1-page test.',
          'Hardcoding test IDs in API payloads instead of generating dynamic UUIDs.'
        ],
        interviewQuestion: {
          question: 'What is the "Hybrid UI-API" testing strategy and why is it preferred in enterprise automation?',
          answer: 'The Hybrid UI-API strategy uses direct HTTP API calls for test setup and precondition generation (e.g. creating test accounts, seeding shopping carts) and reserves browser UI automation strictly for verifying critical user journeys. This reduces test suite runtime by up to 80%, eliminates flake in non-target pages, and improves root-cause isolation.'
        }
      }
    ]
  },
  {
    id: 'm05',
    code: 'M05',
    title: 'Cutting-Edge AI Testing & MCP Integration',
    duration: '1.5 weeks / 15 hours',
    level: 'Enterprise',
    description: 'Leverage Generative AI, Model Context Protocol (MCP), and self-healing locator strategies with strict AI safety boundaries and visual regression verification.',
    topics: [
      'Generative AI for QA: Capabilities and safety boundaries',
      'Prompt engineering patterns for edge case & test matrix synthesis',
      'Model Context Protocol (MCP) architecture & tool definitions',
      'Integrating Playwright with MCP server for dynamic DOM inspection',
      'AI-assisted runtime failure diagnosis & root cause analysis',
      'Self-healing automation: semantic selector recovery with confidence thresholds',
      'Visual regression testing with dynamic masking',
      'Strict AI safety: preventing prompt injection & credential leakage',
      'Human-in-the-loop validation for automated code repair'
    ],
    architecture_lab: 'Build an AI-assisted self-healing locator prototype that captures locator failures, gathers DOM accessibility tree context via MCP, proposes replacement selectors, validates them against strict criteria, and logs recovery metrics.',
    study_card: {
      code: 'SC-05',
      title: 'MCP in Modern Software Quality',
      keyTakeaways: [
        'Model Context Protocol (MCP) provides a standardized protocol for LLMs to securely query browser state and execute inspected tools.',
        'Never execute raw LLM-generated code directly in production; parse structured JSON proposals and apply verification gates.',
        'Self-healing locators must require minimum 85% confidence score and pass human-in-the-loop review before persisting to git.',
        'Visual regression tests must mask volatile elements (timestamps, ads, avatars) during visual comparison.'
      ]
    },
    cheat_sheet: 'AI Prompt Engineering Playbook for Test Generation and Selector Recovery',
    practice_project: 'Create a deliberately broken automation scenario where a mutated selector triggers an AI-assisted recovery workflow, proposes a fix, and outputs recovery telemetry.',
    lessons: [
      {
        id: 'm05-l01',
        title: 'Model Context Protocol (MCP) & Self-Healing Locators',
        duration: '60 mins',
        difficulty: 'Enterprise',
        objective: 'Architect an AI self-healing locator recovery pipeline using accessibility snapshot heuristics and strict validation filters.',
        whyItMatters: 'DOM refactoring frequently breaks traditional locators during frontend sprints. AI-assisted recovery diagnoses mutated elements in real-time, preventing blocked CI pipelines while maintaining code integrity.',
        concept: 'When a locator fails with TimeoutError, the recovery engine captures the current page Accessibility Tree, compares it with the element historical semantic profile, prompts an LLM via structured JSON tool schema, verifies the suggested replacement, and continues the run.',
        minimalWorkingExample: `// Java Resilient Locator Fallback Pattern
package com.enterprise.ai;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;

public class ResilientLocatorHelper {
    public static Locator getHealedLocator(Page page, String primaryCss, AriaRole fallbackRole, String accessibleName) {
        Locator primary = page.locator(primaryCss);
        try {
            primary.waitFor(new Locator.WaitForOptions().setTimeout(2000));
            return primary;
        } catch (PlaywrightException e) {
            System.out.println("[AI Self-Heal] Primary CSS failed: " + primaryCss + ". Falling back to accessible role: " + fallbackRole);
            Locator healed = page.getByRole(fallbackRole, new Page.GetByRoleOptions().setName(accessibleName));
            healed.waitFor(new Locator.WaitForOptions().setTimeout(5000));
            return healed;
        }
    }
}`,
        codeExplanation: [
          'Graceful degradation: Attempts fast primary selector before falling back to accessibility tree heuristics.',
          'Prevents test suite abortion while logging structured telemetry for developer review.',
          'Never executes unvetted arbitrary scripts; relies on Playwright typed getByRole primitives.'
        ],
        codeExamples: {
          java: {
            filename: 'ResilientLocatorHelper.java',
            code: `package com.enterprise.ai;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;

public class ResilientLocatorHelper {
    public static Locator resolveLocator(Page page, String legacySelector, AriaRole role, String name) {
        try {
            Locator primary = page.locator(legacySelector);
            primary.waitFor(new Locator.WaitForOptions().setTimeout(1500));
            return primary;
        } catch (Exception ex) {
            System.err.println("[Self-Healing] Primary locator failed. Recovering via accessible role...");
            Locator fallback = page.getByRole(role, new Page.GetByRoleOptions().setName(name));
            fallback.waitFor(new Locator.WaitForOptions().setTimeout(5000));
            return fallback;
        }
    }
}`,
            explanation: [
              'Catches timeout and falls back to WCAG accessible role.',
              'Ensures zero pipeline disruption from minor CSS renames.',
              'Emits log telemetry for engineers to update source code.'
            ]
          },
          python: {
            filename: 'ai_healing.py',
            code: `from playwright.sync_api import Page, Locator

def get_resilient_locator(page: Page, legacy_selector: str, role: str, name: str) -> Locator:
    try:
        primary = page.locator(legacy_selector)
        primary.wait_for(timeout=1500)
        return primary
    except Exception:
        print(f"[Self-Healing] {legacy_selector} failed. Healing with role='{role}', name='{name}'")
        fallback = page.get_by_role(role, name=name)
        fallback.wait_for(timeout=5000)
        return fallback`,
            explanation: [
              'Pythonic try/except handling with fast trial timeout.',
              'Graceful recovery prevents flaky test runs.',
              'Relies on web-first get_by_role.'
            ]
          },
          javascript: {
            filename: 'healer.js',
            code: `async function getHealedLocator(page, selector, role, name) {
  try {
    const loc = page.locator(selector);
    await loc.waitFor({ timeout: 1500 });
    return loc;
  } catch (err) {
    console.warn(\`[AI Heal] Primary selector \${selector} failed. Recovering via role: \${role}\`);
    const healed = page.getByRole(role, { name });
    await healed.waitFor({ timeout: 5000 });
    return healed;
  }
}
module.exports = { getHealedLocator };`,
            explanation: [
              'Safe JavaScript locator recovery.',
              'Logs warning telemetry.',
              'Ensures test proceeds without false failures.'
            ]
          },
          typescript: {
            filename: 'healer.ts',
            code: `import { Page, Locator } from '@playwright/test';

export async function getHealedLocator(
  page: Page, 
  selector: string, 
  role: any, 
  name: string | RegExp
): Promise<Locator> {
  try {
    const loc = page.locator(selector);
    await loc.waitFor({ timeout: 1500 });
    return loc;
  } catch (err) {
    console.warn(\`[AI Heal] Selector \${selector} failed. Healing via \${role}...\`);
    const healed = page.getByRole(role, { name });
    await healed.waitFor({ timeout: 5000 });
    return healed;
  }
}`,
            explanation: [
              'TypeScript typed helper function.',
              'Ensures safe fallback without arbitrary code evaluation.',
              'Integrates cleanly into Page Objects.'
            ]
          }
        },
        productionBestPractices: [
          'Always log self-healing events to test metrics so engineering teams can update the source code permanently.',
          'Enforce strict timeouts on recovery routines to avoid inflating CI run durations.'
        ],
        commonMistakes: [
          'Allowing AI to generate raw JavaScript evaluated via page.evaluate(code) without sandboxing.',
          'Silently healing without notifying the test report, hiding legitimate product regressions.'
        ],
        interviewQuestion: {
          question: 'What are the architectural risks of "self-healing" test automation in enterprise CI/CD?',
          answer: 'The primary risk is masking legitimate defects: if a button is accidentally removed by a developer, a naive self-healing engine might click an unintended element, allowing a bug to escape to production. Enterprise self-healing must require strict semantic matching, confidence scoring (>85%), explicit failure logging, and never auto-commit code without developer approval.'
        }
      }
    ]
  },
  {
    id: 'm06',
    code: 'M06',
    title: 'Agile QA Processes, Manual Testing & Enterprise Project',
    duration: '2 weeks / 20 hours',
    level: 'Enterprise',
    description: 'Integrate automated testing into enterprise Agile SDLC: Sprint planning, risk-based test design, JIRA/JQL traceability, and automated defect triage.',
    topics: [
      'Agile QA: Scrum, Sprint planning & Three Amigos collaboration',
      'Shift-Left Quality Engineering & Definition of Done (DoD)',
      'Risk-based test analysis & Test Pyramid distribution',
      'Requirements traceability & JIRA issue management',
      'Advanced JQL querying for test coverage auditing',
      'Defect lifecycle: triage, severity vs priority, RCA',
      'Quality Gates: branch protection & blocking flaky merges',
      'Comprehensive enterprise automation execution from backlog stories'
    ],
    architecture_lab: 'Simulate a complete Agile sprint from user story analysis to automated test implementation, CI execution, defect reporting, and release quality sign-off.',
    study_card: {
      code: 'SC-06',
      title: 'Risk-Based Quality Engineering',
      keyTakeaways: [
        'Apply the 80/20 Pareto rule: 80% of production defects originate in 20% of high-complexity features (checkout, auth, data export).',
        'Shift-Left: Participate in backlog grooming to challenge ambiguous acceptance criteria before a single line of code is written.',
        'Enforce strict Quality Gates: Zero merge without 100% green automated smoke tests and 0 Sev-1/Sev-2 open defects.',
        'Use metadata annotations to correlate automated test results directly with Jira user stories for continuous compliance auditability.'
      ]
    },
    cheat_sheet: 'JQL and Defect Triage Handbook',
    practice_project: 'Start with an unautomated enterprise backlog of 5 user stories and independently build the automation framework, tests, CI pipeline integration, and defect workflow.',
    lessons: [
      {
        id: 'm06-l01',
        title: 'Risk-Based Test Prioritization & Shift-Left Gates',
        duration: '45 mins',
        difficulty: 'Enterprise',
        objective: 'Construct a risk matrix balancing business impact against technical failure probability to guide test automation investment.',
        whyItMatters: 'Attempting 100% end-to-end UI coverage is an anti-pattern that creates sluggish, high-maintenance test suites. Risk scoring focuses automation on critical revenue paths.',
        concept: 'Risk Score = Business Impact (1-5) * Failure Probability (1-5). High-risk flows (15-25) receive rigorous multi-browser UI + API automation; low-risk flows (1-5) rely on unit tests or exploratory testing.',
        minimalWorkingExample: `// Test Annotation & Categorization in Java
package com.enterprise.tests;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

public class CheckoutRiskTierTest {
    @Test
    @Tag("tier-1")
    @Tag("smoke")
    @Tag("JIRA-PROD-4091")
    @DisplayName("Verify payment authorization on credit cards @critical-risk")
    void testCriticalPaymentPath() {
        // High impact revenue test run on every PR commit
    }
}`,
        codeExplanation: [
          '@Tag annotations categorize tests by risk tier and associate with Jira issues.',
          'CI pipelines can execute fast sanity checks: mvn test -Dgroups="smoke"',
          'Full regression suites run on scheduled nightly cadences.'
        ],
        codeExamples: {
          java: {
            filename: 'RiskTierTest.java',
            code: `package com.enterprise.tests;

import org.junit.jupiter.api.*;

public class RiskTierTest {
    @Test
    @Tag("smoke")
    @Tag("tier-1")
    @DisplayName("PAY-101: Critical Checkout Flow")
    void testCheckoutPayment() {
        // Critical revenue test executed on every PR
    }
}`,
            explanation: [
              'JUnit 5 @Tag allows selective execution with Maven/Gradle.',
              'Links test directly to Jira user story PAY-101.',
              'Fast 2-minute smoke gate on Pull Requests.'
            ]
          },
          python: {
            filename: 'test_risk_tier.py',
            code: `import pytest

@pytest.mark.smoke
@pytest.mark.tier1
@pytest.mark.jira("PAY-101")
def test_checkout_payment(page):
    """Critical revenue path executed on every PR"""
    page.goto("/checkout")
    # Run with: pytest -m smoke`,
            explanation: [
              'Pytest custom markers (@pytest.mark.smoke).',
              'Enables targeted execution in CI workflows.',
              'Clear risk categorization.'
            ]
          },
          javascript: {
            filename: 'riskTier.spec.js',
            code: `const { test } = require('@playwright/test');

test('critical checkout flow @smoke @tier-1', async ({ page }) => {
  await page.goto('/checkout');
});
// Run in CI with: npx playwright test --grep "@smoke"`,
            explanation: [
              'Playwright tag annotations in test titles.',
              'Grepped by CI runner for rapid verification.',
              'Decouples smoke tests from nightly regression.'
            ]
          },
          typescript: {
            filename: 'riskTier.spec.ts',
            code: `import { test } from '@playwright/test';

test('critical checkout flow @smoke @tier-1', {
  annotation: [
    { type: 'risk-score', description: '25 (P0)' },
    { type: 'jira-story', description: 'PAY-101' }
  ]
}, async ({ page }) => {
  await page.goto('/checkout');
});`,
            explanation: [
              'Structured annotations in test metadata.',
              'Surfaced in HTML reports and CI dashboards.',
              'Explicit risk score tracking.'
            ]
          }
        },
        productionBestPractices: [
          'Tag tests with @smoke, @regression, @p0, @p1 for flexible tag-based execution in CI.',
          'Review risk matrices every sprint with Product Owners and Lead Developers.'
        ],
        commonMistakes: [
          'Treating all tests with equal priority, causing PR builds to take 45+ minutes.',
          'Automating edge cases in UI that should be verified at unit or integration level.'
        ],
        interviewQuestion: {
          question: 'How do you determine what NOT to automate at the UI layer in an enterprise test suite?',
          answer: 'We filter candidate tests through the Test Pyramid and Risk Matrix. Scenarios involving data validation, boundary conditions, and error status codes are pushed down to unit or API tests. UI automation is reserved strictly for high-impact user journeys, cross-service workflows, critical revenue paths, and visual regressions that cannot be verified at lower levels.'
        }
      }
    ]
  },
  {
    id: 'm07',
    code: 'M07',
    title: 'Interview Preparation, System Design & Career Acceleration',
    duration: '1 week / 10 hours',
    level: 'Architect',
    description: 'Prepare for top-tier Senior SDET and Automation Architect technical interviews with system design, 5,000+ test concurrency architectures, and STAR behavioral leadership.',
    topics: [
      'Senior SDET & Automation Architect interview roadmap',
      'System design for 5,000+ test distributed cloud execution grids',
      'Concurrency, parallel worker sharding & resource budgeting',
      'Eliminating flake at scale: network flakiness, animations, state leaks',
      'Automated Test ROI metrics: execution time, defect escape rate, flakiness index',
      'Resume optimization & portfolio architecture presentation',
      'STAR methodology for technical and leadership behavioral rounds',
      'Live coding, framework refactoring & debugging interview simulations'
    ],
    architecture_lab: 'Design a distributed, cloud-native automation execution grid capable of executing 5,000+ Playwright tests in under 10 minutes using sharding, Docker, and dynamic spot instances.',
    study_card: {
      code: 'SC-07',
      title: 'Senior Test Automation Architect Interview Questions',
      keyTakeaways: [
        'System Design Rule of Thumb: Divide large suites using Playwright matrix sharding across ephemeral cloud spot instances to cap total runtime at 10 minutes.',
        'Flake Zero-Tolerance: Quarantine tests that fail intermittently into a quarantined suite; never leave flaky tests in the main blocking quality gate.',
        'Measure ROI in engineer hours saved, build cycle time reduction, and post-release defect escape rate.',
        'In behavioral rounds, structure answers with STAR: Situation, Task, Action (emphasizing personal technical leadership), and quantifiable Result.'
      ]
    },
    cheat_sheet: 'STAR interview templates and automation ROI metrics',
    practice_project: 'Complete timed live coding, debugging, architecture design, and behavioral interview simulations evaluated by the AI Mentor.',
    lessons: [
      {
        id: 'm07-l01',
        title: 'System Design: Scaling 5,000+ Tests in Under 10 Minutes',
        duration: '60 mins',
        difficulty: 'Architect',
        objective: 'Architect a distributed CI execution pipeline using parallel runner sharding, spot containers, and artifact aggregation.',
        whyItMatters: 'As test suites grow from 200 to 5,000 tests, linear execution time exceeds 5 hours, paralyzing engineering deployment velocity. Architects must design sub-10 minute distributed grids.',
        concept: 'Native sharding partitions the test suite across N separate runner jobs. Each worker executes 1/Nth of the tests concurrently, reducing total wall-clock runtime by a factor of N before reports are aggregated.',
        minimalWorkingExample: `# Enterprise CI/CD Sharded Pipeline (GitHub Actions)
name: Distributed Test Grid
on: [push]

jobs:
  test-sharded:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4, 5, 6, 7, 8]
        shardTotal: [8]
    steps:
      - uses: actions/checkout@v4
      - name: Run Sharded Tests
        run: |
          # For Java: mvn test -Dtest="**/*Test" -Dsurefire.shardIndex=\${{ matrix.shardIndex }}
          # For Playwright: npx playwright test --shard=\${{ matrix.shardIndex }}/\${{ matrix.shardTotal }}
      - uses: actions/upload-artifact@v4
        with:
          name: test-results-\${{ matrix.shardIndex }}
          path: target/surefire-reports`,
        codeExplanation: [
          'matrix.shardIndex distributes the test execution across 8 independent virtual machines.',
          'fail-fast: false ensures other shards continue running even if one test in a shard fails.',
          'Combined artifacts are merged into a single comprehensive dashboard in the downstream job.'
        ],
        codeExamples: {
          java: {
            filename: 'ci-matrix-java.yml',
            code: `# GitHub Actions Sharded Execution for Java Playwright
name: Java Playwright Matrix
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: 'temurin', java-version: '21' }
      - run: mvn test -Dgroups="regression" -Dshard=\${{ matrix.shard }}/4
      - uses: actions/upload-artifact@v4
        with: { name: report-\${{ matrix.shard }}, path: target/surefire-reports }`,
            explanation: [
              'Runs JUnit 5 test groups across 4 parallel runners.',
              'Caches Maven dependencies for sub-2 minute job startups.',
              'Merges Allure or Surefire reports at the end of the pipeline.'
            ]
          },
          python: {
            filename: 'ci-matrix-python.yml',
            code: `# GitHub Actions Sharded Execution for Python Playwright
name: Python Playwright Matrix
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.11' }
      - run: pip install -r requirements.txt && playwright install --with-deps
      - run: pytest --numprocesses=auto --shard-id=\${{ matrix.shard }} --num-shards=4`,
            explanation: [
              'pytest-xdist combined with sharding.',
              'Executes across parallel GitHub Actions runners.',
              'Aggregates XML/HTML test reports.'
            ]
          },
          javascript: {
            filename: 'ci-matrix-js.yml',
            code: `# GitHub Actions Sharded Execution for JavaScript Playwright
name: JS Playwright Matrix
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci && npx playwright install --with-deps
      - run: npx playwright test --shard=\${{ matrix.shardIndex }}/\${{ matrix.shardTotal }} --reporter=blob`,
            explanation: [
              'Native Playwright matrix sharding.',
              'Generates compressed blob reports per shard.',
              'Single aggregator job runs npx playwright merge-reports.'
            ]
          },
          typescript: {
            filename: 'ci-matrix-ts.yml',
            code: `# GitHub Actions Sharded Execution for TypeScript Playwright
name: TS Playwright Matrix
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci && npx playwright install --with-deps
      - run: npx playwright test --shard=\${{ matrix.shardIndex }}/\${{ matrix.shardTotal }} --reporter=blob`,
            explanation: [
              'Shards tests across 4 parallel containers.',
              'Blob reporter for artifact aggregation.',
              'Sub-10 minute execution for thousands of tests.'
            ]
          }
        },
        productionBestPractices: [
          'Budget 1 vCPU and 2GB RAM per worker to avoid CPU throttling and false timing failures.',
          'Store and merge reports in a central S3 bucket or GitHub Artifacts storage.'
        ],
        commonMistakes: [
          'Increasing workers beyond the backend test environment capacity, causing database connection exhaustion.',
          'Using fail-fast: true, which aborts all sibling shards if one test fails.'
        ],
        interviewQuestion: {
          question: 'How would you architect a Playwright test execution pipeline for 10,000 tests to run under 15 minutes?',
          answer: 'I would employ: 1) Matrix sharding across 30-40 ephemeral Linux containers in AWS ECS/GitHub Actions, 2) Hybrid UI/API execution where 80% of preconditions are seeded via APIRequestContext, 3) Shared auth via pre-authenticated storageState JSON, 4) Blob reporting aggregation into a single dashboard, 5) Automatic quarantine of flaky tests, and 6) Local backend mock services with WireMock/Prism to avoid bottlenecking staging environments.'
        }
      }
    ]
  }
];

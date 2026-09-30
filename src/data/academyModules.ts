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
  productionBestPractices: string[];
  commonMistakes: string[];
  interviewQuestion: {
    question: string;
    answer: string;
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
    description: 'Master Node.js runtime mechanics, strict TypeScript type system, and enterprise Git hygiene essential for scalable automation frameworks.',
    topics: [
      'Node.js runtime mechanics & Event Loop',
      'Memory management & V8 Garbage Collection',
      'npm, npx & package resolution mechanics',
      'package-lock.json & strict dependency pinning',
      'TypeScript Interfaces vs Type Aliases',
      'Union, Intersection & Generics',
      'Utility Types (Partial, Pick, Omit, Record)',
      'Class Access Modifiers (private, protected, readonly)',
      'Git feature branches & Conventional Commits',
      'Interactive rebasing & merge conflict resolution',
      'Pull request hygiene & Automated CI checks'
    ],
    architecture_lab: 'Build an enterprise-grade strict TypeScript workspace with path aliases (@core/*, @pages/*), ESLint, Prettier, package scripts, multi-environment configuration loaders, and professional directory architecture.',
    study_card: {
      code: 'SC-01',
      title: 'TypeScript Type Systems in Test Automation',
      keyTakeaways: [
        'Prefer interfaces for open Page Object contracts; use type aliases for unions, primitives, and mapped shapes.',
        'Use Generics (e.g. BasePage<T>) to create type-safe fluent navigation chains across pages.',
        'Enforce noImplicitAny and strictNullChecks in tsconfig to eliminate runtime test crashes before execution.',
        'Leverage Pick and Omit to craft precise test payload data transfer objects without duplicating schemas.'
      ]
    },
    cheat_sheet: 'Essential CLI, npm, Node.js and TypeScript utility reference',
    practice_project: 'Build a TypeScript Node.js CLI that reads, validates, transforms, and injects environment configuration into test suites with zero runtime drift.',
    additional_practice: [
      'Fix TypeScript compilation errors in strict mode',
      'Create reusable generic Page Component utilities',
      'Resolve complex Git three-way merge conflicts',
      'Perform interactive git rebase -i to squash WIP commits',
      'Author a production PR with automated status checks'
    ],
    lessons: [
      {
        id: 'm01-l01',
        title: 'Node.js Event Loop & Non-Blocking I/O in Test Automation',
        duration: '45 mins',
        difficulty: 'Foundation',
        objective: 'Understand how the Node.js single-threaded event loop processes Playwright asynchronous WebSocket commands and Promises.',
        whyItMatters: 'Misunderstanding the Event Loop leads to unhandled promise rejections, dangling browser instances, and tests that finish prematurely without awaiting assertions.',
        concept: 'Playwright communicates with browsers over DevTools Protocol (CDP) through WebSockets. Every action (page.click, page.goto) returns a Promise scheduled in the Node.js Microtask Queue. Never mix synchronous blocking loops with async test execution.',
        minimalWorkingExample: `// Production Pattern: Proper async/await sequence with promise chaining
import { test, expect } from '@playwright/test';

test('proper event loop handling with parallel requests', async ({ page }) => {
  // Parallel asynchronous dispatch using Promise.all to avoid waterfall delays
  const [response] = await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/api/v1/auth') && resp.status() === 200),
    page.getByRole('button', { name: /sign in/i }).click(),
  ]);

  const data = await response.json();
  expect(data.token).toBeDefined();
});`,
        codeExplanation: [
          'Promise.all fires the network response listener before initiating the user click to prevent race condition drops.',
          'await pauses test execution until the microtask resolves without blocking the underlying Node event loop.',
          'Web-first assertions continuously poll the microtask queue until conditions are satisfied or timeout occurs.'
        ],
        productionBestPractices: [
          'Always register network listeners before triggering the initiating user interaction.',
          'Never use busy-wait synchronous loops (while(Date.now() < end)) as they starve the V8 thread.',
          'Configure global unhandledRejection handlers in test setup to capture dangling asynchronous faults.'
        ],
        commonMistakes: [
          'Forgetting await before page actions, causing tests to pass while browser operations crash in the background.',
          'Placing page.waitForResponse AFTER the click that triggers the request (classic race condition).'
        ],
        interviewQuestion: {
          question: 'How does Playwright leverage the Node.js event loop differently from Selenium WebDriver HTTP requests?',
          answer: 'Selenium sends synchronous HTTP requests over JSON Wire/W3C protocol to browser drivers, inducing HTTP connection overhead and requiring external polling. Playwright maintains a persistent, bidirectional WebSocket connection via Chrome DevTools Protocol (CDP), allowing instant event-driven push notifications and non-blocking asynchronous coordination through Node microtasks.'
        }
      },
      {
        id: 'm01-l02',
        title: 'Advanced TypeScript Type Systems for Automation Frameworks',
        duration: '50 mins',
        difficulty: 'Foundation',
        objective: 'Apply TypeScript generics, utility types (Pick, Omit, Record), and branded types to build type-safe test datasets and Page Objects.',
        whyItMatters: 'Untyped test data leads to runtime typos in payload keys, broken mock structures, and high maintenance costs when backend schemas evolve.',
        concept: 'TypeScript types act as a compile-time safety net. By defining strict interfaces for test data fixtures and API payloads, any contract breaking change in your application is immediately flagged during tsc compilation before a single browser opens.',
        minimalWorkingExample: `export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: string;
}

// Derive registration payload by omitting server-generated fields
export type CreateUserPayload = Omit<UserProfile, 'id' | 'createdAt'>;

// Generic factory function ensuring typed fixture creation
export function createTestUser<T extends Partial<CreateUserPayload>>(
  overrides?: T
): CreateUserPayload & T {
  const defaultUser: CreateUserPayload = {
    email: \`test_\${Date.now()}@enterprise.com\`,
    fullName: 'Automation Test User',
    role: 'editor',
  };
  return { ...defaultUser, ...overrides } as CreateUserPayload & T;
}`,
        codeExplanation: [
          'Omit strips out id and createdAt which are database-generated and not part of the initial POST body.',
          'Generic parameter T allows tests to pass custom overrides while maintaining full IDE autocomplete.',
          'Union literal "admin" | "editor" | "viewer" prevents invalid role string assignment at compile time.'
        ],
        productionBestPractices: [
          'Define schemas using Zod or TypeScript types shared directly between API tests and UI test fixtures.',
          'Use readonly on test configuration objects to prevent accidental state mutation during test runs.'
        ],
        commonMistakes: [
          'Using any across test helpers, disabling all TypeScript benefits.',
          'Duplicating interfaces across files instead of maintaining a centralized models/ directory.'
        ],
        interviewQuestion: {
          question: 'What is the practical difference between Interface and Type in a Playwright TypeScript framework?',
          answer: 'Interfaces support declaration merging and are optimal for defining public contracts such as Page Objects and custom Playwright TestOptions fixtures. Types are ideal for union types (e.g. supported browser engines), intersections, mapped types, and utility transformations (Omit, Pick, Partial) used in test data builders.'
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
    architecture_lab: 'Build a zero-flake multi-engine browser matrix supporting Chromium, Firefox, WebKit, mobile emulation (iPhone 14 / Pixel 7), network latency throttling, and geolocation spoofing.',
    study_card: {
      code: 'SC-02',
      title: 'The Death of Thread.sleep()',
      keyTakeaways: [
        'Never use arbitrary sleeps; Playwright automatically verifies actionability (visible, stable, enabled, editable) before dispatching clicks or input.',
        'Web-first assertions (expect(locator).toBeVisible()) poll automatically up to the timeout with exponential backoff.',
        'Use getByRole as the #1 priority locator strategy to ensure accessibility standards and DOM-agnostic resilience.',
        'Isolate tests using fresh BrowserContexts: 100x faster than restarting browser processes while ensuring zero cookie/storage contamination.'
      ]
    },
    cheat_sheet: 'Locator Priority Matrix and Web-First Assertion Dictionary',
    practice_project: 'Automate a dynamic e-commerce checkout flow containing nested iframes (Stripe payment), asynchronous discount modals, custom dropdowns, and dynamic tax calculation.',
    debugging_challenges: [
      'Fix flaky CSS selectors breaking on responsive layout',
      'Eliminate arbitrary page.waitForTimeout sleeps',
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
        minimalWorkingExample: `import { test, expect } from '@playwright/test';

test('multi-persona scenario: buyer submits, admin approves', async ({ browser }) => {
  // Context 1: Buyer persona
  const buyerContext = await browser.newContext({ storageState: undefined });
  const buyerPage = await buyerContext.newPage();
  await buyerPage.goto('https://shop.enterprise.com/checkout');
  await buyerPage.getByRole('button', { name: /submit order/i }).click();
  const orderId = await buyerPage.getByTestId('order-id').innerText();

  // Context 2: Admin persona (completely isolated cookies & session)
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  await adminPage.goto('https://admin.enterprise.com/approvals');
  await adminPage.getByPlaceholder(/search order/i).fill(orderId);
  await adminPage.getByRole('button', { name: /approve/i }).click();

  // Verify in Buyer view that order status updated reactively
  await expect(buyerPage.getByTestId('order-status')).toHaveText('Approved');

  await buyerContext.close();
  await adminContext.close();
});`,
        codeExplanation: [
          'browser.newContext creates completely isolated cookie and session storage pools without the cost of booting new browser binaries.',
          'buyerPage and adminPage operate concurrently, enabling authentic end-to-end multi-user approval verification.',
          'Context cleanup at the end prevents memory leakage during large test suites.'
        ],
        productionBestPractices: [
          'Utilize storageState JSON files to bypass repeated UI logins for secondary personas.',
          'Always close created contexts in finally blocks or use Playwright built-in fixtures.'
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
        minimalWorkingExample: `import { test, expect } from '@playwright/test';

test('resilient locator strategy following accessibility hierarchy', async ({ page }) => {
  await page.goto('/dashboard');

  // Priority 1: User-facing role + accessible name (Best)
  const submitBtn = page.getByRole('button', { name: 'Submit Purchase', exact: true });
  await submitBtn.click();

  // Priority 2: Label associated with input form control
  await page.getByLabel('Delivery Instructions').fill('Leave at front reception');

  // Priority 3: Placeholder / text content
  await page.getByPlaceholder('Search products...').fill('Automation Tools');

  // Priority 4: Test ID (For complex widgets lacking accessible semantic role)
  await expect(page.getByTestId('cart-total')).toHaveText('$499.00');
});`,
        codeExplanation: [
          'getByRole queries the Accessibility Tree rather than HTML tags, making it resilient to styling updates.',
          'exact: true guarantees precise string matching when buttons share partial names.',
          'Actionability pipeline automatically awaits element visibility and stability without manual sleeps.'
        ],
        productionBestPractices: [
          'Order locator strategy: getByRole > getByLabel > getByText > getByTestId > CSS (only as last resort).',
          'Avoid XPath (/html/body/div[2]/form/div/button) completely in modern Playwright suites.'
        ],
        commonMistakes: [
          'Using locator("button:has-text(\'Save\')") when getByRole("button", { name: "Save" }) is available.',
          'Adding page.waitForTimeout(3000) before clicking an element that Playwright already auto-waits for.'
        ],
        interviewQuestion: {
          question: 'What are the 5 actionability checks Playwright performs before executing a click action?',
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
    description: 'Design modular, maintainable frameworks using Page Object Model, Component Composition, Custom Test Fixtures, Dependency Injection, and Zod schema validation.',
    topics: [
      'Page Object Model: BasePage, inheritance vs composition',
      'Fluent interfaces & method chaining best practices',
      'Playwright Custom Fixtures: test.extend<T>()',
      'Dependency injection & fixture lifecycle management',
      'Worker-scoped vs Test-scoped fixtures',
      'Data-driven testing with JSON, CSV and TypeScript factories',
      'Runtime test schema validation with Zod',
      'Multi-environment configuration (Dev, QA, Staging, Prod)',
      'Secure secrets management & process.env hygiene',
      'Custom expect matchers & enterprise reporting hooks'
    ],
    architecture_lab: 'Build a scalable Playwright framework from scratch using custom fixtures, Page Objects, configuration loaders, schema validation, and environment-aware execution.',
    study_card: {
      code: 'SC-03',
      title: 'Dependency Injection vs Global State',
      keyTakeaways: [
        'Replace static singleton managers with Playwright Custom Fixtures for automatic parallel-safe dependency injection.',
        'Prefer Page Component Composition (SearchWidget, NavHeader) over monolithic, 1,000-line Page Object classes.',
        'Use worker fixtures for expensive global setup (auth tokens, DB seeding); use test fixtures for per-test isolation.',
        'Validate external test data using Zod at load time to catch missing columns or bad JSON before running tests.'
      ]
    },
    cheat_sheet: 'Fixture lifecycle and configuration matrix',
    practice_project: 'Refactor a legacy monolithic automation suite into an enterprise-grade data-driven framework with custom fixtures and reusable components.',
    lessons: [
      {
        id: 'm03-l01',
        title: 'Playwright Fixtures & Dependency Injection',
        duration: '60 mins',
        difficulty: 'Advanced',
        objective: 'Construct custom Playwright fixtures that inject fully authenticated Page Objects with clean setup and teardown phases.',
        whyItMatters: 'Traditional BeforeEach hooks suffer from fragile ordering and global state pollution in parallel execution. Playwright fixtures provide atomic, parallel-safe dependency injection.',
        concept: 'Fixtures are modular building blocks that define setup and teardown logic around tests. Fixtures only run when a test explicitly requests them, minimizing execution overhead.',
        minimalWorkingExample: `import { test as base, expect, Page } from '@playwright/test';
import { CheckoutPage } from '../pages/CheckoutPage';

// Define the fixture type interface
type EnterpriseFixtures = {
  authenticatedPage: Page;
  checkoutPage: CheckoutPage;
};

// Extend base test runner with custom fixtures
export const test = base.extend<EnterpriseFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // SETUP: Inject auth token or cookies
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('auth_token', 'mock_jwt_session'));
    
    // YIELD control to the test
    await use(page);

    // TEARDOWN: Clear session & audit logs
    await page.evaluate(() => localStorage.clear());
  },

  checkoutPage: async ({ authenticatedPage }, use) => {
    const checkout = new CheckoutPage(authenticatedPage);
    await use(checkout);
  },
});

export { expect };`,
        codeExplanation: [
          'base.extend registers typed fixtures available in any test simply by destructuring the argument list.',
          'await use(resource) marks the exact boundary where setup ends and the test executes.',
          'Code following use(resource) runs after test completion, even if the test fails (bulletproof teardown).'
        ],
        productionBestPractices: [
          'Compose fixtures hierarchically (e.g. checkoutPage depends on authenticatedPage).',
          'Use worker-scoped fixtures (scope: "worker") for heavy database seeding shared across a worker process.'
        ],
        commonMistakes: [
          'Setting global mutable variables outside fixtures, causing flaky cross-test contamination during parallel worker runs.',
          'Forgetting to await use() inside fixture implementation, causing the runner to hang.'
        ],
        interviewQuestion: {
          question: 'How do Playwright Fixtures solve the "flaky parallel execution" problem inherent in JUnit/TestNG @BeforeMethod?',
          answer: 'JUnit/TestNG @BeforeMethod often rely on static variables or shared class instances, which corrupt state when tests run concurrently across multiple threads. Playwright fixtures are strictly scoped to either the individual test or the worker process. The runner constructs an isolated dependency graph per test, ensuring zero state leak between parallel workers.'
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
    description: 'Integrate API testing via APIRequestContext for blazing fast backend data seeding, Dockerize test runners, and author production GitHub Actions CI/CD workflows.',
    topics: [
      'Playwright APIRequestContext architecture',
      'REST API test authoring: GET, POST, PUT, DELETE, PATCH',
      'Authentication headers, JWT injection & session reuse',
      'Hybrid UI/API testing patterns (Seed via API, Verify via UI)',
      'Intercepting & mocking network requests with page.route()',
      'Containerizing test runners with official Playwright Docker images',
      'GitHub Actions workflow automation & artifact uploading',
      'Jenkins pipeline orchestration & parallel worker sharding',
      'Playwright Trace Viewer deep diagnostics (DOM snapshots, console, network)',
      'Allure & HTML enterprise report generation'
    ],
    architecture_lab: 'Build a Dockerized CI pipeline that executes Playwright tests across 4 sharded workers, collects traces on failure, generates Allure reports, and uploads artifacts to GitHub Actions.',
    study_card: {
      code: 'SC-04',
      title: 'Hybrid UI-API Test Design Patterns',
      keyTakeaways: [
        'Seed prerequisites (create user, populate cart) via API in 50ms rather than spending 15 seconds navigating forms.',
        'Use request.newContext() to authenticate via backend endpoint and serialize storageState for instant browser context injection.',
        'Run Playwright tests in headless Linux containers using mcr.microsoft.com/playwright:v1.x.x-jammy for 100% CI parity.',
        'Configure trace: "retain-on-failure" to record full network traffic, DOM snapshots, and action screencasts with near-zero overhead.'
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
        concept: 'APIRequestContext allows tests to send HTTP requests directly from Node.js with cookie sharing. A test can POST an order via API, capture the generated orderId, and immediately open the browser at /orders/{id} to verify rendering.',
        minimalWorkingExample: `import { test, expect } from '@playwright/test';

test('fast hybrid test: seed order via API, verify invoice in UI', async ({ request, page }) => {
  // Step 1: Blazing fast backend seeding via API (35ms)
  const apiResponse = await request.post('/api/v1/orders', {
    headers: { 'Authorization': 'Bearer test_api_key' },
    data: {
      items: [{ sku: 'SKU-PRO-01', quantity: 2, price: 49.99 }],
      customerEmail: 'sdet_hybrid@enterprise.com'
    }
  });
  expect(apiResponse.status()).toBe(201);
  const { orderId } = await apiResponse.json();

  // Step 2: Targeted UI verification (Focus only on what matters for UI)
  await page.goto(\`/orders/\${orderId}\`);
  await expect(page.getByRole('heading', { name: \`Order #\${orderId}\` })).toBeVisible();
  await expect(page.getByTestId('total-amount')).toHaveText('$99.98');
});`,
        codeExplanation: [
          'request.post communicates directly with backend services without launching browser DOM rendering.',
          'Eliminates the need to walk through catalog selection, cart addition, and checkout forms.',
          'Tests remain robust against UI cosmetic tweaks in pre-requisite steps.'
        ],
        productionBestPractices: [
          'Always clean up seeded backend entities in test teardown or use isolated ephemeral databases.',
          'Reuse the same auth token between APIRequestContext and BrowserContext to eliminate redundant logins.'
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
      'Visual regression testing with pixelmatch & dynamic masking',
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
        'Visual regression tests must mask volatile elements (timestamps, ads, avatars) using locator.screenshot({ mask: [...] }).'
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
        minimalWorkingExample: `import { Page, Locator } from '@playwright/test';

export interface RecoveryProposal {
  originalLocator: string;
  proposedLocator: string;
  confidence: number;
  reasoning: string;
}

export async function smartLocator(
  page: Page,
  primarySelector: string,
  semanticFallback: { role: string; name: string | RegExp }
): Promise<Locator> {
  const locator = page.locator(primarySelector);
  try {
    // Attempt fast primary match (timeout 2000ms for recovery trial)
    await locator.waitFor({ state: 'attached', timeout: 2000 });
    return locator;
  } catch (error) {
    // Trigger recovery heuristic via accessibility tree
    console.warn(\`[AI Recovery] Primary locator "\${primarySelector}" failed. Healing...\`);
    const healed = page.getByRole(semanticFallback.role as any, { name: semanticFallback.name });
    await healed.waitFor({ state: 'visible', timeout: 5000 });
    console.log(\`[AI Recovery Success] Recovered using accessible role: \${semanticFallback.role}\`);
    return healed;
  }
}`,
        codeExplanation: [
          'Graceful degradation: Attempts fast primary selector before falling back to accessibility tree heuristics.',
          'Prevents test suite abortion while logging structured telemetry for developer review.',
          'Never executes unvetted arbitrary scripts; relies on Playwright typed getByRole primitives.'
        ],
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
        'Use JQL filters to correlate automated test results directly with Jira user stories for continuous compliance auditability.'
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
        minimalWorkingExample: `// Playwright test annotations tagging risk tier for targeted execution
import { test, expect } from '@playwright/test';

test('checkout payment processing @tier-1 @critical-risk', {
  annotation: [
    { type: 'risk-score', description: '25 (Impact: 5, Probability: 5)' },
    { type: 'jira-story', description: 'PROD-4091' }
  ]
}, async ({ page }) => {
  // Test implementation for highest revenue path
  await page.goto('/checkout');
  await expect(page.getByRole('button', { name: /confirm payment/i })).toBeEnabled();
});

// Run in CI with: npx playwright test --grep "@tier-1"`,
        codeExplanation: [
          'Annotations link automated test execution directly to Jira requirements and risk tiers.',
          'Enables CI pipelines to run blazing-fast 2-minute Tier-1 sanity runs on every Pull Request.',
          'Full regression suites can run on scheduled nightly cadences.'
        ],
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
        'System Design Rule of Thumb: Divide large suites using Playwright --shard=x/y across ephemeral cloud spot instances to cap total runtime at 10 minutes.',
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
        objective: 'Architect a distributed CI execution pipeline using Playwright sharding, spot containers, and artifact aggregation.',
        whyItMatters: 'As test suites grow from 200 to 5,000 tests, linear execution time exceeds 5 hours, paralyzing engineering deployment velocity. Architects must design sub-10 minute distributed grids.',
        concept: 'Playwright natively supports sharding via --shard=index/total. By orchestrating a matrix of 20 parallel runner jobs in GitHub Actions or AWS ECS, 5,000 tests execute concurrently in 1/20th the time. Blob reports are then merged into a single comprehensive HTML report.',
        minimalWorkingExample: `# GitHub Actions Sharded Execution Matrix
name: Distributed Test Grid
on: [push]

jobs:
  test-sharded:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4, 5]
        shardTotal: [5]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npx playwright test --shard=\${{ matrix.shardIndex }}/\${{ matrix.shardTotal }} --reporter=blob
      - uses: actions/upload-artifact@v4
        with:
          name: blob-report-\${{ matrix.shardIndex }}
          path: blob-report

  merge-reports:
    needs: test-sharded
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with: { path: all-blob-reports }
      - run: npx playwright merge-reports --reporter=html ./all-blob-reports`,
        codeExplanation: [
          'strategy.matrix dispatches multiple runner jobs simultaneously in parallel VMs.',
          'Each worker executes exactly 1/Nth of the test inventory without test overlap.',
          'merge-reports compiles all distributed blob reports into one unified HTML dashboard.'
        ],
        productionBestPractices: [
          'Budget 1 vCPU and 2GB RAM per worker to avoid CPU throttling and false timing failures.',
          'Store and merge blob reports in a central S3 bucket or GitHub Artifacts storage.'
        ],
        commonMistakes: [
          'Increasing workers beyond the backend test environment capacity, causing database connection exhaustion.',
          'Using fail-fast: true, which aborts all sibling shards if one test fails.'
        ],
        interviewQuestion: {
          question: 'How would you architect a Playwright test execution pipeline for 10,000 tests to run under 15 minutes?',
          answer: 'I would employ: 1) Playwright matrix sharding across 30-40 ephemeral Linux containers in AWS ECS/GitHub Actions, 2) Hybrid UI/API execution where 80% of preconditions are seeded via APIRequestContext, 3) Shared auth via pre-authenticated storageState JSON, 4) Blob reporting aggregation into a single dashboard, 5) Automatic quarantine of flaky tests, and 6) Local backend mock services with WireMock/Prism to avoid bottlenecking staging environments.'
        }
      }
    ]
  }
];

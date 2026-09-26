import { PlaywrightQuestion } from '../playwrightQuestions';

export const QUESTIONS_PART_1: PlaywrightQuestion[] = [
{
    id: 1,
    question: "What is Playwright?",
    shortAnswer: "Playwright is a next-generation test automation framework by Microsoft. It supports Chromium, WebKit, and Firefox, and enables reliable end-to-end testing for modern web apps.",
    category: "Architecture & Core",
    difficulty: "Beginner",
    tags: ["Overview", "Microsoft", "Cross-Browser", "E2E Testing"],
    detailedExplanation: [
      "Playwright is an open-source, automated testing and web scraping library created and actively maintained by Microsoft. It was engineered from the ground up to tackle the most notorious pain points in web testing: test flakiness, sluggish execution, and fragile element synchronization.",
      "Unlike traditional tools that rely on the HTTP-based W3C WebDriver specification, Playwright communicates directly with browser rendering engines over persistent WebSocket connections using proprietary debugging protocols (such as Chrome DevTools Protocol for Chromium).",
      "Key architectural superpowers include out-of-the-box support for modern Single Page Applications (SPAs), Progressive Web Apps (PWAs), Shadow DOM penetration, multi-page contexts, and seamless network traffic interception."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { test, expect } from '@playwright/test';

test('has title and navigates to documentation', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});`,
      explanation: "Standard modern Playwright test showcasing test fixture, auto-waiting locators, and web-first assertions."
    },
    proTip: "In interviews, highlight that Playwright was built by former Puppeteer engineers at Microsoft to address Puppeteer's Chromium-only limitation and Selenium's WebDriver latency.",
    commonFollowUp: "How does Playwright's architecture differ from Selenium and Cypress?"
  },
  {
    id: 2,
    question: "What are the key features of Playwright?",
    shortAnswer: "Auto-waiting, cross-browser support, parallel execution, tracing, screenshots, videos, network interception, device emulation, selectors (CSS, text, role, test id, etc.).",
    category: "Architecture & Core",
    difficulty: "Beginner",
    tags: ["Features", "Auto-waiting", "Tracing", "Parallelism"],
    detailedExplanation: [
      "Auto-Waiting & Actionability: Playwright automatically checks whether elements are visible, attached, stable, enabled, and editable before executing actions like clicks or keystrokes.",
      "True Cross-Browser Coverage: Single API driving Chromium (Chrome, Edge), WebKit (Safari), and Firefox across Windows, macOS, and Linux without third-party drivers.",
      "Isolated Browser Contexts: Superfast creation of incognito-like contexts in milliseconds, enabling fully independent parallel test runs without browser relaunch overhead.",
      "Network Interception & Mocking: Granular control over HTTP/HTTPS and WebSocket traffic. Stub mock APIs, inject latency, modify responses, or abort tracking scripts.",
      "Rich Post-Mortem Diagnostics: Full execution Tracing (DOM snapshots, network waterfall, console logs, timeline scrubber), screenshots, and step-by-step videos."
    ],
    codeSnippet: {
      language: "typescript",
      code: `// playwright.config.ts - showcasing key features enabled
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true, // Parallel execution across workers
  retries: 2,         // Auto-retries on failure
  workers: 4,
  use: {
    trace: 'on-first-retry', // Built-in Trace Viewer capture
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 13'] } },
  ],
});`,
      explanation: "Config demonstrating multi-browser projects, parallel worker configuration, and failure tracing."
    },
    proTip: "Group features into three pillars for interviews: Reliability (auto-waiting, web-first assertions), Capabilities (network mock, multi-tab, iframes), and Tooling (Trace Viewer, Codegen).",
    commonFollowUp: "Which feature has contributed most to reducing test flakiness in production suites?"
  },
  {
    id: 3,
    question: "What languages does Playwright support?",
    shortAnswer: "JavaScript/TypeScript, Python, .NET (C#), and Java.",
    category: "Architecture & Core",
    difficulty: "Beginner",
    tags: ["Languages", "TypeScript", "Python", "C#", "Java"],
    detailedExplanation: [
      "Playwright provides official first-party SDKs across 4 major language ecosystems: JavaScript / TypeScript (Node.js), Python (with async and sync APIs), .NET (C#, F#, VB), and Java.",
      "Under the hood, all language bindings communicate through a high-performance Node.js driver server process. This ensures that features (like auto-waiting, locators, and tracing) remain 100% consistent across all languages.",
      "While all languages are supported, TypeScript is widely regarded as the premier citizen in the Playwright ecosystem because Playwright Test Runner itself is built in TypeScript, offering the richest type checking, autocompletion, and community fixtures."
    ],
    codeSnippet: {
      language: "typescript",
      code: `// Python equivalent vs TypeScript syntax:
# Python (sync):
# from playwright.sync_api import sync_playwright
# with sync_playwright() as p:
#     browser = p.chromium.launch()
#     page = browser.new_page()
#     page.goto("https://playwright.dev")

// TypeScript:
import { test } from '@playwright/test';
test('sample', async ({ page }) => {
  await page.goto('https://playwright.dev');
});`,
      explanation: "Playwright delivers an identical mental model and API design across all client bindings."
    },
    proTip: "Mention that Python supports both synchronous (`sync_api`) and asynchronous (`async_api`) modes, whereas Node.js is exclusively Promise-based `async/await`.",
    commonFollowUp: "Does Python or C# have feature parity with TypeScript Playwright?"
  },
  {
    id: 4,
    question: "How is Playwright different from Selenium?",
    shortAnswer: "Auto-waiting, no WebDriver middle-layer, faster execution, reliable locators, built-in tracing & videos, and isolated lightweight browser contexts.",
    category: "Architecture & Core",
    difficulty: "Intermediate",
    tags: ["Selenium Comparison", "Architecture", "WebDriver vs CDP", "Speed"],
    detailedExplanation: [
      "Communication Protocol: Selenium relies on the W3C WebDriver HTTP protocol, where each command sends an HTTP request through an external browser driver binary (chromedriver, geckodriver). Playwright bypasses drivers and uses direct bidirectional WebSocket connections to browser debugging interfaces.",
      "Synchronization: In Selenium, testers frequently write explicit `WebDriverWait` loops or brittle `Thread.sleep()`. Playwright guarantees automatic actionability checks before every single interaction.",
      "Execution Speed & Sessions: Selenium requires launching a brand new browser process per test for isolation, which is heavy and slow. Playwright launches the browser once and spawns ultralight BrowserContexts (1-2ms) per test.",
      "Batteries Included: Selenium needs external libraries for reporting, test running, assertions, video capture, and mocking (e.g. TestNG + ExtentReports + BrowserMob Proxy). Playwright packages runner, assertions, mocking, codegen, and Trace Viewer together."
    ],
    codeSnippet: {
      language: "typescript",
      code: `// Selenium (Mental comparison):
// WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
// wait.until(ExpectedConditions.elementToBeClickable(By.id("submit"))).click();

// Playwright:
// One line - automatically checks attached, visible, stable, enabled & receives events!
await page.getByRole('button', { name: 'Submit' }).click();`,
      explanation: "No explicit wait boilerplate needed in Playwright."
    },
    proTip: "Do not disparage Selenium blindly in interviews; acknowledge Selenium's historical legacy and real Safari desktop driver, while articulating Playwright's modern architectural edge.",
    commonFollowUp: "Can Playwright run tests on real devices like Appium does with Selenium?"
  },
  {
    id: 5,
    question: "What are the components of Playwright?",
    shortAnswer: "Test Runner, Browser, BrowserContext, Page, Locator, Tracing, and Expect (assertions).",
    category: "Architecture & Core",
    difficulty: "Beginner",
    tags: ["Architecture", "Components", "Browser", "Context", "Page"],
    detailedExplanation: [
      "Playwright's hierarchical object model is designed for maximum performance, clean test isolation, and granular browser interaction:",
      "1. Browser: Represents an operating browser engine instance (Chromium, Firefox, or WebKit). Launching a browser is resource-intensive, so it is created once and reused.",
      "2. BrowserContext: An isolated 'incognito' profile inside a Browser instance. Holds its own independent cookies, localStorage, cache, and proxy settings.",
      "3. Page: An individual browser tab or popup window created inside a BrowserContext.",
      "4. Locator: A lazy, self-retrying reference to DOM elements. It encapsulates the mechanism to locate and verify elements at interaction time.",
      "5. Expect: Assertion engine featuring Web-First auto-retrying assertions.",
      "6. Test Runner & Tracing: Orchestrator that manages parallel workers, fixtures, reporters, and records zip trace files containing DOM snapshots and network dumps."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { chromium } from 'playwright';

// Manual component composition (what Playwright Test runner abstracts):
const browser = await chromium.launch({ headless: true }); // Browser
const context = await browser.newContext();                 // BrowserContext (isolated)
const page = await context.newPage();                       // Page (tab)

const searchInput = page.locator('#search');                 // Locator
await searchInput.fill('Playwright components');

await context.close();
await browser.close();`,
      explanation: "Manual instantiation illustrating the hierarchical ownership: Browser owns Contexts, Contexts own Pages."
    },
    proTip: "Draw or describe the 3-tier hierarchy: Browser -> BrowserContext -> Page. Interviewers look for this fundamental mental model.",
    commonFollowUp: "Can one BrowserContext interact with or leak state into another BrowserContext?"
  },
  {
    id: 6,
    question: "What is a BrowserContext in Playwright?",
    shortAnswer: "It is an isolated browser session with its own cookies, storage, and preferences, similar to an incognito profile.",
    category: "Architecture & Core",
    difficulty: "Intermediate",
    tags: ["BrowserContext", "Isolation", "Storage", "Incognito"],
    detailedExplanation: [
      "A BrowserContext is an entirely isolated browser session. Think of it as a completely independent Incognito window.",
      "Every context possesses its own cookies, HTML5 LocalStorage, SessionStorage, IndexedDB databases, cache, and HTTP credentials.",
      "Speed Advantage: Spawning a new Browser instance can take 1.5 - 3 seconds and consumes hundreds of megabytes of RAM. Creating a new BrowserContext takes ~10 milliseconds and consumes negligible RAM.",
      "Multi-User Testing: A single test can instantiate two separate contexts (e.g. `buyerContext` and `sellerContext`) in the same browser to test real-time chat, collaborative documents, or bidding without needing two different machines."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { test, expect } from '@playwright/test';

test('multi-user collaboration test', async ({ browser }) => {
  // Create User 1 context (Admin)
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  await adminPage.goto('https://myapp.com/admin');

  // Create User 2 context (Guest / Viewer)
  const guestContext = await browser.newContext();
  const guestPage = await guestContext.newPage();
  await guestPage.goto('https://myapp.com/viewer');

  // Actions in adminPage immediately show up in guestPage via WebSockets!
  await adminPage.getByRole('button', { name: 'Publish Article' }).click();
  await expect(guestPage.getByText('New Article Published!')).toBeVisible();

  await adminContext.close();
  await guestContext.close();
});`,
      explanation: "Two completely isolated users in separate contexts testing a multi-persona workflow in a single test."
    },
    proTip: "Highlight that Playwright Test Runner automatically assigns a fresh `context` and `page` fixture to every single test for zero cross-test contamination.",
    commonFollowUp: "How do you share authentication state across different contexts without logging in every time?"
  },
  {
    id: 7,
    question: "What is a Locator?",
    shortAnswer: "Locator is a way to find elements in Playwright using user-friendly and reliable strategies with lazy evaluation and auto-waiting.",
    category: "Locators & Interactions",
    difficulty: "Beginner",
    tags: ["Locator", "Role", "TestID", "Actionability", "Lazy Evaluation"],
    detailedExplanation: [
      "A Locator is the central abstraction in Playwright for inspecting and interacting with elements on the page.",
      "Lazy Evaluation: Unlike old `page.$(selector)` which immediately queries the DOM and returns an `ElementHandle` (or null if not loaded yet), a Locator is a descriptor. It only searches the DOM right when an action (e.g. `.click()`) or assertion (e.g. `expect().toBeVisible()`) is invoked.",
      "Strict Mode: By default, if a locator resolves to more than one DOM element when an action is performed, Playwright throws a `strict mode violation` error. This prevents accidentally clicking the wrong duplicate button.",
      "Recommended Priority: Playwright advocates user-facing locators: `page.getByRole()`, `page.getByText()`, `page.getByLabel()`, `page.getByPlaceholder()`, followed by `page.getByTestId()`."
    ],
    codeSnippet: {
      language: "typescript",
      code: `// Recommended user-facing locators:
const submitBtn = page.getByRole('button', { name: 'Submit Application' });
const emailInput = page.getByLabel('Work Email');
const passwordInput = page.getByPlaceholder('Enter 8+ characters');
const promoBanner = page.getByTestId('promotional-banner');

// Chaining and filtering locators:
const productCard = page.locator('.product-card')
  .filter({ hasText: 'Mechanical Keyboard' })
  .getByRole('button', { name: 'Add to Cart' });

await productCard.click();`,
      explanation: "Modern locator strategies prioritizing accessibility roles and resilient locator filtering."
    },
    proTip: "Explain why `getByRole` is superior: it mimics how screen readers and real users perceive the web, improving both test stability and web accessibility compliance.",
    commonFollowUp: "What happens if a locator matches 3 elements when calling .click()?"
  },
  {
    id: 8,
    question: "How is auto-waiting implemented in Playwright?",
    shortAnswer: "Playwright automatically waits for elements to satisfy actionability checks (attached, visible, stable, enabled, editable) before performing actions.",
    category: "Auto-Waiting & Assertions",
    difficulty: "Intermediate",
    tags: ["Auto-waiting", "Actionability", "Stability", "Timeout"],
    detailedExplanation: [
      "Auto-waiting is Playwright's flagship stability mechanism. Before executing any user action, Playwright runs a thorough battery of Actionability Checks on the target element.",
      "Actionability checks vary based on the specific action:",
      "- Attached: Element must be connected to the DOM document.",
      "- Visible: Element must have non-zero bounding box and not have `display: none` or `visibility: hidden`.",
      "- Stable: Element must have finished animations and CSS transitions (bounding rect unchanged across consecutive animation frames).",
      "- Receives Events: The hit point of the element is not obscured by sticky headers, modal backdrops, or overlays.",
      "- Enabled: Element does not have the `disabled` HTML attribute.",
      "- Editable: For typing actions, element must be enabled and not set to `readOnly`.",
      "If any condition fails, Playwright keeps retrying continuously until the action succeeds or the timeout (default 30 seconds) expires with a detailed error trace."
    ],
    codeSnippet: {
      language: "typescript",
      code: `// When you execute this single statement:
await page.getByRole('button', { name: 'Save Changes' }).click();

// Playwright automatically conducts in order:
// 1. Waits for element with role 'button' & name 'Save Changes' to attach
// 2. Waits for visibility (CSS opacity > 0, display !== none)
// 3. Waits for position stability (animation/scrolling stopped)
// 4. Waits for enabled state (button is not disabled)
// 5. Verifies click coordinates hit the button, not an overlay
// 6. Dispatches native pointerdown, pointerup, click events`,
      explanation: "The complete automated actionability sequence executed on every action."
    },
    proTip: "Mention that auto-waiting can be bypassed in emergency legacy scenarios with `{ force: true }`, but this should be avoided because it skips hit-testing and actionability verification.",
    commonFollowUp: "Which actionability checks are performed specifically for .fill() versus .click()?"
  },
  {
    id: 9,
    question: "What is the role of Expect?",
    shortAnswer: "Expect is used for assertions in Playwright. It has auto-retrying capability (Web-First Assertions) until the condition is met or timeout occurs.",
    category: "Auto-Waiting & Assertions",
    difficulty: "Beginner",
    tags: ["Expect", "Assertions", "Web-First", "Auto-retry"],
    detailedExplanation: [
      "`expect` is Playwright's built-in assertion library, heavily optimized for asynchronous web testing.",
      "Web-First Assertions: Traditional assertions (like Jest or Chai `expect(value).toBe(true)`) check state synchronously at an exact millisecond. If the page is still updating an animation or waiting for an API response, the test fails immediately.",
      "Playwright's web assertions (e.g. `await expect(locator).toHaveText('Success')`) continuously poll the DOM and retry until the assertion passes or the assertion timeout (default 5s) expires.",
      "Custom Matchers: Includes web-specific matchers like `toBeVisible()`, `toBeEnabled()`, `toHaveValue()`, `toHaveAttribute()`, `toHaveURL()`, and `toHaveScreenshot()`."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { test, expect } from '@playwright/test';

test('web-first assertions vs synchronous assertions', async ({ page }) => {
  await page.goto('https://example.com/checkout');
  const alert = page.locator('.alert-message');

  // ✅ Web-First Assertion: Auto-retries for up to 5s until text appears
  await expect(alert).toHaveText('Order confirmed successfully!', { timeout: 7000 });
  await expect(alert).toHaveClass(/alert-success/);

  // ❌ Anti-pattern (Avoid): Synchronous check without auto-retrying
  // const text = await alert.textContent(); // Reads at single instant
  // expect(text).toBe('Order confirmed successfully!'); // Fails if delayed!
});`,
      explanation: "Web-first assertions must always be awaited because they poll asynchronously."
    },
    proTip: "Never use synchronous expect (`expect(await locator.isVisible()).toBe(true)`). Always use `await expect(locator).toBeVisible()` to ensure the retry polling loop runs.",
    commonFollowUp: "What is the default timeout for Playwright expect assertions, and how can it be configured globally?"
  },
  {
    id: 10,
    question: "What is the difference between Page and Context?",
    shortAnswer: "Page represents a single tab or window. Context represents an isolated browser session that can contain multiple pages.",
    category: "Architecture & Core",
    difficulty: "Intermediate",
    tags: ["Page", "Context", "Tabs", "Hierarchy"],
    detailedExplanation: [
      "BrowserContext is the security and storage boundary. It owns cookies, permissions (geolocation, camera), certificates, offline status, and HTTP proxies.",
      "Page is the visual rendering surface (a single browser tab or popup). It belongs to exactly one BrowserContext.",
      "One Context can have 0, 1, or dozens of Pages. All pages within the same context share the same cookie jar, localStorage, and credentials.",
      "Lifecycle: Closing a Page only destroys that specific tab. Closing a BrowserContext immediately terminates all child pages and flushes temporary storage."
    ],
    codeSnippet: {
      language: "typescript",
      code: `// A Context managing two linked Pages (tabs):
const context = await browser.newContext();

const page1 = await context.newPage();
await page1.goto('https://myapp.com/dashboard');

// Click link that opens new tab with target="_blank"
const [page2] = await Promise.all([
  context.waitForEvent('page'),
  page1.getByText('Open External Reports').click()
]);

// Both pages share the exact same login cookie:
console.log(await page1.title());
console.log(await page2.title());

// Cleanup
await context.close(); // Closes page1 and page2 simultaneously`,
      explanation: "Context acting as parent session container managing multiple child page tabs."
    },
    proTip: "Use the tab vs profile analogy: Context = Google Chrome user profile / incognito instance; Page = a single Chrome tab inside that window.",
    commonFollowUp: "If a user logs in on Page A, is Page B in the same Context automatically logged in?"
  },
  {
    id: 11,
    question: "How do you handle a browser in Playwright?",
    shortAnswer: "Using browser.launch() to start and browser.close() to close, or letting the Playwright Test runner manage fixtures automatically.",
    category: "Architecture & Core",
    difficulty: "Beginner",
    tags: ["Browser Lifecycle", "launch", "close", "Fixtures"],
    detailedExplanation: [
      "In standalone scripts, you launch a browser using the engine type: `chromium.launch()`, `firefox.launch()`, or `webkit.launch()`.",
      "Launch options include `headless: boolean`, `slowMo: number` (delay per operation), `channel: 'chrome' | 'msedge'`, and `args` (command line flags).",
      "Always ensure `await browser.close()` is called in a `finally` block or clean shutdown hook to prevent zombie browser processes from consuming CPU and memory on your machine.",
      "In `@playwright/test`, the runner automatically manages browser lifecycle using worker pools, so you rarely invoke `browser.launch()` manually in standard test files."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { chromium } from 'playwright';

async function runAutomation() {
  const browser = await chromium.launch({
    headless: false,       // Open visible browser window
    slowMo: 100,           // Slow down execution by 100ms for demo
    devtools: true,        // Open Chrome DevTools automatically
  });

  try {
    const page = await browser.newPage();
    await page.goto('https://github.com');
  } finally {
    // Crucial: Guarantee cleanup even if errors occur above
    await browser.close();
  }
}`,
      explanation: "Manual launch with debugging options and safe `finally` disposal."
    },
    proTip: "Mention the `channel: 'chrome'` option when clients specifically require testing on Google Chrome instead of open-source Chromium.",
    commonFollowUp: "What is the difference between Chromium and Google Chrome in Playwright?"
  },
  {
    id: 12,
    question: "What is the use of Headless mode in Playwright?",
    shortAnswer: "Headless mode runs tests without opening a UI. It is faster, uses less memory, and is essential for CI/CD environments without graphical displays.",
    category: "Test Runner, CI/CD & Config",
    difficulty: "Beginner",
    tags: ["Headless", "Headful", "CI/CD", "Performance"],
    detailedExplanation: [
      "In Headless mode, the browser engine executes all rendering, JavaScript, layout computation, and network activity entirely in memory without painting to a physical OS display window.",
      "CI/CD Compatibility: Cloud runners (GitHub Actions, Jenkins, Docker containers) typically run Linux servers without an X11/Wayland display server. Headless mode runs natively in these environments without requiring virtual framebuffer hacks like Xvfb.",
      "Execution Speed: Saves significant CPU and GPU cycles because the OS doesn't render window frames or composited pixels, speeding up parallel test suites by 30-50%.",
      "Playwright uses modern 'new headless' mode in Chromium (`--headless=new`), which matches 100% of headed rendering behavior unlike old legacy headless modes."
    ],
    codeSnippet: {
      language: "typescript",
      code: `// Run from CLI:
// npx playwright test                    // Default is headless in config
// npx playwright test --headed          // Toggle to headed mode for debugging

// Or configure conditionally in playwright.config.ts:
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: process.env.CI ? true : false, // Headed locally, headless on CI
  },
});`,
      explanation: "Dynamic headless configuration toggled based on CI environment variables."
    },
    proTip: "Chromium's modern 'new headless' mode behaves identically to headed mode, eliminating ancient bugs where fonts or CSS rendered differently in headless.",
    commonFollowUp: "When might a test pass in headed mode but fail in headless mode?"
  },
  {
    id: 13,
    question: "How do you capture screenshot in Playwright?",
    shortAnswer: "Using page.screenshot() for whole page or locator.screenshot() for specific components, with options for fullPage and visual regression comparisons.",
    category: "Debugging & Tracing",
    difficulty: "Beginner",
    tags: ["Screenshots", "Visual Regression", "Full Page", "locator.screenshot"],
    detailedExplanation: [
      "Playwright allows capturing pixel-accurate PNG/JPEG images at multiple levels:",
      "1. Viewport Screenshot: `await page.screenshot({ path: 'view.png' })` captures the current visible viewport.",
      "2. Full Page Screenshot: `await page.screenshot({ path: 'full.png', fullPage: true })` scrolls the entire document height and stitches the canvas.",
      "3. Component / Locator Screenshot: `await locator.screenshot({ path: 'card.png' })` clips strictly to the element's bounding box.",
      "4. Visual Regression Testing: `await expect(page).toHaveScreenshot('landing.png')` automatically compares captured image against golden baseline images and flags pixel diffs."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { test, expect } from '@playwright/test';

test('screenshot examples', async ({ page }) => {
  await page.goto('https://playwright.dev');

  // Full page snapshot
  await page.screenshot({ path: 'screenshots/homepage.png', fullPage: true });

  // Single component snapshot (e.g., hero card)
  const hero = page.locator('.hero');
  await hero.screenshot({ path: 'screenshots/hero-banner.png' });

  // Visual snapshot comparison with pixel threshold:
  await expect(page).toHaveScreenshot('homepage-baseline.png', {
    maxDiffPixels: 50,
  });
});`,
      explanation: "Demonstration of viewport, element-specific, and golden visual comparison screenshots."
    },
    proTip: "In visual regression tests, always use `animations: 'disabled'` and mask dynamic elements (like timestamps or avatars) using the `mask: [locator]` option.",
    commonFollowUp: "How do you mask sensitive user data (like passwords or credit card numbers) in screenshots?"
  },
  {
    id: 14,
    question: "How do you record video in Playwright?",
    shortAnswer: "Configure the video option in browser context or playwright.config.ts to record test execution to WebM format.",
    category: "Sessions, Auth & Dialogs",
    difficulty: "Intermediate",
    tags: ["Video", "Recording", "Debugging", "playwright.config"],
    detailedExplanation: [
      "Playwright has built-in native video recording without requiring external software like OBS or FFmpeg.",
      "It records tests into standard `.webm` video files directly through browser engine screencast streams.",
      "Available modes: `'off'`, `'on'` (records every test), `'retain-on-failure'` (records all, but automatically deletes videos of passing tests to save disk space), or `'on-first-retry'`.",
      "Video files are finalized and flushed to disk when the `BrowserContext` closes. You can access the saved path via `page.video()?.path()`."
    ],
    codeSnippet: {
      language: "typescript",
      code: `// In playwright.config.ts:
export default defineConfig({
  use: {
    video: {
      mode: 'retain-on-failure', // Most optimal for CI pipelines
      size: { width: 1280, height: 720 },
    },
  },
});

// Or programmatically during context creation:
const context = await browser.newContext({
  recordVideo: {
    dir: './test-results/videos/',
    size: { width: 1280, height: 720 },
  },
});`,
      explanation: "Configuring automatic video capture with retain-on-failure policy."
    },
    proTip: "Recommend `retain-on-failure` for CI pipelines. Recording video for thousands of passing tests consumes gigabytes of CI artifact storage.",
    commonFollowUp: "Can you change video resolution during test execution?"
  },
  {
    id: 15,
    question: "How do you handle multiple tabs in Playwright?",
    shortAnswer: "Use context.pages() to get all pages and switch using page.bringToFront(), or wait for new tabs via context.waitForEvent('page').",
    category: "Sessions, Auth & Dialogs",
    difficulty: "Intermediate",
    tags: ["Multiple Tabs", "context.waitForEvent", "bringToFront", "target=_blank"],
    detailedExplanation: [
      "When a button or link has `target='_blank'`, clicking it spawns a new tab in the same browser context.",
      "Unlike Selenium where you have to call `driver.getWindowHandles()` and loop over string window IDs, Playwright uses modern Promise event handling with `context.waitForEvent('page')`.",
      "Always set up the listener `Promise.all` BEFORE triggering the click action to avoid race conditions where the tab opens before the listener attaches.",
      "You can switch between tabs seamlessly by addressing the corresponding `Page` object directly without needing to switch active focus, or call `await page.bringToFront()` if visual focus is needed."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { test, expect } from '@playwright/test';

test('handling external link opening in new tab', async ({ context, page }) => {
  await page.goto('https://example.com');

  // Trigger click and wait for new tab in parallel:
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: 'Help Documentation' }).click(),
  ]);

  // Wait for new page DOM to load
  await newPage.waitForLoadState();
  
  // Interact with new tab directly!
  await expect(newPage).toHaveTitle(/Help & Support/);
  await newPage.getByRole('searchbox').fill('Billing FAQs');

  // Switch back to original tab
  await page.bringToFront();
  await page.getByRole('button', { name: 'Close Modal' }).click();
});`,
      explanation: "Using Promise.all to capture the popup page event concurrently with the click."
    },
    proTip: "Emphasize why `Promise.all` is crucial here: if you click first and then `await context.waitForEvent('page')`, fast browsers might emit the event before your listener is registered.",
    commonFollowUp: "What happens if a link opens two tabs at once?"
  },
  {
    id: 16,
    question: "How do you handle popups in Playwright?",
    shortAnswer: "Use page.waitForEvent('popup') to capture and interact with new window popups triggered by page actions.",
    category: "Sessions, Auth & Dialogs",
    difficulty: "Intermediate",
    tags: ["Popups", "waitForEvent", "OAuth Popup", "window.open"],
    detailedExplanation: [
      "In browser automation, 'popups' can refer to two distinct things: browser dialogs (alert/confirm/prompt) and new browser windows opened via `window.open()`.",
      "For `window.open()` popups (such as third-party Google/GitHub OAuth login popups), use `page.waitForEvent('popup')`.",
      "This pattern waits specifically for the current page to spawn a popup window and returns a standard `Page` instance.",
      "Once you have the popup `Page` object, you can execute all normal page methods (`fill`, `click`, `waitForURL`, etc.) and then call `await popup.close()` when complete."
    ],
    codeSnippet: {
      language: "typescript",
      code: `test('OAuth sign in popup window', async ({ page }) => {
  await page.goto('https://myapp.com/login');

  // Expect popup event when clicking OAuth button
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Sign in with GitHub' }).click();
  const popup = await popupPromise;

  // Interact with popup
  await popup.waitForLoadState();
  await popup.getByLabel('Username or email address').fill('octocat');
  await popup.getByLabel('Password').fill('secret123');
  await popup.getByRole('button', { name: 'Sign in' }).click();

  // After authentication finishes, popup closes itself
  await popup.waitForEvent('close');

  // Assert main page updated to dashboard
  await expect(page).toHaveURL(/.*dashboard/);
});`,
      explanation: "Complete OAuth popup authentication flow handling popup lifecycle."
    },
    proTip: "Distinguish clearly between dialogs (`page.on('dialog')`) and window popups (`page.waitForEvent('popup')`). Interviewers love checking if candidates know the difference.",
    commonFollowUp: "How do you verify a popup was automatically closed by the application?"
  },
  {
    id: 17,
    question: "How do you handle frames in Playwright?",
    shortAnswer: "Use frameLocator() or contentFrame() to interact seamlessly with elements inside iframes.",
    category: "Locators & Interactions",
    difficulty: "Intermediate",
    tags: ["Frames", "iFrame", "frameLocator", "Nested Frames"],
    detailedExplanation: [
      "In older tools (Selenium), interacting with an `<iframe>` required switching the entire driver context into the frame (`driver.switchTo().frame()`) and remember to switch back to the parent frame (`defaultContent()`).",
      "Playwright revolutionized this with `frameLocator()`. It produces a locator that operates inside the frame while preserving full auto-waiting and actionability checks.",
      "Frame locators can be chained indefinitely for nested frames: `page.frameLocator('#outer').frameLocator('#inner').getByRole('button')`.",
      "You never need to 'switch context back' because the locator itself encapsulates the traversal path."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { test, expect } from '@playwright/test';

test('interacting with payment iframe', async ({ page }) => {
  await page.goto('https://ecommerce.example.com/checkout');

  // Target iframe by selector
  const stripeFrame = page.frameLocator('iframe[name="stripe-card-element"]');

  // Interact with input inside iframe with auto-waiting:
  await stripeFrame.getByPlaceholder('Card number').fill('4242 4242 4242 4242');
  await stripeFrame.getByPlaceholder('MM / YY').fill('12/28');
  await stripeFrame.getByPlaceholder('CVC').fill('888');

  // Back on main page - no switchTo().defaultContent() needed!
  await page.getByRole('button', { name: 'Place Order' }).click();
});`,
      explanation: "Clean iframe interaction without driver context switching."
    },
    proTip: "Remember that `frameLocator()` locators are strict and lazy, just like normal element locators.",
    commonFollowUp: "How do you access the frame's URL or page document directly?"
  },
  {
    id: 18,
    question: "How do you run tests in parallel?",
    shortAnswer: "Use fullyParallel in playwright.config.ts or pass --workers CLI argument to execute tests concurrently across worker processes.",
    category: "Test Runner, CI/CD & Config",
    difficulty: "Intermediate",
    tags: ["Parallelism", "Workers", "fullyParallel", "Concurrency"],
    detailedExplanation: [
      "Playwright tests run in parallel by launching multiple independent OS worker processes.",
      "File-level vs Test-level Parallelism: By default, Playwright runs separate test files in parallel, while tests inside the same file run sequentially.",
      "With `fullyParallel: true`, Playwright runs every individual `test()` block inside all files in parallel.",
      "Each worker process gets its own dedicated browser instance and creates fresh BrowserContexts for each test.",
      "Workers communicate test results back to the main runner process via IPC (Inter-Process Communication)."
    ],
    codeSnippet: {
      language: "typescript",
      code: `// In playwright.config.ts:
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Run all tests in all files in parallel
  fullyParallel: true,

  // Limit workers based on hardware or CI capacity:
  workers: process.env.CI ? 2 : '50%', // 50% of available CPU cores locally

  // For a single file that MUST run sequentially:
  // test.describe.configure({ mode: 'serial' });
});

// Or via CLI:
// npx playwright test --workers=4`,
      explanation: "Configuring parallel worker concurrency and serial execution fallbacks."
    },
    proTip: "Always advise making tests atomic and independent. Parallelism will fail if tests share static backend state or database rows.",
    commonFollowUp: "How do you run a specific test file serially when global fullyParallel is enabled?"
  },
  {
    id: 19,
    question: "How do you configure test retries?",
    shortAnswer: "Set the retries option in playwright.config.ts or pass --retries=2 via CLI to automatically re-run failed tests.",
    category: "Test Runner, CI/CD & Config",
    difficulty: "Beginner",
    tags: ["Retries", "Flakiness", "CI/CD", "playwright.config"],
    detailedExplanation: [
      "Retries automatically rerun failed tests to differentiate between persistent bugs and transient infrastructure flakes.",
      "Best Practice Configuration: Set `retries: 2` on CI environments, and `retries: 0` locally so developers see failures immediately during development.",
      "Flaky Status: If a test fails on attempt 1 but passes on retry 1, Playwright marks the test as 'flaky' (yellow/orange) in test reports rather than purely green, alerting the team to investigate.",
      "Artifacts on Retry: Combined with `trace: 'on-first-retry'`, Playwright only records heavy zip trace logs on retry attempts, saving immense disk space."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Retry 2 times on CI, no retries locally
  retries: process.env.CI ? 2 : 0,

  use: {
    // Only capture trace and video when a test fails and retries!
    trace: 'on-first-retry',
    video: 'on-first-retry',
  },
});`,
      explanation: "Production pattern pairing CI retries with conditional trace capture."
    },
    proTip: "Retries should be a safety net in CI, not an excuse to ignore flaky tests. Teams should monitor the 'Flaky' metric in Playwright reports.",
    commonFollowUp: "What is the difference between a 'failed' test and a 'flaky' test in Playwright reports?"
  },
  {
    id: 20,
    question: "How do you capture API response in Playwright?",
    shortAnswer: "Use page.waitForResponse() or listen to page.on('response') to inspect network status, headers, and JSON body payloads.",
    category: "Network & API Mocking",
    difficulty: "Intermediate",
    tags: ["API Response", "waitForResponse", "Network Inspection", "JSON"],
    detailedExplanation: [
      "Validating network responses directly in E2E tests is one of Playwright's most powerful capabilities.",
      "Pattern 1: `page.waitForResponse(predicate)`: Waits for a specific network response matching a URL glob, RegExp, or predicate function. Use this concurrently with the UI action using `Promise.all`.",
      "Pattern 2: Event Listener `page.on('response', resp => ...)`: Continuously monitors all responses passing through the browser.",
      "You can inspect HTTP status code (`response.status()`), response headers (`response.headers()`), and parse payload (`await response.json()`)."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { test, expect } from '@playwright/test';

test('verify backend response payload on form submit', async ({ page }) => {
  await page.goto('https://myapp.com/profile');

  // Trigger click and await API response simultaneously
  const [response] = await Promise.all([
    page.waitForResponse(res => 
      res.url().includes('/api/user/update') && res.status() === 200
    ),
    page.getByRole('button', { name: 'Save Profile' }).click(),
  ]);

  // Inspect the captured JSON payload from the server:
  const body = await response.json();
  expect(body.success).toBe(true);
  expect(body.user.role).toBe('ADMIN');
});`,
      explanation: "Using `waitForResponse` to guarantee backend verification alongside frontend UI assertion."
    },
    proTip: "Always use predicate functions with `res.status() === 200` to ensure your test doesn't accidentally capture an early 500 error response.",
    commonFollowUp: "What is the difference between page.waitForResponse() and page.waitForRequest()?"
  },
  {
    id: 21,
    question: "How do you mock APIs in Playwright?",
    shortAnswer: "Use page.route() to intercept HTTP requests and fulfill them with mock data, custom status codes, or modified headers.",
    category: "Network & API Mocking",
    difficulty: "Intermediate",
    tags: ["Mocking", "page.route", "route.fulfill", "Network Interception"],
    detailedExplanation: [
      "`page.route()` (or `context.route()`) intercepts outgoing network requests at the browser engine layer before they hit the wire.",
      "Mocking with `route.fulfill()`: Supply synthetic JSON payloads, status codes, and headers. The real backend server is never called.",
      "Modifying Live Requests (`route.continue()` or `route.fetch()`): You can call the real API, inspect the live response, tamper with a few properties, and return the modified response to the frontend.",
      "Aborting Requests (`route.abort()`): Instantly drop requests to block slow 3rd-party trackers, analytics, or simulate offline failures."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { test, expect } from '@playwright/test';

test('mock weather API with custom response', async ({ page }) => {
  // Intercept any request matching the weather endpoint:
  await page.route('**/api/weather', async (route) => {
    // Return mock JSON response
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        city: 'San Francisco',
        temp: 72,
        condition: 'Sunny',
      }),
    });
  });

  await page.goto('https://myapp.com/dashboard');
  
  // UI renders our mocked data reliably without depending on 3rd-party weather server!
  await expect(page.getByText('72° Sunny')).toBeVisible();
});`,
      explanation: "Intercepting an API call and fulfilling it with deterministic mock JSON."
    },
    proTip: "Mock third-party dependencies (Stripe, payment gateways, live weather) to avoid rate limits and flakiness, while keeping core backend APIs real for true E2E confidence.",
    commonFollowUp: "How can you modify a real API response rather than replacing it entirely?"
  },
  {
    id: 22,
    question: "How do you handle authentication in Playwright?",
    shortAnswer: "Use storageState to save authenticated session cookies and local storage to a JSON file once and reuse it across all tests.",
    category: "Sessions, Auth & Dialogs",
    difficulty: "Advanced",
    tags: ["Authentication", "storageState", "Global Setup", "Session Reuse"],
    detailedExplanation: [
      "Traditional testing re-logs in via the UI before every single test (`beforeEach`), adding 5-10 seconds per test and stressing the authentication server.",
      "Playwright's `storageState` captures all cookies, local storage items, and session storage into a lightweight JSON file after a single login.",
      "All other tests in your suite can boot with this `storageState` pre-loaded into their BrowserContext. When the browser opens, it is already authenticated!",
      "Modern implementation uses Playwright's **Project Dependencies**: An `auth.setup.ts` project runs first, logs in, writes `.auth/user.json`, and subsequent projects declare `dependencies: ['setup']`."
    ],
    codeSnippet: {
      language: "typescript",
      code: `// 1. auth.setup.ts - Runs once before all tests
import { test as setup, expect } from '@playwright/test';

const authFile = '.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('https://myapp.com/login');
  await page.getByLabel('Username').fill('testuser@company.com');
  await page.getByLabel('Password').fill('SuperSecretPassword!');
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page.getByText('Welcome back')).toBeVisible();

  // Save session cookies & storage:
  await page.context().storageState({ path: authFile });
});

// 2. In normal tests:
// import { test } from '@playwright/test';
// test.use({ storageState: '.auth/user.json' }); // Already logged in!`,
      explanation: "Global setup authentication project saving credentials to storageState."
    },
    proTip: "For multi-role systems (e.g. Admin, Editor, Viewer), create multiple storageState files (`admin.json`, `editor.json`) during setup and assign them via `test.use()` per file.",
    commonFollowUp: "How do you handle OAuth 2FA / MFA authentication tokens in CI?"
  },
  {
    id: 23,
    question: "How do you integrate Playwright with CI/CD?",
    shortAnswer: "Install dependencies, run npx playwright install --with-deps, execute tests via npx playwright test, and upload test reports as artifacts.",
    category: "Test Runner, CI/CD & Config",
    difficulty: "Intermediate",
    tags: ["CI/CD", "GitHub Actions", "Docker", "Artifacts"],
    detailedExplanation: [
      "Playwright is engineered for continuous integration environments. It provides official Docker images and pre-configured GitHub Actions workflows.",
      "Key Pipeline Steps:",
      "1. Checkout repository code.",
      "2. Setup Node.js runtime and run `npm ci`.",
      "3. Install Playwright browser binaries and required OS shared libraries via `npx playwright install --with-deps`.",
      "4. Run test suite: `npx playwright test`.",
      "5. Publish and archive the HTML test report artifact on job completion or failure.",
      "Sharding: For huge test suites, Playwright supports native horizontal sharding across multiple parallel CI machine nodes (`--shard=1/4`, `--shard=2/4`, etc.)."
    ],
    codeSnippet: {
      language: "yaml",
      code: `# .github/workflows/playwright.yml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    timeout-minutes: 30
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14`,
      explanation: "Standard production GitHub Actions pipeline with dependency caching and report archiving."
    },
    proTip: "Always use `if: always()` on the artifact upload step so that test reports and failure traces are preserved even when the test step fails.",
    commonFollowUp: "How does test sharding work in Playwright across multiple CI runners?"
  },
  {
    id: 24,
    question: "How do you debug tests in Playwright?",
    shortAnswer: "Use Playwright Inspector (--debug), VS Code Extension, headed mode (--headed), PWDEBUG=1, Trace Viewer, or page.pause().",
    category: "Debugging & Tracing",
    difficulty: "Beginner",
    tags: ["Debugging", "Inspector", "VS Code", "page.pause", "PWDEBUG"],
    detailedExplanation: [
      "Playwright provides a first-class debugging developer experience with several complementary tools:",
      "1. Playwright Inspector: Run `npx playwright test --debug`. Launches a dedicated GUI window where you can step through lines, view locators, and edit selectors live in the browser.",
      "2. Official VS Code Extension: Place breakpoints directly in the editor, step over/into code, and see live green locator highlights right on the webpage.",
      "3. Code Breakpoints with `page.pause()`: Inserting `await page.pause()` in your code freezes execution at that line and opens the Inspector.",
      "4. PWDEBUG Flag: Running `PWDEBUG=1 npx playwright test` enables headed mode with automatic devtools and disables timeouts.",
      "5. Trace Viewer: Post-mortem time-travel debugging with DOM snapshots at every action."
    ],
    codeSnippet: {
      language: "typescript",
      code: `// Terminal command to debug:
// npx playwright test tests/login.spec.ts --debug

// Inside test code:
test('debug complex form', async ({ page }) => {
  await page.goto('/complex-form');
  await page.getByRole('textbox', { name: 'Name' }).fill('Alice');

  // Programmatic breakpoint - pauses test and opens inspector here:
  await page.pause();

  await page.getByRole('button', { name: 'Submit' }).click();
});`,
      explanation: "Using `page.pause()` for interactive in-browser breakpoint debugging."
    },
    proTip: "Use the 'Record new' button in the VS Code extension to generate test code by simply clicking elements in a live browser session.",
    commonFollowUp: "What is the difference between console.log debugging and using Trace Viewer?"
  },
  {
    id: 25,
    question: "How do you generate test report in Playwright?",
    shortAnswer: "Use npx playwright show-report to view the built-in HTML report, or configure reporters like html, json, junit, or dot in config.",
    category: "Test Runner, CI/CD & Config",
    difficulty: "Beginner",
    tags: ["Reporters", "HTML Report", "JUnit", "show-report"],
    detailedExplanation: [
      "Playwright features built-in reporters that can be used individually or combined simultaneously.",
      "HTML Reporter (Default): Produces a self-contained static interactive web page that displays test duration, worker distribution, pass/fail status, attached screenshots, videos, and embedded Trace Viewer links.",
      "CLI Command: To view the last run's HTML report, simply execute `npx playwright show-report`.",
      "CI Integration: Configure `junit` reporter to output XML test results directly consumed by Jenkins, GitLab CI, or GitHub Actions check-runs.",
      "Custom Reporters: You can write custom TypeScript classes implementing the `Reporter` interface to send test results to Slack, Datadog, or Jira."
    ],
    codeSnippet: {
      language: "typescript",
      code: `// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Combine multiple reporters:
  reporter: [
    ['list'],                                  // Terminal live stdout
    ['html', { open: 'never' }],               // Interactive HTML report
    ['junit', { outputFile: 'results.xml' }],  // CI test result XML
    ['json', { outputFile: 'results.json' }],  // Machine-readable data
  ],
});`,
      explanation: "Configuring multi-reporter output for both developers and automated CI pipelines."
    },
    proTip: "In CI environments, pass `{ open: 'never' }` to the HTML reporter so the process doesn't attempt to launch a local browser server on headless machines.",
    commonFollowUp: "Can you combine traces and screenshots directly into the HTML report?"
  },
  {
    id: 26,
    question: "What is Page Object Model (POM) in Playwright?",
    shortAnswer: "POM is a design pattern that creates reusable, maintainable test code by encapsulating page locators and interaction methods into classes.",
    category: "Advanced Testing & Best Practices",
    difficulty: "Intermediate",
    tags: ["POM", "Page Object Model", "Design Patterns", "Maintainability"],
    detailedExplanation: [
      "The Page Object Model (POM) is an industry-standard architectural pattern for test automation.",
      "Core Principle: Tests should describe WHAT is being tested (user intent), while Page Objects describe HOW to interact with the underlying DOM (implementation details).",
      "Benefits:",
      "- Single Source of Truth: When a button ID or selector changes, you update it in ONE page object class, rather than across 50 separate test files.",
      "- Code Reusability: Common multi-step workflows (login, checkout, search) are encapsulated into reusable methods.",
      "- Type Safety: In TypeScript, Page Objects provide strict method parameter checking and autocompletion."
    ],
    codeSnippet: {
      language: "typescript",
      code: `// pages/LoginPage.ts
import { type Locator, type Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Log In' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, pass: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }
}

// In test file:
// const loginPage = new LoginPage(page);
// await loginPage.goto();
// await loginPage.login('alice', 'secret');`,
      explanation: "Complete TypeScript Page Object class encapsulating locators and actions."
    },
    proTip: "In modern Playwright, pair Page Objects with custom **Test Fixtures** (`test.extend<{ loginPage: LoginPage }>`) so the test runner instantiates and injects them automatically.",
    commonFollowUp: "Should assertions live inside Page Object methods or inside the test files?"
  },
  {
    id: 27,
    question: "How do you wait in Playwright?",
    shortAnswer: "Prefer auto-waiting and web-first assertions. For explicit waits, use locator.waitFor() or waitForResponse(). Avoid hardcoded page.waitForTimeout().",
    category: "Auto-Waiting & Assertions",
    difficulty: "Intermediate",
    tags: ["Waiting Strategies", "waitForSelector", "waitForTimeout", "Explicit Waits"],
    detailedExplanation: [
      "Playwright eliminates 95% of explicit wait boilerplate through its automated synchronization mechanisms.",
      "1. Auto-Waiting (Default & Best): Handled implicitly before clicks, typing, and checks.",
      "2. Web-First Assertions: `await expect(locator).toBeVisible()` auto-waits with custom retries.",
      "3. Explicit Locator Wait: `await locator.waitFor({ state: 'visible' | 'hidden' | 'attached' })` when you need to confirm DOM state without clicking.",
      "4. Network Wait: `await page.waitForResponse('/api/data')` or `await page.waitForLoadState('networkidle')`.",
      "5. The Anti-Pattern: `await page.waitForTimeout(5000)` (hard sleep). This causes tests to run needlessly slow, masks underlying race conditions, and will still flake under variable CPU load."
    ],
    codeSnippet: {
      language: "typescript",
      code: `// ✅ Recommended: Explicit locator state wait
const spinner = page.getByTestId('loading-spinner');
await spinner.waitFor({ state: 'detached' }); // Wait for loader to disappear

// ✅ Recommended: Web-first assertion wait
await expect(page.getByText('Transaction Complete')).toBeVisible();

// ❌ Anti-pattern: Hardcoded sleep (Avoid in production suites!)
// await page.waitForTimeout(3000);`,
      explanation: "Condition-based waiting strategies versus brittle hardcoded timeouts."
    },
    proTip: "If an interviewer asks 'How do you do Thread.sleep in Playwright?', explain `page.waitForTimeout()`, but immediately state that it is considered a code smell in modern Playwright.",
    commonFollowUp: "Why is 'networkidle' load state sometimes risky to use in Single Page Applications?"
  },
  {
    id: 28,
    question: "How do you handle file upload in Playwright?",
    shortAnswer: "Use setInputFiles() on an input[type='file'] locator to upload single or multiple files directly without OS dialogs.",
    category: "Locators & Interactions",
    difficulty: "Intermediate",
    tags: ["File Upload", "setInputFiles", "fileChooser", "Attachments"],
    detailedExplanation: [
      "In traditional manual testing, clicking an upload button triggers the native OS file picker dialog, which web automation cannot interact with.",
      "Playwright bypasses native OS file dialogs completely by directly setting files on the `<input type='file'>` DOM element via `locator.setInputFiles()`.",
      "You can pass a single file path, an array of multiple paths, or in-memory file buffers with custom mime types.",
      "For dynamic upload buttons without an accessible input tag, use `page.waitForEvent('filechooser')` concurrently with the button click."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { test, expect } from '@playwright/test';
import path from 'path';

test('file upload test', async ({ page }) => {
  await page.goto('/upload');

  // Direct approach on file input:
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(path.join(__dirname, 'test-document.pdf'));

  // Multiple files upload:
  // await fileInput.setInputFiles(['doc1.pdf', 'doc2.png']);

  // Reset/Clear uploaded files:
  // await fileInput.setInputFiles([]);

  // Dynamic file chooser event approach:
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Upload Avatar' }).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles('avatar.png');

  await expect(page.getByText('Upload Successful')).toBeVisible();
});`,
      explanation: "Using `setInputFiles` and the `filechooser` event to upload attachments."
    },
    proTip: "Mention that you can also upload files directly from memory buffers without writing files to disk using `{ name: 'report.csv', mimeType: 'text/csv', buffer: Buffer.from('...') }`.",
    commonFollowUp: "How do you test file download functionality in Playwright?"
  },
  {
    id: 29,
    question: "How do you handle scrolling in Playwright?",
    shortAnswer: "Playwright auto-scrolls elements into view automatically. For manual control, use locator.scrollIntoViewIfNeeded() or page.mouse.wheel().",
    category: "Locators & Interactions",
    difficulty: "Intermediate",
    tags: ["Scrolling", "scrollIntoViewIfNeeded", "mouse.wheel", "Auto-scroll"],
    detailedExplanation: [
      "Automatic Scrolling: Whenever you call an action like `locator.click()`, `locator.hover()`, or `locator.fill()`, Playwright automatically scrolls the page until the target element is within the viewport.",
      "Manual Target Scroll: If you need to scroll to an element without clicking it (e.g. to trigger lazy-loaded images or infinite scroll lists), use `await locator.scrollIntoViewIfNeeded()`.",
      "Infinite Scrolling & Virtual Lists: For virtualized tables or infinite newsfeeds, use `await page.mouse.wheel(deltaX, deltaY)` to simulate continuous user wheel scrolling.",
      "JavaScript Fallback: For specific scroll coordinates, you can use `page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))`."
    ],
    codeSnippet: {
      language: "typescript",
      code: `// 1. Auto-scrolling: No manual scroll needed!
await page.getByRole('button', { name: 'Bottom Footer Link' }).click();

// 2. Manual component scroll into view:
const pricingTable = page.locator('#pricing-section');
await pricingTable.scrollIntoViewIfNeeded();

// 3. Infinite scroll feed simulation using mouse wheel:
await page.mouse.wheel(0, 1500); // Scroll down 1500 pixels
await page.waitForResponse('**/api/feed?page=2');

// 4. Scroll container element:
await page.locator('.chat-messages').evaluate(el => el.scrollTop = el.scrollHeight);`,
      explanation: "Auto-scroll in action alongside manual viewport and container scrolling techniques."
    },
    proTip: "Highlight that Playwright's auto-scroll honors sticky headers and CSS fixed elements, ensuring the target element isn't scrolled under an obscured banner.",
    commonFollowUp: "How do you test lazy-loading images that only load when scrolled into view?"
  },
  {
    id: 30,
    question: "How do you handle alerts in Playwright?",
    shortAnswer: "Use page.on('dialog', dialog => dialog.accept() or dialog.dismiss()). By default, Playwright auto-dismisses all dialogs.",
    category: "Sessions, Auth & Dialogs",
    difficulty: "Intermediate",
    tags: ["Dialogs", "Alerts", "Confirm", "Prompt", "dialog.accept"],
    detailedExplanation: [
      "Native browser dialogs include `window.alert()`, `window.confirm()`, `window.prompt()`, and `beforeunload` popups.",
      "Auto-Dismiss Default: By default, Playwright automatically dismisses (clicks Cancel) on all dialogs so tests never freeze waiting for user input.",
      "Custom Handling: To handle, accept, or supply text to a dialog, register a listener with `page.on('dialog', dialog => ...)` before triggering the action.",
      "Inspecting Dialogs: You can check `dialog.type()` ('alert' | 'confirm' | 'prompt'), `dialog.message()` (text content), and `dialog.defaultValue()`.",
      "Actions: Call `await dialog.accept(promptInput?)` or `await dialog.dismiss()`."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { test, expect } from '@playwright/test';

test('handle confirmation dialog', async ({ page }) => {
  await page.goto('/settings');

  // Register dialog listener BEFORE clicking delete:
  page.on('dialog', async (dialog) => {
    expect(dialog.type()).toBe('confirm');
    expect(dialog.message()).toBe('Are you sure you want to delete this project?');
    
    // Accept the confirmation dialog
    await dialog.accept();
  });

  // Trigger action that displays the dialog:
  await page.getByRole('button', { name: 'Delete Project' }).click();

  await expect(page.getByText('Project deleted successfully')).toBeVisible();
});`,
      explanation: "Registering the dialog handler before the triggering action."
    },
    proTip: "Always register `page.once('dialog')` instead of `page.on('dialog')` if you only want the handler to process a single specific popup rather than every dialog on the page.",
    commonFollowUp: "What happens if a prompt dialog expects text input from the user?"
  },
  {
    id: 31,
    question: "How do you perform drag and drop in Playwright?",
    shortAnswer: "Use locator.dragTo(targetLocator) for simple drag and drop, or manual mouse API actions for custom drag paths and offsets.",
    category: "Locators & Interactions",
    difficulty: "Intermediate",
    tags: ["Drag and Drop", "dragTo", "mouse API", "Kanban"],
    detailedExplanation: [
      "Method 1: Built-in `locator.dragTo(target)`: Automatically calculates coordinates, triggers `pointerdown`, moves the pointer over the destination, and fires `pointerup`.",
      "Method 2: Manual Mouse Coordinates: For sliders, drawing canvases, or Kanban boards requiring custom midpoint drag trajectories, use `page.mouse.move()`, `page.mouse.down()`, and `page.mouse.up()`.",
      "HTML5 Drag & Drop vs Pointer Events: Playwright dispatches native trusted events that seamlessly trigger HTML5 `dragstart`, `dragover`, and `drop` event listeners."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { test, expect } from '@playwright/test';

test('drag and drop Kanban card', async ({ page }) => {
  await page.goto('/kanban');

  const sourceCard = page.locator('#task-card-101');
  const targetColumn = page.locator('#column-in-progress');

  // One-line built-in drag and drop:
  await sourceCard.dragTo(targetColumn);

  // Manual approach with precise steps for complex canvases:
  // await sourceCard.hover();
  // await page.mouse.down();
  // await targetColumn.hover();
  // await page.mouse.up();

  await expect(targetColumn.locator('#task-card-101')).toBeVisible();
});`,
      explanation: "Using `dragTo` to move cards across Kanban board columns."
    },
    proTip: "If `dragTo` doesn't trigger tricky legacy drag libraries, pass `{ force: true }` or use the manual 4-step mouse sequence with a tiny 100ms pause.",
    commonFollowUp: "How do you simulate dragging a slider handle by a specific pixel offset?"
  },
  {
    id: 32,
    question: "How do you handle network failures in Playwright?",
    shortAnswer: "Use page.route() to abort or fulfill requests with HTTP errors (e.g. route.abort('failed') or route.fulfill({ status: 500 })).",
    category: "Network & API Mocking",
    difficulty: "Advanced",
    tags: ["Network Failures", "route.abort", "Resilience", "Error Handling"],
    detailedExplanation: [
      "Testing negative error states and offline resilience is critical for mission-critical web applications.",
      "`route.abort(errorCode)` simulates network drops at the browser socket level without ever reaching a server.",
      "Common error codes include: `'failed'`, `'timedout'`, `'connectionreset'`, `'internetdisconnected'`, and `'accessdenied'`.",
      "Simulating Server Errors: Use `route.fulfill({ status: 500, body: 'Internal Server Error' })` to test how your UI displays alert banners, toast notifications, or retry buttons."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { test, expect } from '@playwright/test';

test('UI gracefully handles network connection drop', async ({ page }) => {
  await page.goto('/payment');

  // Intercept payment gateway call and abort connection:
  await page.route('**/api/charge', route => {
    route.abort('connectionfailed');
  });

  await page.getByRole('button', { name: 'Submit Payment' }).click();

  // Verify resilient error handling in the UI:
  const errorToast = page.getByRole('alert');
  await expect(errorToast).toBeVisible();
  await expect(errorToast).toHaveText(/Network connection lost. Please try again./);
  await expect(page.getByRole('button', { name: 'Retry Payment' })).toBeEnabled();
});`,
      explanation: "Simulating a socket abort to verify UI error fallback state."
    },
    proTip: "Combine `route.abort('timedout')` with UI assertions to verify that your frontend shows a spinner with a timeout warning rather than hanging indefinitely.",
    commonFollowUp: "How do you simulate an offline browser state using Playwright?"
  },
  {
    id: 33,
    question: "How do you test on mobile devices in Playwright?",
    shortAnswer: "Use device descriptors from @playwright/test (e.g. devices['iPhone 13']) in your config or context options.",
    category: "Advanced Testing & Best Practices",
    difficulty: "Beginner",
    tags: ["Mobile Testing", "Device Descriptors", "Emulation", "Viewport"],
    detailedExplanation: [
      "Playwright provides a built-in device registry (`devices`) containing over 100 accurate mobile and tablet profiles.",
      "What it Emulates:",
      "- Viewport dimensions and screen resolution (`width`, `height`).",
      "- Device pixel ratio (Retina @2x/@3x scaling).",
      "- User-Agent HTTP header.",
      "- Touch screen support (`hasTouch: true`).",
      "- Mobile browser capabilities (`isMobile: true`).",
      "Important Clarification: Playwright emulates mobile browsers running inside desktop Chromium/WebKit engines; it is not running on physical iOS/Android hardware like Appium."
    ],
    codeSnippet: {
      language: "typescript",
      code: `// 1. In playwright.config.ts project configuration:
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'Mobile Chrome - Pixel 5',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari - iPhone 14 Pro',
      use: { ...devices['iPhone 14 Pro'] },
    },
  ],
});

// 2. Or programmatically in a specific test:
test('test on iPad landscape', async ({ browser }) => {
  const iPad = devices['iPad Pro 11 landscape'];
  const context = await browser.newContext({ ...iPad });
  const page = await context.newPage();
  await page.goto('https://myapp.com');
});`,
      explanation: "Configuring mobile emulation profiles in config and code."
    },
    proTip: "Make sure to test responsive burger navigation menus on mobile profiles and expanded headers on desktop profiles in the same test suite.",
    commonFollowUp: "What is the difference between device emulation in Playwright and testing on real devices using Appium?"
  },
  {
    id: 34,
    question: "How do you test login functionality?",
    shortAnswer: "Fill credentials, click submit, assert successful navigation or welcome element, and test both valid and invalid negative scenarios.",
    category: "Sessions, Auth & Dialogs",
    difficulty: "Beginner",
    tags: ["Login Testing", "Forms", "Assertions", "Negative Testing"],
    detailedExplanation: [
      "A complete login test suite should cover both positive and negative functional pathways:",
      "1. Happy Path: Navigate to login page, fill valid email and password using accessible locators, click submit button, and assert redirection to dashboard URL or presence of user profile avatar.",
      "2. Negative Scenarios: Invalid credentials (assert error message), blank fields (assert HTML5 validation), rate-limiting lockouts, and password masking.",
      "3. Security Checks: Confirm password inputs have `type='password'` and cannot be viewed in plain text."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { test, expect } from '@playwright/test';

test.describe('Authentication Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('successful login with valid credentials', async ({ page }) => {
    await page.getByLabel('Email address').fill('user@example.com');
    await page.getByLabel('Password').fill('ValidPassword123!');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Assert URL change and user greeting
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByRole('heading', { name: 'Welcome, User' })).toBeVisible();
  });

  test('displays error with invalid credentials', async ({ page }) => {
    await page.getByLabel('Email address').fill('user@example.com');
    await page.getByLabel('Password').fill('WrongPassword!');
    await page.getByRole('button', { name: 'Sign In' }).click();

    const alert = page.getByRole('alert');
    await expect(alert).toHaveText('Invalid email or password.');
  });
});`,
      explanation: "Organized test suite covering both happy path and invalid credential flows."
    },
    proTip: "Use environment variables (`process.env.TEST_USER_PASSWORD`) instead of hardcoding test passwords in your git repository.",
    commonFollowUp: "How do you test login with SSO providers like Okta or Azure AD?"
  },
  {
    id: 35,
    question: "How do you handle cookies in Playwright?",
    shortAnswer: "Use context.cookies() to inspect cookies, context.addCookies() to inject cookies, and context.clearCookies() to clear them.",
    category: "Sessions, Auth & Dialogs",
    difficulty: "Intermediate",
    tags: ["Cookies", "context.cookies", "addCookies", "clearCookies"],
    detailedExplanation: [
      "Cookies are managed at the `BrowserContext` level.",
      "Inspecting Cookies: `const cookies = await context.cookies([urls])` returns an array of cookie objects including name, value, domain, path, expires, httpOnly, secure, and sameSite.",
      "Injecting Cookies: `await context.addCookies([{ name: 'session_id', value: 'xyz', url: 'https://myapp.com' }])` lets you establish session state without going through the UI.",
      "Clearing Cookies: `await context.clearCookies()` removes all cookies, simulating a user logout or expired session."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { test, expect } from '@playwright/test';

test('inject marketing consent cookie', async ({ context, page }) => {
  // Pre-seed consent cookie before navigating so banner never appears
  await context.addCookies([
    {
      name: 'cookie_consent_accepted',
      value: 'true',
      domain: 'localhost',
      path: '/',
    },
  ]);

  await page.goto('http://localhost:3000');
  
  // Verify banner is suppressed
  await expect(page.getByTestId('cookie-banner')).not.toBeVisible();

  // Read cookies back:
  const cookies = await context.cookies();
  const consentCookie = cookies.find(c => c.name === 'cookie_consent_accepted');
  expect(consentCookie?.value).toBe('true');
});`,
      explanation: "Pre-injecting cookies to suppress annoying cookie consent modals in tests."
    },
    proTip: "Specify either `url` or both `domain` and `path` when calling `addCookies`, otherwise the browser will reject the cookie.",
    commonFollowUp: "How do you test that a cookie marked 'Secure' and 'HttpOnly' cannot be read via JavaScript `document.cookie`?"
  },
  {
    id: 36,
    question: "What is Trace Viewer in Playwright?",
    shortAnswer: "Trace Viewer is a GUI tool that provides step-by-step post-mortem inspection with DOM snapshots, timeline scrubber, network waterfall, and console logs.",
    category: "Debugging & Tracing",
    difficulty: "Intermediate",
    tags: ["Trace Viewer", "Post-Mortem", "DOM Snapshots", "Debugging"],
    detailedExplanation: [
      "The Trace Viewer is Playwright's most celebrated debugging superpower.",
      "Rather than just capturing a static screenshot or video, a Playwright Trace is a comprehensive `.zip` bundle containing:",
      "- DOM Snapshots: Exact interactive DOM before and after every single action. You can inspect elements in DevTools hours after the test ran!",
      "- Timeline Scrubber: Visual scrub bar showing micro-actions over time.",
      "- Action Metadata: Time taken, locator used, actionability checks evaluated.",
      "- Network Waterfall: Full HTTP requests, payloads, response bodies, and timing.",
      "- Console & Source Code: Browser console errors, logs, and line-by-line source code tracking.",
      "Inspect traces locally using `npx playwright show-trace trace.zip` or through the web at `trace.playwright.dev` without installing any tools."
    ],
    codeSnippet: {
      language: "typescript",
      code: `// Open a trace file from the command line:
// npx playwright show-trace ./test-results/login-test/trace.zip

// Or view in browser directly:
// Navigate to https://trace.playwright.dev and drag-and-drop the trace.zip!

// Configure in playwright.config.ts:
export default defineConfig({
  use: {
    trace: 'retain-on-failure', // Record traces for failed tests only
  },
});`,
      explanation: "Opening and configuring Trace Viewer recordings."
    },
    proTip: "Highlight `trace.playwright.dev` to interviewers: developers and QA engineers can inspect traces on any computer without needing Node or Playwright installed.",
    commonFollowUp: "What is the overhead of capturing traces for every single test in a large suite?"
  },
  {
    id: 37,
    question: "How do you generate trace?",
    shortAnswer: "Use context.tracing.start() and context.tracing.stop({ path: 'trace.zip' }), or configure trace in playwright.config.ts.",
    category: "Debugging & Tracing",
    difficulty: "Intermediate",
    tags: ["Tracing", "tracing.start", "tracing.stop", "trace.zip"],
    detailedExplanation: [
      "Tracing is started and stopped on the `BrowserContext`.",
      "Programmatic Approach: Call `await context.tracing.start({ screenshots: true, snapshots: true, sources: true })` before test steps, and `await context.tracing.stop({ path: 'trace.zip' })` after.",
      "Declarative Config Approach: Set the `trace` option in `playwright.config.ts`. Values include `'off'`, `'on'`, `'retain-on-failure'`, or `'on-first-retry'`.",
      "Options for Tracing:",
      "- `screenshots`: Captures visual filmstrip thumbnails.",
      "- `snapshots`: Captures full DOM and network request archives.",
      "- `sources`: Embeds the TypeScript test source files inside the trace zip."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { test } from '@playwright/test';

test('manual tracing lifecycle', async ({ browser }) => {
  const context = await browser.newContext();
  
  // Start recording trace
  await context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });

  const page = await context.newPage();
  await page.goto('https://playwright.dev');
  await page.getByRole('link', { name: 'Get started' }).click();

  // Stop recording and save zip archive
  await context.tracing.stop({
    path: 'test-results/my-custom-trace.zip',
  });

  await context.close();
});`,
      explanation: "Programmatic trace capture lifecycle with screenshots and snapshots enabled."
    },
    proTip: "In custom fixtures or before/after hooks, check `testInfo.status !== testInfo.expectedStatus` before saving the trace to keep storage lean.",
    commonFollowUp: "Can you record traces across multiple browser contexts in the same test?"
  },
  {
    id: 38,
    question: "How do you test WebSockets in Playwright?",
    shortAnswer: "Use page.on('websocket') to intercept the connection and listen for framesent and framereceived events.",
    category: "Network & API Mocking",
    difficulty: "Advanced",
    tags: ["WebSockets", "Real-Time", "framesent", "framereceived"],
    detailedExplanation: [
      "Real-time web applications (chat apps, stock tickers, gaming, collaborative canvases) rely on WebSockets rather than standard HTTP polling.",
      "Playwright provides native WebSocket event inspection via `page.on('websocket', ws => ...)`.",
      "Key WebSocket Events:",
      "- `ws.on('framesent', event => ...)`: Triggers when the client sends a message to the server.",
      "- `ws.on('framereceived', event => ...)`: Triggers when the server broadcasts a message to the client.",
      "- `ws.on('close')`: Triggers when the connection terminates.",
      "You can assert that specific payload structures or message types were transmitted over the socket."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { test, expect } from '@playwright/test';

test('verify real-time chat websocket messages', async ({ page }) => {
  // Promise to capture message received from server
  const receivedMessagePromise = new Promise<string>((resolve) => {
    page.on('websocket', (ws) => {
      console.log('WebSocket connected:', ws.url());
      ws.on('framereceived', (frame) => {
        resolve(frame.payload as string);
      });
    });
  });

  await page.goto('https://myapp.com/chat');
  await page.getByRole('textbox').fill('Hello World!');
  await page.getByRole('button', { name: 'Send' }).click();

  const message = await receivedMessagePromise;
  expect(JSON.parse(message)).toMatchObject({
    type: 'CHAT_MESSAGE',
    text: 'Hello World!',
  });
});`,
      explanation: "Listening to WebSocket frames and asserting structured payload delivery."
    },
    proTip: "Mention that Playwright can also mock WebSocket connections by intercepting WebSocket route handshakes in recent versions.",
    commonFollowUp: "How do you test reconnect logic when a WebSocket server goes down?"
  },
  {
    id: 39,
    question: "How do you handle slow network?",
    shortAnswer: "Use page.route() to delay responses artificially or Chrome DevTools Protocol (CDP) session to throttle network to 3G/4G speeds.",
    category: "Network & API Mocking",
    difficulty: "Advanced",
    tags: ["Slow Network", "Throttling", "CDP", "page.route delay"],
    detailedExplanation: [
      "Modern web apps must function reliably under poor network conditions (e.g. 3G mobile connections, high packet latency).",
      "Approach 1: Route Delay with `page.route()`: Intercept requests and introduce artificial delays before continuing (`await new Promise(r => setTimeout(r, 2000)); await route.continue()`).",
      "Approach 2: Browser Engine Throttling via CDP (Chromium): Connect to Chrome DevTools Protocol using `context.newCDPSession(page)` and execute `Network.emulateNetworkConditions` with custom latency, download, and upload throughput.",
      "This enables verifying that skeleton loaders, spinner states, and timeout errors work seamlessly."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { test, expect } from '@playwright/test';

test('emulate Slow 3G network conditions', async ({ page }) => {
  // Connect to Chrome DevTools Protocol session
  const client = await page.context().newCDPSession(page);

  // Emulate Slow 3G profile:
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 500, // 500ms RTT
    downloadThroughput: ((500 * 1024) / 8), // 500 kb/s
    uploadThroughput: ((500 * 1024) / 8),   // 500 kb/s
  });

  await page.goto('https://myapp.com');

  // Verify skeleton loading indicator is displayed while data fetches:
  await expect(page.getByTestId('card-skeleton')).toBeVisible();
});`,
      explanation: "Using CDP session to throttle network throughput and latency."
    },
    proTip: "CDP methods only work on Chromium-based browsers; for cross-browser throttling across Firefox/WebKit, use the `page.route` delay approach.",
    commonFollowUp: "What is the difference between latency throttling and bandwidth throughput throttling?"
  },
  {
    id: 40,
    question: "How do you test accessibility in Playwright?",
    shortAnswer: "Use @axe-core/playwright to run automated WCAG audits and assert zero accessibility rule violations on your pages.",
    category: "Advanced Testing & Best Practices",
    difficulty: "Intermediate",
    tags: ["Accessibility", "axe-core", "a11y", "WCAG"],
    detailedExplanation: [
      "Web accessibility ensures applications are usable by everyone, including people with visual, auditory, cognitive, or motor disabilities.",
      "Playwright integrates seamlessly with the industry-standard Deque `axe-core` accessibility engine via the `@axe-core/playwright` package.",
      "How it works: The `AxeBuilder` scans the current page DOM against WCAG 2.0/2.1/2.2 AA standards and flags color contrast failures, missing aria labels, invalid role hierarchies, and missing form labels.",
      "You can scope scans to specific components (`AxeBuilder.include('#main-nav')`) or exclude known legacy sections while fixing them incrementally."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage accessibility audit conforms to WCAG 2.1 AA', async ({ page }) => {
  await page.goto('https://playwright.dev');

  // Run automated axe accessibility scan
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .exclude('#third-party-widget') // Exclude unmanaged widgets
    .analyze();

  // Assert zero violations
  expect(accessibilityScanResults.violations).toEqual([]);
});`,
      explanation: "Automated WCAG accessibility compliance testing using axe-core integration."
    },
    proTip: "Automated a11y tools catch ~30-40% of accessibility issues (contrast, labels, alt tags); complement automated scans with keyboard navigation tests (Tab/Enter).",
    commonFollowUp: "How do you generate a readable report of accessibility violations in CI?"
  },
  {
    id: 41,
    question: "How do you handle sessions and storage in Playwright?",
    shortAnswer: "Use context.storageState() to snapshot and restore localStorage, sessionStorage, and cookies, or evaluate window.localStorage directly.",
    category: "Sessions, Auth & Dialogs",
    difficulty: "Intermediate",
    tags: ["localStorage", "sessionStorage", "storageState", "evaluate"],
    detailedExplanation: [
      "Modern web applications store client-side preferences, carts, theme selections, and auth tokens in HTML5 Web Storage.",
      "Reading/Writing Storage: Use `page.evaluate()` to interact directly with `window.localStorage` and `window.sessionStorage` inside the page context.",
      "Snapshotting State: `await context.storageState({ path: 'state.json' })` packages all cookies and origins' localStorage entries into a portable file.",
      "Restoring State: Pass `storageState: 'state.json'` during `browser.newContext()` to immediately boot into that exact state without manual initialization."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { test, expect } from '@playwright/test';

test('manipulate and assert localStorage', async ({ page }) => {
  await page.goto('/');

  // Set theme preference directly in localStorage:
  await page.evaluate(() => {
    localStorage.setItem('user_theme', 'dark');
    sessionStorage.setItem('onboarding_dismissed', 'true');
  });

  await page.reload();

  // Assert HTML element reflects dark mode class:
  await expect(page.locator('html')).toHaveClass(/dark/);

  // Read value back from localStorage:
  const theme = await page.evaluate(() => localStorage.getItem('user_theme'));
  expect(theme).toBe('dark');
});`,
      explanation: "Direct manipulation and verification of browser Web Storage."
    },
    proTip: "Remember that `storageState` captures `localStorage` and `cookies`, but does not save `sessionStorage` by default; use `page.evaluate` if sessionStorage restoration is needed.",
    commonFollowUp: "How do you clear IndexedDB databases between tests?"
  },
  {
    id: 42,
    question: "How do you test in different browsers?",
    shortAnswer: "Define projects for Chromium, Firefox, and WebKit in playwright.config.ts to execute your test matrix automatically.",
    category: "Test Runner, CI/CD & Config",
    difficulty: "Beginner",
    tags: ["Cross-Browser", "Projects", "WebKit", "Firefox", "Chromium"],
    detailedExplanation: [
      "Playwright provides a unified API that runs tests across all 3 major modern browser engines:",
      "- Chromium: Powers Google Chrome, Microsoft Edge, Brave, Opera.",
      "- WebKit: Powers Apple Safari across iOS and macOS.",
      "- Firefox: Powers Mozilla Firefox across all desktop operating systems.",
      "Configuring Projects: In `playwright.config.ts`, you define an array of `projects`. Each project specifies a `name` and browser parameters (`browserName: 'chromium' | 'firefox' | 'webkit'`).",
      "When running `npx playwright test`, Playwright executes your entire test suite against all configured projects concurrently."
    ],
    codeSnippet: {
      language: "typescript",
      code: `// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'Desktop Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Desktop Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Desktop WebKit (Safari)',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});

// Run against a specific browser from CLI:
// npx playwright test --project="Desktop WebKit"`,
      explanation: "Project matrix testing Chromium, Firefox, and WebKit."
    },
    proTip: "WebKit tests run natively on Linux CI servers without needing a physical Mac machine, giving teams true Safari engine coverage on affordable Linux agents.",
    commonFollowUp: "Can Playwright run tests on Microsoft Edge specifically?"
  },
  {
    id: 43,
    question: "How do you handle dynamic content in Playwright?",
    shortAnswer: "Rely on auto-waiting locators and web-first assertions that poll continuously until elements mount, animate, or update.",
    category: "Locators & Interactions",
    difficulty: "Intermediate",
    tags: ["Dynamic Content", "Polling", "SPAs", "Re-rendering"],
    detailedExplanation: [
      "Modern Single Page Applications (React, Vue, Svelte, Angular) continuously re-render, hydrate, and fetch data in the background.",
      "Traditional selectors throw 'Stale Element Reference' errors when React replaces a DOM node with a newly rendered node.",
      "Playwright Locators are Stale-Proof: Because locators are lazy descriptors, Playwright re-queries the DOM on-the-fly at the moment of interaction. If an element was unmounted and remounted during a React re-render, Playwright finds the new element seamlessly.",
      "Combine locators with Web-First Assertions (`await expect(locator).toHaveText('Updated')`) which poll continuously for up to 5 seconds."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { test, expect } from '@playwright/test';

test('handle dynamic live search autocomplete', async ({ page }) => {
  await page.goto('/search');

  const searchBox = page.getByRole('searchbox');
  await searchBox.fill('mechanical');

  // Dynamic dropdown list re-renders as debounce timer completes
  const suggestionList = page.getByRole('listbox');
  const targetOption = suggestionList.getByRole('option', { name: 'Mechanical Keyboard' });

  // Auto-waits for API debounce, unmount, and final DOM mount!
  await expect(targetOption).toBeVisible();
  await targetOption.click();

  await expect(page).toHaveTitle(/Mechanical Keyboards/);
});`,
      explanation: "Interacting with debounced, dynamic autocomplete elements without manual sleeps."
    },
    proTip: "Avoid querying static `elementHandle` references; always use `page.locator()` or `page.getByRole()` so stale elements are never an issue.",
    commonFollowUp: "How do you wait for a specific CSS class animation to finish before interacting?"
  },
  {
    id: 44,
    question: "How do you parallelize tests in Playwright?",
    shortAnswer: "Configure workers in config or CLI, enable fullyParallel for test-level concurrency, and shard across multiple CI machines.",
    category: "Test Runner, CI/CD & Config",
    difficulty: "Advanced",
    tags: ["Parallelization", "Workers", "Sharding", "Scale"],
    detailedExplanation: [
      "Playwright scales horizontally through three distinct tiers of parallelism:",
      "1. Intra-File Parallelism (`fullyParallel: true`): Runs every `test()` block concurrently across available workers.",
      "2. Worker Concurrency (`workers: 4` or `workers: '50%'`): Spawns independent Node.js processes matched to your CPU hardware.",
      "3. Multi-Machine Sharding (`--shard=1/4`, `--shard=2/4`): Splits test files evenly across 4 separate CI runner instances, reducing a 20-minute test run to 5 minutes.",
      "Merge Reports: When sharding across machines, use `npx playwright merge-reports` to combine the individual blob reports into a single consolidated HTML report."
    ],
    codeSnippet: {
      language: "typescript",
      code: `// Multi-machine GitHub Actions matrix with sharding:
// matrix:
//   shardIndex: [1, 2, 3, 4]
//   shardTotal: [4]
// run: npx playwright test --shard=\${{ matrix.shardIndex }}/\${{ matrix.shardTotal }}

// In playwright.config.ts:
import { defineConfig } from '@playwright/test';

export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 4 : undefined,
});`,
      explanation: "Sharding configuration across 4 parallel CI machines."
    },
    proTip: "Ensure that each test generates its own unique test data (e.g. `const email = \`user-\${Date.now()}@test.com\``) so parallel tests don't collide in the database.",
    commonFollowUp: "What are the common causes of tests passing when run alone, but failing when run in parallel?"
  },
  {
    id: 45,
    question: "How do you measure performance in Playwright?",
    shortAnswer: "Use page.evaluate() with Navigation Timing API, inspect Chrome DevTools Performance metrics, or measure API duration.",
    category: "Advanced Testing & Best Practices",
    difficulty: "Intermediate",
    tags: ["Performance", "Navigation Timing", "Metrics", "Core Web Vitals"],
    detailedExplanation: [
      "While Playwright is primarily an end-to-end functional framework, it provides deep access to browser performance APIs.",
      "1. Navigation Timing API: Read `performance.getEntriesByType('navigation')[0]` to measure DNS lookup, TTFB (Time to First Byte), DOMContentLoaded, and Page Load time.",
      "2. Core Web Vitals: Measure LCP (Largest Contentful Paint), FID, and CLS (Cumulative Layout Shift) using PerformanceObserver scripts.",
      "3. CDP Performance Metrics: In Chromium, extract low-level engine metrics (`JSHeapUsedSize`, `LayoutCount`, `RecalcStyleCount`) via `client.send('Performance.getMetrics')`.",
      "4. Network Timing: Inspect `response.timing()` to record duration spent on DNS, SSL, and server processing."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { test, expect } from '@playwright/test';

test('measure page load metrics and TTFB', async ({ page }) => {
  await page.goto('https://myapp.com');

  // Extract browser performance timing metrics:
  const timing = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      dnsTime: nav.domainLookupEnd - nav.domainLookupStart,
      ttfb: nav.responseStart - nav.requestStart,
      domReady: nav.domContentLoadedEventEnd - nav.startTime,
      loadComplete: nav.loadEventEnd - nav.startTime,
    };
  });

  console.log('Performance Metrics:', timing);

  // Assert Performance SLAs:
  expect(timing.ttfb).toBeLessThan(800);      // TTFB < 800ms
  expect(timing.loadComplete).toBeLessThan(3500); // Total load < 3.5s
});`,
      explanation: "Querying browser Navigation Timing API and asserting Performance SLAs."
    },
    proTip: "Do not run performance benchmarks on shared CI machines; CPU fluctuations on virtual runners will skew timings wildly.",
    commonFollowUp: "Can Playwright be integrated with Google Lighthouse?"
  },
  {
    id: 46,
    question: "How do you test API in Playwright?",
    shortAnswer: "Use APIRequestContext (via request fixture) to send GET, POST, PUT, DELETE requests directly without a browser.",
    category: "Network & API Mocking",
    difficulty: "Intermediate",
    tags: ["API Testing", "APIRequestContext", "request fixture", "REST"],
    detailedExplanation: [
      "Playwright is not only a browser automation tool; it is a full-featured HTTP/REST client via `APIRequestContext`.",
      "Advantages:",
      "- No browser overhead: Executes in milliseconds without launching a browser window.",
      "- Shared State: An `APIRequestContext` can share cookies and authentication tokens with a `BrowserContext`.",
      "- Seed and Teardown: Instantly seed database entities via API before running a UI test, and purge them via API after.",
      "- Standalone API Suites: You can replace Postman or Newman entirely with Playwright's `request` fixture."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { test, expect } from '@playwright/test';

test('standalone REST API test suite', async ({ request }) => {
  // 1. POST request to create an item
  const postResponse = await request.post('https://reqres.in/api/users', {
    data: {
      name: 'Alice QA',
      job: 'Automation Architect',
    },
  });

  expect(postResponse.status()).toBe(201);
  const createdUser = await postResponse.json();
  expect(createdUser.name).toBe('Alice QA');

  // 2. GET request
  const getResponse = await request.get('https://reqres.in/api/users/2');
  expect(getResponse.ok()).toBeTruthy();
  expect(await getResponse.json()).toHaveProperty('data.email');
});`,
      explanation: "Using the standalone `request` fixture to test REST APIs without a browser."
    },
    proTip: "Use `request` inside `beforeEach` to create test records in milliseconds via backend APIs, then use `page` in the test to verify that the records render in the UI.",
    commonFollowUp: "How do you pass authentication Bearer headers globally to all `request` calls?"
  },
  {
    id: 47,
    question: "How do you test performance in Playwright?",
    shortAnswer: "Use Lighthouse audit integration, network timing logs, or CDP sessions to track resource weights and rendering times.",
    category: "Advanced Testing & Best Practices",
    difficulty: "Advanced",
    tags: ["Performance Testing", "Lighthouse", "Network Timings", "Auditing"],
    detailedExplanation: [
      "Comprehensive performance testing in Playwright involves three complementary strategies:",
      "1. Lighthouse Integration: Use packages like `playwright-lighthouse` to run automated Lighthouse audits and assert minimum performance scores (e.g. Performance > 90, SEO > 95).",
      "2. Resource Size & Budget Checking: Intercept responses with `page.on('response')` to sum up transferred byte sizes and assert that JS bundles don't exceed budgets (e.g. total JS < 300KB).",
      "3. Action Latency: Measure the precise time delta between triggering a UI click and the resulting DOM element render using `performance.now()`."
    ],
    codeSnippet: {
      language: "typescript",
      code: `import { test, expect } from '@playwright/test';

test('track total JavaScript bundle transfer size', async ({ page }) => {
  let totalJsBytes = 0;

  // Track network asset byte size
  page.on('response', async (res) => {
    if (res.request().resourceType() === 'script') {
      const buffer = await res.body().catch(() => null);
      if (buffer) totalJsBytes += buffer.length;
    }
  });

  await page.goto('https://myapp.com');

  console.log(\`Total JS Size: \${(totalJsBytes / 1024).toFixed(2)} KB\`);
  
  // Assert total bundle size is under 500 KB budget
  expect(totalJsBytes).toBeLessThan(500 * 1024);
});`,
      explanation: "Monitoring network asset weights and enforcing performance budgets."
    },
    proTip: "Set up performance budget tests in pull request pipelines to stop bundle-size creep before new code merges into main.",
    commonFollowUp: "What is the difference between synthetic load testing (k6, JMeter) and Playwright single-user performance audits?"
  },
  {
    id: 48,
    question: "How do you handle flaky tests?",
    shortAnswer: "Use Web-First assertions, stable user-facing locators, eliminate hardcoded sleeps, isolate test data, and review failure traces.",
    category: "Advanced Testing & Best Practices",
    difficulty: "Advanced",
    tags: ["Flakiness", "Stability", "Best Practices", "Root Cause Analysis"],
    detailedExplanation: [
      "Flaky tests pass and fail inconsistently without any code changes, eroding developer trust in the automation suite.",
      "Top Causes and Playwright Fixes:",
      "1. Timing / Race Conditions: Replace `page.waitForTimeout()` with auto-waiting locators and web-first assertions (`await expect(locator).toBeVisible()`).",
      "2. Brittle Selectors: Avoid deep CSS paths (`div > div:nth-child(3) > button`). Use accessible locators (`page.getByRole('button', { name: 'Save' })`).",
      "3. Shared State Collisions: Ensure each test creates its own user account, records, or isolated database rows.",
      "4. Dynamic Content & Animations: Use Playwright's built-in stability checks that wait for CSS transforms to stop moving before clicking.",
      "5. Debug with Trace Viewer: Inspect the DOM snapshot at the exact millisecond of failure to pinpoint the root cause."
    ],
    codeSnippet: {
      language: "typescript",
      code: `// ❌ Flaky Pattern:
// await page.click('#submit-btn');
// await page.waitForTimeout(2000);
// expect(await page.textContent('.status')).toBe('Done');

// ✅ Ultra-Stable Modern Pattern:
// 1. Stable accessible locator with auto-waiting:
const submitButton = page.getByRole('button', { name: 'Submit Application' });
await submitButton.click();

// 2. Web-first auto-retrying assertion with custom timeout:
const statusAlert = page.getByRole('status');
await expect(statusAlert).toHaveText('Done', { timeout: 10000 });`,
      explanation: "Contrasting brittle legacy code with resilient Playwright design patterns."
    },
    proTip: "Use `npx playwright test --repeat-each=20` locally to run a suspected flaky test 20 consecutive times to verify your fix actually eliminated the flake.",
    commonFollowUp: "How does Playwright's Trace Viewer help diagnose flaky tests that only fail on CI?"
  },
  {
    id: 49,
    question: "How do you test on different environments?",
    shortAnswer: "Use environment variables (process.env) and config files to configure baseURL, credentials, and API endpoints per environment.",
    category: "Test Runner, CI/CD & Config",
    difficulty: "Intermediate",
    tags: ["Environments", "baseURL", "dotenv", "Staging", "Production"],
    detailedExplanation: [
      "Automated test suites typically run across multiple environments: Local Development (`localhost`), Staging/QA, and Production smoke tests.",
      "Use `dotenv` to load `.env` files based on the target environment (e.g. `.env.staging`, `.env.prod`).",
      "Set `baseURL` in `playwright.config.ts`: This allows tests to use relative URLs like `await page.goto('/login')` instead of hardcoding hostnames.",
      "Parameterize credentials and feature flags so tests seamlessly adapt to the target environment's authentication server and configuration."
    ],
    codeSnippet: {
      language: "typescript",
      code: `// playwright.config.ts
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment-specific file:
const ENV = process.env.TEST_ENV || 'staging';
dotenv.config({ path: path.resolve(__dirname, \`.env.\${ENV}\`) });

export default defineConfig({
  use: {
    // Dynamic base URL:
    baseURL: process.env.BASE_URL || 'https://staging.myapp.com',
    extraHTTPHeaders: {
      'x-environment': ENV,
    },
  },
});

// Run with:
// TEST_ENV=prod npx playwright test`,
      explanation: "Dynamic environment switching using dotenv and configurable baseURL."
    },
    proTip: "Always use relative navigation in tests (`page.goto('/cart')`). If `baseURL` is set, Playwright automatically resolves relative paths against it.",
    commonFollowUp: "How do you protect production environments from destructive test data mutations during smoke runs?"
  },
  {
    id: 50,
    question: "How do you keep tests stable?",
    shortAnswer: "Use user-facing locators, keep tests isolated and atomic, leverage auto-waiting and web-first assertions, avoid shared static data, and keep Playwright updated.",
    category: "Advanced Testing & Best Practices",
    difficulty: "Advanced",
    tags: ["Stability", "Architecture", "Atomic Tests", "Best Practices", "Maintenance"],
    detailedExplanation: [
      "Maintaining an enterprise test suite of 1,000+ tests that runs in under 10 minutes without false failures requires strict engineering discipline:",
      "1. Atomicity & Isolation: Every test must be 100% self-sufficient. A test should set up its own state, execute its actions, and clean up. Tests must NEVER rely on the execution order of previous tests.",
      "2. User-Facing Locators: Rely on ARIA roles (`getByRole`), text (`getByText`), and labels (`getByLabel`). These reflect the actual user experience and remain stable through frontend refactors.",
      "3. Zero Hardcoded Sleep: Eliminate `page.waitForTimeout()` entirely from the codebase.",
      "4. Web-First Assertions: Always await `expect(locator).toBeVisible()` or `expect(locator).toHaveText()`.",
      "5. Fast Feedback Loop: Keep tests fast using `storageState` session re-use and horizontal sharding.",
      "6. Regular Updates: Keep `@playwright/test` updated monthly to receive latest browser binaries, rendering improvements, and bug fixes from Microsoft."
    ],
    codeSnippet: {
      language: "typescript",
      code: `// The Golden Playwright Test Blueprint:
import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Flow', () => {
  // 1. Independent per-test setup
  test.beforeEach(async ({ page }) => {
    await page.goto('/store');
  });

  test('user can add item to cart and proceed to checkout', async ({ page }) => {
    // 2. User-facing semantic locators
    const product = page.getByRole('article', { name: 'Wireless Headphones' });
    await product.getByRole('button', { name: 'Add to Cart' }).click();

    // 3. Web-first assertion auto-waiting for badge counter update
    const cartBadge = page.getByRole('link', { name: /Cart/ });
    await expect(cartBadge).toHaveText(/1/);

    await cartBadge.click();

    // 4. Assert final destination state
    await expect(page).toHaveURL(/.*checkout/);
    await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();
  });
});`,
      explanation: "The quintessential golden standard Playwright test demonstrating all stability principles."
    },
    proTip: "Summarize the 5 Pillars of Test Stability for any interview: 1. Independent Data 2. Semantic Locators 3. Auto-waiting 4. Web-First Assertions 5. Continuous Trace Diagnostics.",
    commonFollowUp: "What metrics or KPIs do you track to measure the health and ROI of your test automation framework?"
  }
];

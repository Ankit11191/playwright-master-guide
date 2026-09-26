import { PlaywrightQuestion } from '../playwrightQuestions';

export const QUESTIONS_PART_2: PlaywrightQuestion[] = [
  {
    "id": 51,
    "question": "What is the WebSocket communication protocol in Playwright and why is it faster than HTTP WebDriver?",
    "shortAnswer": "Playwright communicates over a single persistent bidirectional WebSocket connection directly to browser debugging protocols, eliminating HTTP handshake latency and round-trip overhead.",
    "category": "Architecture & Core",
    "difficulty": "Intermediate",
    "tags": [
      "WebSocket",
      "Architecture",
      "CDP",
      "WebDriver",
      "Performance"
    ],
    "detailedExplanation": [
      "Traditional automation frameworks like Selenium WebDriver use an HTTP REST protocol. Every single action sends an individual HTTP POST/GET request through a standalone driver executable to the browser, incurring TCP handshakes, header serializations, and connection latency.",
      "Playwright uses a single, continuous WebSocket connection directly connected to the browser's native engine debugging port.",
      "Because the connection is persistent and event-driven, the browser can push asynchronous events (DOM mutations, console logs, network responses, dialogs) immediately to Node.js without polling, resulting in sub-millisecond execution speeds."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { chromium } from '@playwright/test';\n\nconst browser = await chromium.launch({ headless: true });\nconst page = await browser.newPage();\n\npage.on('websocket', ws => {\n  console.log('WebSocket connection opened in page:', ws.url());\n});",
      "explanation": "Playwright's client-server architecture utilizes a single duplex WebSocket pipe for lightning-fast command and event transmission."
    },
    "proTip": "Highlight that WebSocket bi-directional streaming enables Playwright to listen for DOM mutations reactively, rather than repeatedly polling the DOM like older HTTP-based tools.",
    "commonFollowUp": "Does Playwright support connecting to an existing remote browser running on a grid or cloud cluster via WebSocket?"
  },
  {
    "id": 52,
    "question": "How does Playwright handle multiple browser contexts simultaneously in a single process?",
    "shortAnswer": "A Browser Context is an incognito-equivalent sandbox within a single browser instance. Playwright can create hundreds of isolated contexts in milliseconds with zero shared cookies, cache, or storage.",
    "category": "Architecture & Core",
    "difficulty": "Intermediate",
    "tags": [
      "BrowserContext",
      "Isolation",
      "Multi-Tenancy",
      "Incognito"
    ],
    "detailedExplanation": [
      "In traditional Selenium, achieving total session isolation required launching a brand-new browser process (`new ChromeDriver()`), which consumes hundreds of megabytes of RAM and takes 2-5 seconds per test.",
      "Playwright decouples the heavy OS Browser Process (`Browser`) from the lightweight Storage Context (`BrowserContext`). Launching a browser process happens once per worker thread, but tests run inside disposable `BrowserContext` instances.",
      "Each `BrowserContext` has its own isolated cookies, localStorage, indexedDB, cache, and HTTP proxy configuration. Creating a new context takes ~10 milliseconds and consumes negligible memory.",
      "This architecture makes it trivial to test multi-user scenarios (e.g. Chat app where User A talks to User B in two separate windows) within a single test case."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('real-time chat between two separate users', async ({ browser }) => {\n  const aliceContext = await browser.newContext();\n  const alicePage = await aliceContext.newPage();\n  await alicePage.goto('/chat');\n  await alicePage.getByLabel('Username').fill('Alice');\n  await alicePage.getByRole('button', { name: 'Join' }).click();\n\n  const bobContext = await browser.newContext();\n  const bobPage = await bobContext.newPage();\n  await bobPage.goto('/chat');\n  await bobPage.getByLabel('Username').fill('Bob');\n  await bobPage.getByRole('button', { name: 'Join' }).click();\n\n  await alicePage.getByPlaceholder('Type a message...').fill('Hello Bob!');\n  await alicePage.getByRole('button', { name: 'Send' }).click();\n\n  await expect(bobPage.getByText('Alice: Hello Bob!')).toBeVisible();\n  await aliceContext.close();\n  await bobContext.close();\n});",
      "explanation": "Testing real-time multi-tenant collaboration using two concurrent, isolated browser contexts."
    },
    "proTip": "Use `browser.newContext()` whenever you need to simulate multiple roles (Admin vs Standard User) in the same test without logging out.",
    "commonFollowUp": "Can two browser contexts in Playwright share cookies if explicitly configured to do so?"
  },
  {
    "id": 53,
    "question": "What is the difference between Chromium, Chrome, and Google Chrome Channel in Playwright?",
    "shortAnswer": "Chromium is the open-source rendering engine bundled with Playwright. Chrome is Google's proprietary distribution. Playwright can run against either bundled Chromium or branded Chrome channels.",
    "category": "Architecture & Core",
    "difficulty": "Beginner",
    "tags": [
      "Chromium",
      "Google Chrome",
      "Channels",
      "Browsers"
    ],
    "detailedExplanation": [
      "Playwright bundles specific, evergreen open-source revisions of Chromium, Firefox, and WebKit to guarantee 100% deterministic test execution across every machine.",
      "Chromium is the core open-source engine that powers Google Chrome, Microsoft Edge, Brave, and Opera.",
      "Google Chrome (`channel: 'chrome'`) is the official branded consumer browser installed on the host machine. You can configure Playwright to run against your locally installed Chrome or Edge executable.",
      "Best Practice: Use bundled Chromium for fast, stable, hermetic CI test runs, and smoke test against `channel: 'chrome'` to verify proprietary media playback."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "// playwright.config.ts\nimport { defineConfig, devices } from '@playwright/test';\n\nexport default defineConfig({\n  projects: [\n    {\n      name: 'chromium',\n      use: { ...devices['Desktop Chrome'] },\n    },\n    {\n      name: 'Google Chrome',\n      use: { ...devices['Desktop Chrome'], channel: 'chrome' },\n    },\n  ],\n});",
      "explanation": "Configuring Playwright projects to run against bundled Chromium vs host-installed Google Chrome."
    },
    "proTip": "On CI runners (like GitHub Actions), stick to bundled Chromium unless testing proprietary video codecs or enterprise Chrome extensions.",
    "commonFollowUp": "How does Playwright install and update its bundled browser binaries?"
  },
  {
    "id": 54,
    "question": "How does Playwright manage browser binaries and cached engines across different OS platforms?",
    "shortAnswer": "Playwright stores version-locked browser binaries in a global OS cache directory (~/.cache/ms-playwright on Linux/macOS, %USERPROFILE%\\AppData\\Local\\ms-playwright on Windows).",
    "category": "Architecture & Core",
    "difficulty": "Intermediate",
    "tags": [
      "Browser Cache",
      "Installation",
      "OS",
      "CI/CD"
    ],
    "detailedExplanation": [
      "When you install `@playwright/test`, the npm package contains only the JavaScript/TypeScript client library. The browser executables are downloaded via `npx playwright install`.",
      "To avoid re-downloading multi-hundred megabyte browser binaries for every project on a machine, Playwright installs them into a shared user-level cache folder:",
      "- Linux / macOS: `~/.cache/ms-playwright`",
      "- Windows: `%LOCALAPPDATA%\\ms-playwright`",
      "Each directory is keyed by browser name and specific build revision (e.g. `chromium-1140`).",
      "In CI/CD environments, you can override this path using the `PLAYWRIGHT_BROWSERS_PATH` environment variable to enable cross-job binary caching."
    ],
    "codeSnippet": {
      "language": "bash",
      "code": "# Install all 3 browsers:\nnpx playwright install\n\n# Install only Chromium to save bandwidth:\nnpx playwright install chromium\n\n# Install system dependencies required by Linux:\nnpx playwright install --with-deps chromium",
      "explanation": "Command-line operations for managing Playwright browser binaries and caching."
    },
    "proTip": "In GitHub Actions workflows, cache `~/.cache/ms-playwright` using `@actions/cache` keyed on `package-lock.json` to cut 2 minutes off your CI build time.",
    "commonFollowUp": "What happens if a CI runner attempts to execute tests without browser binaries installed?"
  },
  {
    "id": 55,
    "question": "What is the Execution Context in Playwright, and how does page.evaluate() execute scripts inside the browser?",
    "shortAnswer": "page.evaluate() runs JavaScript directly inside the browser's DOM window context and returns serialized JSON results back to the Node.js test process.",
    "category": "Architecture & Core",
    "difficulty": "Intermediate",
    "tags": [
      "evaluate",
      "ExecutionContext",
      "DOM",
      "Browser vs Node"
    ],
    "detailedExplanation": [
      "Playwright runs your test script in a Node.js process. When you call `page.evaluate(fn, arg)`, Playwright serializes `fn` and `arg`, transmits them over WebSocket to the browser process, executes the function in the page's JavaScript execution context, and serializes the return value back to Node.js.",
      "Arguments and return values must be serializable to JSON (primitives, plain objects, arrays). Circular references or DOM Nodes cannot be directly returned as JSON.",
      "Code inside `page.evaluate()` has direct access to `window`, `document`, and client-side browser APIs, but has no access to Node.js variables unless passed explicitly."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('inspect client-side performance and window metrics', async ({ page }) => {\n  await page.goto('https://example.com');\n  const multiplier = 2;\n  const result = await page.evaluate((m) => {\n    return {\n      width: window.innerWidth * m,\n      ua: navigator.userAgent\n    };\n  }, multiplier);\n  expect(result.width).toBeGreaterThan(0);\n});",
      "explanation": "Executing JavaScript directly in the browser's window context and retrieving structured return data."
    },
    "proTip": "Never use `page.evaluate()` for standard user clicks or fills! Use `locator.click()` so Playwright can perform full auto-waiting and actionability checks.",
    "commonFollowUp": "What is the difference between page.evaluate() and page.evaluateHandle()?"
  },
  {
    "id": 56,
    "question": "How do you pass complex serialized arguments to page.evaluate() or page.evaluateHandle()?",
    "shortAnswer": "Pass a single serializable argument (primitive, object, or JSHandle) as the second parameter to page.evaluate(). Use evaluateHandle() when returning non-JSON objects like DOM nodes.",
    "category": "Architecture & Core",
    "difficulty": "Advanced",
    "tags": [
      "evaluateHandle",
      "JSHandle",
      "Serialization"
    ],
    "detailedExplanation": [
      "When calling `page.evaluate(fn, arg)`, you can pass only one argument into the callback. To pass multiple variables, group them into a single JavaScript object `{ a, b, c }`.",
      "If you need to work with objects that cannot be serialized to JSON—such as raw DOM nodes, Canvas contexts, or circular structures—use `page.evaluateHandle()`.",
      "`evaluateHandle` returns a `JSHandle` that holds a pointer to the memory reference residing inside the browser's heap without pulling the data across the WebSocket.",
      "Always call `handle.dispose()` when done with long-lived JSHandles to prevent memory leaks."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('work with non-serializable DOM references', async ({ page }) => {\n  await page.goto('/canvas-app');\n  const config = { fillStyle: '#ff0000', width: 200, height: 100 };\n  await page.evaluate(({ fillStyle, width, height }) => {\n    const canvas = document.querySelector('canvas');\n    const ctx = canvas?.getContext('2d');\n    if (ctx) {\n      ctx.fillStyle = fillStyle;\n      ctx.fillRect(0, 0, width, height);\n    }\n  }, config);\n\n  const bodyHandle = await page.evaluateHandle(() => document.body);\n  const tagName = await bodyHandle.evaluate(el => el.tagName);\n  expect(tagName).toBe('BODY');\n  await bodyHandle.dispose();\n});",
      "explanation": "Passing structured configuration objects into evaluate and managing JSHandle lifecycles."
    },
    "proTip": "Use `locator.evaluate()` instead of `page.evaluate()` when inspecting a specific element—it automatically waits for the element to attach first.",
    "commonFollowUp": "How does Playwright handle functions passed as arguments to page.evaluate()?"
  },
  {
    "id": 57,
    "question": "What is an ElementHandle and why does modern Playwright discourage it in favor of Locators?",
    "shortAnswer": "ElementHandle is a direct pointer to an in-memory DOM element from Puppeteer days. It does not auto-wait and throws 'stale element' errors. Locators are lazy, self-healing recipes that re-query the DOM automatically.",
    "category": "Architecture & Core",
    "difficulty": "Beginner",
    "tags": [
      "ElementHandle",
      "Locators",
      "Stale Element",
      "Best Practice"
    ],
    "detailedExplanation": [
      "In early versions of Playwright and Puppeteer, the primary way to interact with elements was `page.$(selector)` which returned an `ElementHandle`.",
      "An `ElementHandle` points to a specific point-in-time DOM node reference in browser memory. If the page re-renders or navigates, that DOM node is detached, and subsequent interaction throws `Error: Element is not attached to the DOM`.",
      "In modern Playwright, `Locator` replaced `ElementHandle`. A Locator does not hold a DOM reference; it stores the recipe. Every time an action is executed, the Locator re-evaluates the recipe, auto-waits for actionability, and is 100% immune to stale element errors."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "// ❌ OUTDATED (ElementHandle):\nconst btn = await page.$('button.submit');\nawait btn?.click(); // Fails if page re-rendered!\n\n// ✅ MODERN (Locator):\nconst submitBtn = page.getByRole('button', { name: 'Submit' });\nawait submitBtn.click(); // Always resolves fresh DOM, auto-waits, never stale!",
      "explanation": "Contrasting legacy ElementHandles with modern auto-recovering Locators."
    },
    "proTip": "Never use `page.$()` or `page.$$()` in new Playwright test code. They are legacy methods kept only for backward compatibility.",
    "commonFollowUp": "Are there any rare edge cases where an ElementHandle is still necessary?"
  },
  {
    "id": 58,
    "question": "What is the CDP (Chrome DevTools Protocol) session in Playwright and how do you access it via context.newCDPSession()?",
    "shortAnswer": "A CDPSession provides direct access to Google Chrome DevTools Protocol commands, allowing low-level browser telemetry, memory heap snapshots, and performance profiler traces in Chromium.",
    "category": "Architecture & Core",
    "difficulty": "Advanced",
    "tags": [
      "CDP",
      "DevTools Protocol",
      "Performance",
      "Chromium"
    ],
    "detailedExplanation": [
      "While Playwright provides high-level, cross-browser APIs, Chromium-based browsers support the full Chrome DevTools Protocol (CDP) API.",
      "Using `context.newCDPSession(page)`, you can create a direct client to send any raw CDP domain command (`Performance`, `Network`, `HeapProfiler`, `Security`).",
      "This is invaluable for deep performance benchmarking, taking V8 heap snapshots to detect memory leaks, or interacting with experimental Chromium features."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('measure exact JS heap memory via Chrome DevTools Protocol', async ({ page, browserName }) => {\n  test.skip(browserName !== 'chromium', 'CDP is Chromium-exclusive');\n  await page.goto('https://example.com');\n\n  const cdpSession = await page.context().newCDPSession(page);\n  await cdpSession.send('Performance.enable');\n  const metrics = await cdpSession.send('Performance.getMetrics');\n  const jsHeapUsed = metrics.metrics.find(m => m.name === 'JSHeapUsedSize')?.value;\n  expect(jsHeapUsed).toBeGreaterThan(0);\n  await cdpSession.detach();\n});",
      "explanation": "Using page.context().newCDPSession() to inspect low-level V8 engine metrics."
    },
    "proTip": "Use CDP sessions for low-level performance profiling or extracting code coverage that standard cross-browser APIs do not expose.",
    "commonFollowUp": "Can CDP commands be run on Firefox or WebKit in Playwright?"
  },
  {
    "id": 59,
    "question": "How does Playwright support WebKit and Firefox on Linux without standard desktop browsers installed?",
    "shortAnswer": "Microsoft compiles and distributes custom, headless-native builds of the WebKit and Firefox open-source rendering engines with patched debugging layers for Linux, macOS, and Windows.",
    "category": "Architecture & Core",
    "difficulty": "Intermediate",
    "tags": [
      "WebKit",
      "Firefox",
      "Linux",
      "Cross-Browser"
    ],
    "detailedExplanation": [
      "Apple's official Safari browser runs only on macOS and iOS. Running Safari on a headless Linux CI server was historically impossible without costly macOS cloud runner VMs.",
      "Microsoft solves this by maintaining a direct fork of the open-source WebKit rendering engine compiled with WebKitGTK and WPE WebKit dependencies to run natively on Linux and Windows.",
      "Similarly, for Firefox, Microsoft patches Mozilla's Gecko engine to expose an internal WebSocket-based debugging interface equivalent to CDP.",
      "This ensures your CI/CD test runs on Linux Docker containers match the rendering, layout, and JavaScript engine of real Apple Safari."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "// playwright.config.ts\nimport { defineConfig, devices } from '@playwright/test';\n\nexport default defineConfig({\n  projects: [\n    {\n      name: 'webkit',\n      use: { ...devices['Desktop Safari'] },\n    },\n    {\n      name: 'Mobile Safari',\n      use: { ...devices['iPhone 13'] },\n    },\n  ],\n});",
      "explanation": "Configuring WebKit projects to run cross-browser tests on Linux servers."
    },
    "proTip": "Remind interviewers that WebKit in Playwright is the actual Apple WebKit engine, NOT Chromium with a Safari User-Agent string.",
    "commonFollowUp": "Are there any behavioral differences between Playwright's WebKit build on Linux and real Safari on macOS?"
  },
  {
    "id": 60,
    "question": "What is Playwright's Worker process model and how does it guarantee test sandboxing?",
    "shortAnswer": "Playwright spawns multiple independent OS Node.js worker processes. Each worker runs tests sequentially in a shared browser instance, but provides freshly isolated browser contexts for each test.",
    "category": "Architecture & Core",
    "difficulty": "Advanced",
    "tags": [
      "Worker Processes",
      "Parallelism",
      "Architecture",
      "Sandboxing"
    ],
    "detailedExplanation": [
      "When you run `npx playwright test`, Playwright launches a Test Runner Orchestrator process. Depending on CPU cores, it spawns child Node.js worker processes.",
      "Process Isolation: If a test crashes Node.js in Worker 1, Workers 2, 3, and 4 remain completely unaffected.",
      "Context Isolation: Within each worker, before each test runs, Playwright creates a brand-new `BrowserContext` and discards it when the test completes.",
      "Sequential execution inside worker: A single worker executes one test at a time; tests assigned to the same worker never interleave."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('demonstrate worker index and process ID', async ({ page }, testInfo) => {\n  console.log(`Running Test: ${testInfo.title}`);\n  console.log(`Worker Index: ${testInfo.workerIndex}`);\n  console.log(`Node.js PID: ${process.pid}`);\n  await page.goto('/');\n  await expect(page).toHaveTitle(/Home/);\n});",
      "explanation": "Accessing testInfo.workerIndex to observe worker process allocation."
    },
    "proTip": "Because workers are separate OS processes, in-memory global variables are NOT shared between different workers.",
    "commonFollowUp": "How can test files share state across different worker processes if in-memory variables are isolated?"
  },
  {
    "id": 61,
    "question": "How does Playwright manage garbage collection, context teardown, and memory leaks during long test runs?",
    "shortAnswer": "Playwright automatically destroys BrowserContexts, closes pages, and prunes event listeners between tests. Workers can be configured to recycle browser processes periodically.",
    "category": "Architecture & Core",
    "difficulty": "Advanced",
    "tags": [
      "Memory Leak",
      "Garbage Collection",
      "Lifecycle",
      "Cleanup"
    ],
    "detailedExplanation": [
      "When running large suites of 1,000+ tests, browsers can accumulate V8 heap bloat, cached DOM trees, and unreleased WebGL textures.",
      "Playwright mitigates this automatically: after each test, the `page` and its parent `BrowserContext` are closed, instructing the browser engine to run full garbage collection.",
      "If a worker process reaches a memory threshold or experiences an unrecoverable browser crash, Playwright restarts a fresh browser binary and transparently resumes remaining tests."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "// playwright.config.ts\nimport { defineConfig } from '@playwright/test';\n\nexport default defineConfig({\n  workers: 4,\n  use: {\n    extraHTTPHeaders: {\n      'Cache-Control': 'no-cache',\n    },\n  },\n});",
      "explanation": "Strategies for controlling worker memory and recycling browser processes."
    },
    "proTip": "If you observe RAM climbing indefinitely on CI, check if your tests create un-disposed `JSHandle` pointers or store base64 screenshots in global arrays.",
    "commonFollowUp": "How can you manually trigger Chromium garbage collection in Playwright?"
  },
  {
    "id": 62,
    "question": "How does page.mainFrame() relate to child frames and iframe tree hierarchies?",
    "shortAnswer": "Every page has a single mainFrame representing the root document. Any <iframe> embedded on the page becomes a child Frame accessible via page.frames() or page.frameLocator().",
    "category": "Architecture & Core",
    "difficulty": "Intermediate",
    "tags": [
      "Frames",
      "iFrame",
      "mainFrame",
      "DOM Tree"
    ],
    "detailedExplanation": [
      "Modern web applications frequently embed third-party services inside HTML `<iframe>` tags.",
      "In Playwright, `page.mainFrame()` represents the top-level browsing context. Sub-frames are attached as children forming a hierarchical frame tree.",
      "Playwright handles cross-origin (Out-of-Process) iframes seamlessly through direct browser debugging protocol connections.",
      "Prefer `page.frameLocator('iframe-selector')` over low-level `Frame` objects because FrameLocators support auto-waiting and strict mode."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('inspect and interact with nested iframes', async ({ page }) => {\n  await page.goto('/checkout');\n  const stripeIframe = page.frameLocator('iframe[name=\"stripe_checkout\"]');\n  await stripeIframe.getByPlaceholder('Card number').fill('424242424242');\n  await expect(stripeIframe.getByRole('button', { name: 'Confirm Payment' })).toBeEnabled();\n});",
      "explanation": "Accessing and interacting with elements embedded in cross-origin iframes using frameLocator."
    },
    "proTip": "You can nest FrameLocators: `page.frameLocator('#parentFrame').frameLocator('#childFrame').getByRole('button')`.",
    "commonFollowUp": "How does Playwright handle an iframe that dynamically reloads its src attribute mid-test?"
  },
  {
    "id": 63,
    "question": "Can Playwright be used for Web Scraping and headless data extraction? What are the key considerations?",
    "shortAnswer": "Yes. Playwright is exceptionally capable for web scraping SPAs, bypassing bot detection with stealth plugins, intercepting network payloads, and extracting structured DOM data.",
    "category": "Architecture & Core",
    "difficulty": "Beginner",
    "tags": [
      "Web Scraping",
      "Data Extraction",
      "Headless",
      "Automation"
    ],
    "detailedExplanation": [
      "Unlike HTTP-based scraping libraries (Cheerio, Beautiful Soup) that cannot execute JavaScript, Playwright boots full browser rendering engines.",
      "Key advantages for scrapers: automatic hydration waiting, background JSON API response interception using `page.on('response')`, easy infinite scrolling, and configurable device emulation."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { chromium } from '@playwright/test';\n\n(async () => {\n  const browser = await chromium.launch({ headless: true });\n  const page = await browser.newPage();\n  page.on('response', async (res) => {\n    if (res.url().includes('/api/products') && res.status() === 200) {\n      const data = await res.json();\n      console.log('Extracted product count:', data.items.length);\n    }\n  });\n  await page.goto('https://ecommerce.example.com/shop');\n  await page.waitForLoadState('networkidle');\n  await browser.close();\n})();",
      "explanation": "Extracting structured data from an SPA by intercepting backend JSON responses directly."
    },
    "proTip": "When building web scrapers, always intercept the underlying REST/GraphQL API responses rather than parsing HTML. It is 10x faster and never breaks when CSS classes change.",
    "commonFollowUp": "How do anti-bot detection platforms detect headless Playwright instances?"
  },
  {
    "id": 64,
    "question": "How does Playwright's auto-wait mechanism inspect the internal DOM accessibility tree?",
    "shortAnswer": "Playwright queries the browser's internal accessibility tree (computed ARIA roles, names, and states) directly via rendering engine primitives, ensuring locators match screen-reader perceptions.",
    "category": "Architecture & Core",
    "difficulty": "Intermediate",
    "tags": [
      "Accessibility Tree",
      "ARIA",
      "getByRole",
      "Auto-Wait"
    ],
    "detailedExplanation": [
      "When you use `page.getByRole('button', { name: 'Submit' })`, Playwright does not simply search for `<button>Submit</button>`.",
      "It queries the browser's computed Accessibility Tree—the exact same data structure used by Assistive Technologies (such as NVDA, JAWS, and VoiceOver).",
      "This means Playwright recognizes `<div role='button' tabindex='0'>Submit</div>` and `<input type='submit' value='Submit' />` as valid buttons.",
      "By asserting against the accessibility tree, your automated tests inherently validate that disabled users and screen readers can navigate and operate your application."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('validates accessible names and computed ARIA roles', async ({ page }) => {\n  await page.goto('/forms');\n  const closeBtn = page.getByRole('button', { name: 'Close dialog' });\n  await expect(closeBtn).toBeVisible();\n  const toggle = page.getByRole('switch', { name: 'Notifications' });\n  await expect(toggle).toBeChecked();\n});",
      "explanation": "Interacting with computed accessible names and roles rather than fragile CSS classes."
    },
    "proTip": "If `getByRole` fails to find an element, your website probably has an accessibility defect! Fix the missing ARIA label or HTML semantic tag.",
    "commonFollowUp": "What is the difference between an element's accessible name and its visible innerText?"
  },
  {
    "id": 65,
    "question": "What are the key differences between Playwright for Node.js, Python, Java, and .NET?",
    "shortAnswer": "All language bindings share the exact same underlying browser engine and WebSocket protocol. Node.js is the primary development target with the official Test Runner, TypeScript types, and UI mode.",
    "category": "Architecture & Core",
    "difficulty": "Beginner",
    "tags": [
      "Multi-Language",
      "Python",
      "Java",
      ".NET",
      "Ecosystem"
    ],
    "detailedExplanation": [
      "Playwright is maintained by Microsoft in 4 languages: TypeScript/JavaScript (Node.js), Python (Sync/Async), Java, and C# (.NET).",
      "How it works: The Python, Java, and .NET bindings spawn a lightweight background Node.js driver subprocess and communicate over JSON-RPC. The browser interaction speed, locators, and network interception are identical across all languages.",
      "Node.js has the official `@playwright/test` runner with fixtures, UI mode, and HTML reporter, whereas other languages integrate with pytest, JUnit, or NUnit."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('login', async ({ page }) => {\n  await page.goto('/login');\n  await page.getByRole('button', { name: 'Log in' }).click();\n  await expect(page).toHaveURL('/dashboard');\n});",
      "explanation": "TypeScript edition with full type safety and first-party test runner fixtures."
    },
    "proTip": "Recommend TypeScript for enterprise test automation projects—native typing on fixtures, locators, and test hooks catches 80% of errors at compile time.",
    "commonFollowUp": "Can Playwright tests written in Python utilize the Playwright Trace Viewer?"
  },
  {
    "id": 66,
    "question": "How does page.getByRole() handle ARIA attributes like aria-expanded, aria-selected, and aria-checked?",
    "shortAnswer": "getByRole accepts state options ({ expanded, selected, checked, disabled, pressed }) to filter elements based on their live interactive ARIA state.",
    "category": "Locators & Interactions",
    "difficulty": "Intermediate",
    "tags": [
      "getByRole",
      "ARIA States",
      "Locators",
      "State Filtering"
    ],
    "detailedExplanation": [
      "Complex UI components (accordions, tabs, multi-state toggle buttons, tree views) communicate their dynamic state through ARIA attributes.",
      "Instead of checking class names like `.is-active`, `getByRole` allows filtering directly by state options: `expanded`, `selected`, `checked`, and `pressed`.",
      "This ensures your locators test both the presence of the element and its correct semantic state."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('interact with ARIA accordion and tab states', async ({ page }) => {\n  await page.goto('/components');\n  const collapsedHeader = page.getByRole('button', { name: 'FAQ Section 1', expanded: false });\n  await collapsedHeader.click();\n  await expect(page.getByRole('button', { name: 'FAQ Section 1', expanded: true })).toBeVisible();\n  const activeTab = page.getByRole('tab', { name: 'Billing Info', selected: true });\n  await expect(activeTab).toBeVisible();\n});",
      "explanation": "Using stateful getByRole options to interact with dynamic ARIA components."
    },
    "proTip": "Use `getByRole('button', { expanded: false })` before clicking to prevent clicking an already open dropdown or accordion.",
    "commonFollowUp": "What happens if an element has role='button' but lacks the aria-expanded attribute when expanded: false is queried?"
  },
  {
    "id": 67,
    "question": "How do you locate elements with dynamic text using Regular Expressions in getByRole() and getByText()?",
    "shortAnswer": "Pass a RegExp object (e.g. /welcome, back/i) instead of a string to enable case-insensitive, partial, or pattern-based matching.",
    "category": "Locators & Interactions",
    "difficulty": "Beginner",
    "tags": [
      "Regex",
      "getByRole",
      "getByText",
      "Dynamic Text"
    ],
    "detailedExplanation": [
      "In modern web applications, text is rarely static: names change, localized greetings vary, and currency amounts or timestamps fluctuate.",
      "Passing a regular expression (`/pattern/flags`) enables powerful flexible matching: case-insensitivity (`/submit/i`), dynamic numbers (`/Order #\\d{4,6}/`), or substrings without leading/trailing whitespace issues.",
      "Regular expressions prevent test fragility caused by minor casing differences or dynamic user data."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('locate dynamic and formatted text with regular expressions', async ({ page }) => {\n  await page.goto('/orders');\n  const orderHeading = page.getByRole('heading', { name: /Order Confirmation #\\d{5}/i });\n  await expect(orderHeading).toBeVisible();\n  const totalLabel = page.getByText(/Total: \\$\\d+\\.\\d{2}/);\n  await expect(totalLabel).toBeVisible();\n  await page.getByRole('button', { name: /continue to checkout/i }).click();\n});",
      "explanation": "Using RegExp patterns to locate elements with dynamic IDs, prices, and mixed casing."
    },
    "proTip": "Always append the `i` flag (`/my text/i`) to regular expressions so minor copy updates from Marketing don't break your test suite.",
    "commonFollowUp": "Can you combine regular expressions with getByPlaceholder() and getByLabel()?"
  },
  {
    "id": 68,
    "question": "What is the difference between page.getByLabel() and page.getByPlaceholder()?",
    "shortAnswer": "getByLabel targets form controls via permanent <label> or aria-label attributes. getByPlaceholder targets transient input placeholder text that disappears when typed into.",
    "category": "Locators & Interactions",
    "difficulty": "Beginner",
    "tags": [
      "getByLabel",
      "getByPlaceholder",
      "Forms",
      "Accessibility"
    ],
    "detailedExplanation": [
      "`page.getByLabel()` locates form inputs associated with a `<label for='id'>` tag or `aria-labelledby`/`aria-label` attribute.",
      "`page.getByPlaceholder()` locates elements using their HTML `placeholder` attribute.",
      "Why `getByLabel` is superior: labels are permanent visual fixtures of accessible forms, whereas placeholders disappear as soon as user types.",
      "Rule of Thumb: Prefer `getByLabel` for all form inputs. Use `getByPlaceholder` only for transient search boxes that lack visible labels."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('best practice form filling using getByLabel', async ({ page }) => {\n  await page.goto('/signup');\n  await page.getByLabel('Work Email').fill('alice@company.com');\n  await page.getByLabel('Password', { exact: true }).fill('SuperSecret123!');\n  await page.getByPlaceholder('Search documentation...').fill('Locators');\n});",
      "explanation": "Targeting form inputs via accessible labels rather than transient placeholders."
    },
    "proTip": "If you have inputs with similar labels (e.g. 'Email' vs 'Confirm Email'), use `{ exact: true }` to avoid ambiguity errors.",
    "commonFollowUp": "How does getByLabel resolve elements when an input is wrapped inside the <label> tag itself?"
  },
  {
    "id": 69,
    "question": "How do you locate an element by its accessible description using getByRole(role, { description: '...' })?",
    "shortAnswer": "Pass the description option to getByRole to target elements based on their computed accessible description (provided by aria-describedby or title).",
    "category": "Locators & Interactions",
    "difficulty": "Intermediate",
    "tags": [
      "Accessibility",
      "aria-describedby",
      "getByRole",
      "Description"
    ],
    "detailedExplanation": [
      "In HTML, an accessible element has both an Accessible Name (primary label) and an optional Accessible Description (helper text or error messages provided via `aria-describedby` or `title`).",
      "Playwright allows filtering by `{ description: string | RegExp }` in `getByRole()`.",
      "This is extremely powerful when multiple elements share the same accessible name, but have distinct helper descriptions (e.g. two 'Delete' buttons on the same page)."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('distinguish duplicate buttons via accessible descriptions', async ({ page }) => {\n  await page.goto('/settings');\n  const deleteDatabaseBtn = page.getByRole('button', {\n    name: 'Delete',\n    description: /permanently deletes your entire database/i\n  });\n  await deleteDatabaseBtn.click();\n});",
      "explanation": "Using accessible descriptions to uniquely locate elements with identical names."
    },
    "proTip": "Use the `description` filter to verify that form validation error tooltips are properly linked to their inputs via `aria-describedby`.",
    "commonFollowUp": "What happens if an element has both aria-label and aria-describedby?"
  },
  {
    "id": 70,
    "question": "How do you chain locators using .locator() or .getByRole() to target elements inside nested containers?",
    "shortAnswer": "Call locator methods on an existing Locator instance to scope searches strictly within that element's descendants (e.g. card.getByRole('button')).",
    "category": "Locators & Interactions",
    "difficulty": "Beginner",
    "tags": [
      "Chaining",
      "Scoping",
      "Containers",
      "Card Elements"
    ],
    "detailedExplanation": [
      "When testing repeated components (e.g. product cards, table rows), multiple buttons share the same text ('Add to Cart', 'Edit', 'Delete').",
      "Calling `page.getByRole('button', { name: 'Edit' })` throws a strict mode violation error because multiple buttons match.",
      "Locator chaining resolves this by scoping: first locate the specific parent card or row, then query child elements exclusively within that container."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('target specific action button inside a product card', async ({ page }) => {\n  await page.goto('/products');\n  const productCard = page.getByRole('article').filter({ hasText: 'Mechanical Keyboard' });\n  const addToCartBtn = productCard.getByRole('button', { name: 'Add to Cart' });\n  await addToCartBtn.click();\n  await expect(productCard.getByText('$129.99')).toBeVisible();\n});",
      "explanation": "Chaining locators to safely target identical controls within scoped parent cards."
    },
    "proTip": "Chaining does not execute intermediate queries. Playwright merges chained locators into a single optimized search when the action occurs.",
    "commonFollowUp": "What is the difference between locator chaining and XPath descendant axes?"
  },
  {
    "id": 71,
    "question": "How do you use the :has() and :has-text() pseudo-classes in Playwright CSS selectors?",
    "shortAnswer": ":has() matches an element that contains specific descendant selectors. :has-text() matches elements containing a text substring or regex.",
    "category": "Locators & Interactions",
    "difficulty": "Intermediate",
    "tags": [
      ":has",
      ":has-text",
      "CSS Selectors",
      "Advanced Selectors"
    ],
    "detailedExplanation": [
      "Standard CSS cannot select a parent element based on its children. Playwright extends standard CSS with pseudo-classes like `:has()` and `:has-text()`.",
      "- `article:has(button.buy)`: Selects `<article>` only if it contains a child `<button class='buy'>`.",
      "- `div.user-row:has-text('John Doe')`: Selects `<div class='user-row'>` that contains 'John Doe' anywhere in its text subtree.",
      "Alternatively, use `locator.filter({ has: ..., hasText: ... })` which is modern TypeScript equivalent to these pseudo-classes."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('parent selection with :has and filter', async ({ page }) => {\n  await page.goto('/users');\n  const premiumCard = page.locator('.subscription-card').filter({\n    has: page.getByRole('badge', { name: 'Best Value' })\n  });\n  await premiumCard.getByRole('button', { name: 'Choose Plan' }).click();\n});",
      "explanation": "Using locator.filter() to select parent cards based on child criteria."
    },
    "proTip": "Prefer `locator.filter({ has: ... })` over `:has()` string selectors because TypeScript provides full type safety and autocompletion.",
    "commonFollowUp": "Can :has() be nested inside another :has() selector?"
  },
  {
    "id": 72,
    "question": "How do you locate elements inside nested Shadow DOM trees in Playwright?",
    "shortAnswer": "Playwright pierces Shadow DOM automatically by default. Standard CSS selectors and role locators penetrate open shadow roots without special flags.",
    "category": "Locators & Interactions",
    "difficulty": "Intermediate",
    "tags": [
      "Shadow DOM",
      "Web Components",
      "Pierce",
      "Encapsulation"
    ],
    "detailedExplanation": [
      "In traditional Selenium, interacting with Web Components (Shadow DOM) required executing custom JavaScript (`el.shadowRoot.querySelector(...)`) for every single boundary.",
      "In Playwright, all CSS selectors, role locators, text locators, and XPath expressions penetrate open Shadow DOM roots automatically!",
      "If an element is located 3 levels deep inside nested Web Components, calling `page.getByRole('img', { name: 'User Avatar' })` or `page.locator('my-app avatar-badge img')` finds it seamlessly."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('seamless interaction with Web Components and Shadow DOM', async ({ page }) => {\n  await page.goto('/web-components-demo');\n  const sliderThumb = page.locator('custom-slider input[type=\"range\"]');\n  await sliderThumb.fill('75');\n  const customButton = page.getByRole('button', { name: 'Submit Custom Element' });\n  await customButton.click();\n  await expect(page.getByText('Slider updated')).toBeVisible();\n});",
      "explanation": "Interacting directly with elements encapsulated inside Shadow DOM boundaries without extra configuration."
    },
    "proTip": "When testing Web Components, you never need `>>>` or `shadowRoot` helpers in Playwright—standard locators just work.",
    "commonFollowUp": "Does Playwright support locating elements inside closed Shadow DOM roots?"
  },
  {
    "id": 73,
    "question": "How does page.frameLocator() interact with nested iframes (e.g., Stripe, PayPal, or 3D Secure)?",
    "shortAnswer": "page.frameLocator() returns a FrameLocator that can be chained infinitely to traverse nested iframes with full auto-waiting and zero manual context switching.",
    "category": "Locators & Interactions",
    "difficulty": "Advanced",
    "tags": [
      "iFrame",
      "frameLocator",
      "Stripe",
      "Payment"
    ],
    "detailedExplanation": [
      "Payment providers like Stripe and PayPal often render payment forms inside deeply nested iframes (Outer Checkout Page -> Modal iFrame -> Stripe Card Input iFrame).",
      "Older frameworks required imperative `driver.switchTo().frame(0);` and `driver.switchTo().defaultContent();`.",
      "`frameLocator()` is declarative, lazy, and can be chained: `page.frameLocator('iframe#checkout').frameLocator('iframe#card-element').getByPlaceholder('123')`.",
      "If an iframe reloads or changes dynamically, the FrameLocator re-evaluates automatically without stale frame exceptions."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('complete 3D Secure credit card flow in nested iframes', async ({ page }) => {\n  await page.goto('/pay');\n  const modalFrame = page.frameLocator('iframe.payment-modal');\n  const cardFrame = modalFrame.frameLocator('iframe[name=\"__privateStripeFrame\"]');\n  await cardFrame.getByPlaceholder('Card number').fill('4000000000001042');\n  await modalFrame.getByRole('button', { name: 'Pay $50.00' }).click();\n  await expect(page.getByText('Payment Succeeded')).toBeVisible();\n});",
      "explanation": "Chaining FrameLocators to navigate nested payment iframes."
    },
    "proTip": "Never call `page.waitForTimeout()` when waiting for an iframe to load—`frameLocator` auto-waits until the iframe attaches and renders its body.",
    "commonFollowUp": "How can you assert the title or URL of an iframe document?"
  },
  {
    "id": 74,
    "question": "How do you locate elements using relative position locators (e.g., locator(':below(:text(\"Username\"))'))?",
    "shortAnswer": "Use Playwright layout pseudo-classes like :below(), :above(), :right-of(), and :left-of() to locate elements relative to visual layout neighbors.",
    "category": "Locators & Interactions",
    "difficulty": "Advanced",
    "tags": [
      "Layout Locators",
      "Relative Positioning",
      "CSS Pseudo-classes"
    ],
    "detailedExplanation": [
      "Occasionally, form inputs or buttons lack unique IDs, labels, or test attributes, but their visual layout relative to a known text header is consistent.",
      "Playwright provides visual layout selector filters: `:below()`, `:above()`, `:right-of()`, `:left-of()`, and `:near()`.",
      "These examine computed bounding boxes on the rendered screen."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('locate input visually positioned below a heading', async ({ page }) => {\n  await page.goto('/unlabeled-form');\n  const emailInput = page.locator('input:below(:text(\"Email Address\"))').first();\n  await emailInput.fill('user@domain.com');\n  const confirmBtn = page.locator('button:right-of(:text(\"Cancel\"))').first();\n  await confirmBtn.click();\n});",
      "explanation": "Using visual layout selectors based on geometric bounding box coordinates."
    },
    "proTip": "Layout selectors depend on screen geometry. Ensure your browser viewport size is fixed in `playwright.config.ts` so responsive mobile breakpoints don't shift positions.",
    "commonFollowUp": "What happens if two elements are both located below the reference element?"
  },
  {
    "id": 75,
    "question": "What is the difference between locator.fill() and locator.pressSequentially()?",
    "shortAnswer": "fill() instantly clears and sets the entire value via input events (fast). pressSequentially() types character-by-character firing keydown/keyup events (simulates real keystrokes).",
    "category": "Locators & Interactions",
    "difficulty": "Beginner",
    "tags": [
      "fill",
      "pressSequentially",
      "type",
      "Keystrokes",
      "Input"
    ],
    "detailedExplanation": [
      "`locator.fill(value)` is the primary method for populating inputs. It focuses the element, clears existing text, and sets the value in a single operation, triggering `input` and `change` events. It is instantaneous and deterministic.",
      "`locator.pressSequentially(text, { delay })` types characters one by one with an optional millisecond delay between keys, firing `keydown`, `keypress`, and `keyup` for every letter.",
      "Use `pressSequentially` for autocomplete dropdowns or input masks; use `fill()` for 95% of standard inputs for 10x faster execution."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('fill vs pressSequentially comparison', async ({ page }) => {\n  await page.goto('/inputs');\n  await page.getByLabel('Username').fill('standard_user');\n  const searchBox = page.getByPlaceholder('Search products...');\n  await searchBox.pressSequentially('iPhone', { delay: 100 });\n  await expect(page.getByRole('option', { name: 'iPhone 15 Pro' })).toBeVisible();\n});",
      "explanation": "Comparing instant fill() with delayed pressSequentially() for autocomplete search."
    },
    "proTip": "`locator.type()` is deprecated in modern Playwright—always use `locator.pressSequentially()` instead.",
    "commonFollowUp": "Does locator.fill() clear existing input text automatically before filling?"
  },
  {
    "id": 76,
    "question": "How do you simulate key combinations like Control+A, Meta+C, or Shift+Tab with locator.press()?",
    "shortAnswer": "Pass plus-separated key names to locator.press('Control+KeyA') or locator.press('Shift+Tab').",
    "category": "Locators & Interactions",
    "difficulty": "Intermediate",
    "tags": [
      "Keyboard",
      "Shortcuts",
      "press",
      "Modifiers"
    ],
    "detailedExplanation": [
      "Playwright supports all standard keyboard modifiers (`Control`, `Shift`, `Alt`, `Meta` / `Command`) concatenated with a plus sign `+`.",
      "Useful keyboard actions: select all (`Control+A`), delete (`Backspace`), submit (`Enter`), and close dialog (`Escape`).",
      "Playwright automatically translates key names to the appropriate cross-platform virtual key codes."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('simulate keyboard shortcuts and navigation', async ({ page }) => {\n  await page.goto('/editor');\n  const editor = page.getByRole('textbox');\n  await editor.fill('Original Content');\n  await editor.press('Control+KeyA');\n  await editor.press('Backspace');\n  await expect(editor).toHaveValue('');\n  await page.getByRole('dialog').press('Escape');\n});",
      "explanation": "Using locator.press with modifier keys to execute desktop shortcuts."
    },
    "proTip": "Use `ControlOrMeta` (e.g. `'ControlOrMeta+KeyA'`) to write shortcuts that work automatically on both Windows/Linux (Control) and macOS (Command).",
    "commonFollowUp": "What is the difference between page.keyboard.press() and locator.press()?"
  },
  {
    "id": 77,
    "question": "How do you perform drag-and-drop operations with locator.dragTo() vs low-level mouse movements?",
    "shortAnswer": "locator.dragTo(target) performs high-level drag and drop automatically. For complex HTML5 drag events or canvas games, use page.mouse.down(), move(), and up().",
    "category": "Locators & Interactions",
    "difficulty": "Intermediate",
    "tags": [
      "Drag and Drop",
      "dragTo",
      "Mouse",
      "Kanban"
    ],
    "detailedExplanation": [
      "`sourceLocator.dragTo(targetLocator)` is the high-level method. It automatically hovers the source element, presses mouse button down, moves mouse to target element's center, and releases the mouse.",
      "Options for `dragTo()` include `{ sourcePosition, targetPosition, force }` for targeting specific offsets within an element.",
      "When `dragTo()` fails on custom HTML5 drag-and-drop APIs, fall back to manual `page.mouse` actions or dispatching custom drag events via `page.evaluate()`."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('drag item from backlog to in-progress column', async ({ page }) => {\n  await page.goto('/kanban');\n  const card = page.getByRole('listitem', { name: 'Bug #402' });\n  const targetColumn = page.getByRole('region', { name: 'In Progress' });\n  await card.dragTo(targetColumn);\n  await expect(targetColumn.getByRole('listitem', { name: 'Bug #402' })).toBeVisible();\n});",
      "explanation": "Dragging a Kanban card into a new column using locator.dragTo()."
    },
    "proTip": "If dragging fails, specify precise coordinate offsets: `source.dragTo(target, { targetPosition: { x: 10, y: 10 } })`.",
    "commonFollowUp": "How do you simulate drag and drop to reorder items within the same sortable list?"
  },
  {
    "id": 78,
    "question": "How do you select multiple options from a <select multiple> dropdown using selectOption()?",
    "shortAnswer": "Pass an array of values, visible labels, or index objects to locator.selectOption(['val1', 'val2']).",
    "category": "Locators & Interactions",
    "difficulty": "Beginner",
    "tags": [
      "selectOption",
      "Dropdown",
      "Multi-Select",
      "Forms"
    ],
    "detailedExplanation": [
      "Standard HTML `<select>` and `<select multiple>` elements are handled natively by `locator.selectOption()`.",
      "You can select by value attribute, visible text label, or index.",
      "Playwright auto-waits for all option elements to appear in the DOM and automatically fires the `change` and `input` events on the `<select>`."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('multi-select option handling', async ({ page }) => {\n  await page.goto('/settings');\n  const multiSelect = page.getByLabel('Notification Channels');\n  await multiSelect.selectOption(['email', 'sms', 'slack']);\n  await expect(multiSelect).toHaveValues(['email', 'sms', 'slack']);\n});",
      "explanation": "Selecting multiple options simultaneously from a standard multi-select dropdown."
    },
    "proTip": "Use `await expect(locator).toHaveValues([...])` to verify that all intended options were successfully chosen.",
    "commonFollowUp": "Does selectOption() work on custom dropdowns built with div and span elements?"
  },
  {
    "id": 79,
    "question": "How do you interact with custom select dropdowns built with React, Vue, or Tailwind that do not use <select>?",
    "shortAnswer": "Treat custom dropdowns as normal buttons and list items: click the trigger button to open, then click the desired getByRole('option') item.",
    "category": "Locators & Interactions",
    "difficulty": "Intermediate",
    "tags": [
      "Custom Dropdowns",
      "Combobox",
      "React Select",
      "Headless UI"
    ],
    "detailedExplanation": [
      "Modern UI component libraries replace native `<select>` tags with accessible custom DOM structures (`<div role='combobox'>` and `<div role='listbox'>`).",
      "`locator.selectOption()` will fail on these components because there is no underlying `<select>` tag.",
      "The correct Playwright approach: 1. Click trigger combobox, 2. Click option from popup listbox."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('interact with custom accessible combobox', async ({ page }) => {\n  await page.goto('/signup');\n  await page.getByRole('combobox', { name: 'Select Country' }).click();\n  const option = page.getByRole('option', { name: 'Germany' });\n  await option.click();\n  await expect(page.getByRole('combobox', { name: 'Select Country' })).toHaveText(/Germany/);\n});",
      "explanation": "Interacting with modern custom ARIA combobox and listbox dropdowns."
    },
    "proTip": "If the listbox has many items with virtual scrolling, type the first few letters after opening to trigger quick jump filtering.",
    "commonFollowUp": "How do you handle custom dropdowns that render in a React Portal at the end of the body?"
  },
  {
    "id": 80,
    "question": "How do you trigger right-click (context menu) and double-click using locator.click({ button: 'right' }) and dblclick()?",
    "shortAnswer": "Pass button: 'right' or 'middle' to locator.click() for right/middle clicks. Use locator.dblclick() for double clicks.",
    "category": "Locators & Interactions",
    "difficulty": "Beginner",
    "tags": [
      "Right-Click",
      "Context Menu",
      "Double Click",
      "Mouse Actions"
    ],
    "detailedExplanation": [
      "Playwright provides full mouse button fidelity for rich web applications.",
      "- Right-click: `await locator.click({ button: 'right' })` triggers the browser `contextmenu` event.",
      "- Middle-click: `await locator.click({ button: 'middle' })` (useful for testing 'open in new tab' behavior).",
      "- Double-click: `await locator.dblclick()` fires two click events in rapid succession followed by `dblclick`."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('test context menu and inline cell editing', async ({ page }) => {\n  await page.goto('/spreadsheet');\n  const cell = page.getByTestId('cell-A1');\n  await cell.click({ button: 'right' });\n  await page.getByRole('menuitem', { name: 'Format as Currency' }).click();\n  await cell.dblclick();\n  await page.keyboard.fill('500');\n  await page.keyboard.press('Enter');\n  await expect(cell).toHaveText('$500.00');\n});",
      "explanation": "Using right-click for context menus and double-click for inline editing."
    },
    "proTip": "When right-clicking, always assert that the resulting custom context menu appears before interacting with its menu items.",
    "commonFollowUp": "How do you dismiss a custom context menu by clicking outside?"
  },
  {
    "id": 81,
    "question": "How do you simulate hovering over elements to trigger CSS hover states or delayed tooltips with locator.hover()?",
    "shortAnswer": "locator.hover() auto-waits for element visibility, scrolls it into view, and moves the virtual mouse pointer to its center, triggering CSS :hover and mouseenter events.",
    "category": "Locators & Interactions",
    "difficulty": "Beginner",
    "tags": [
      "hover",
      "Tooltips",
      "Flyout Menus",
      "Mouse"
    ],
    "detailedExplanation": [
      "Hovering in Playwright is fully synthetic and reliable. `locator.hover()` scrolls the element into view and moves the mouse cursor over it.",
      "Useful scenarios: multi-level dropdown navigation menus, tooltip popovers, image zoom overlays, and action buttons revealed only on row hover.",
      "To dismiss a hover state, hover over another element or call `page.mouse.move(0, 0)`."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('verify tooltip display on icon hover', async ({ page }) => {\n  await page.goto('/dashboard');\n  const infoIcon = page.getByRole('button', { name: 'More Information' });\n  await infoIcon.hover();\n  const tooltip = page.getByRole('tooltip');\n  await expect(tooltip).toBeVisible();\n  await expect(tooltip).toHaveText('Your monthly usage quota resets on the 1st.');\n});",
      "explanation": "Triggering accessible tooltip components via locator.hover()."
    },
    "proTip": "If hover menus close instantly when moving away, check if the CSS transition requires a brief timeout or if you need to hover the parent menu container first.",
    "commonFollowUp": "How do you test mouse hover effects on mobile emulations where hover is not supported?"
  },
  {
    "id": 82,
    "question": "How do you handle file uploads using locator.setInputFiles() with single, multiple, or drag-and-drop file inputs?",
    "shortAnswer": "Use locator.setInputFiles(filePath | [filePaths]) directly on <input type='file'> to upload files without dealing with OS file picker dialogs.",
    "category": "Locators & Interactions",
    "difficulty": "Intermediate",
    "tags": [
      "File Upload",
      "setInputFiles",
      "Attachments",
      "Forms"
    ],
    "detailedExplanation": [
      "Native OS file upload dialogs cannot be automated with standard browser JavaScript because they are OS-level dialogs.",
      "Playwright bypasses the OS dialog completely: `locator.setInputFiles()` attaches files directly to the underlying `<input type='file'>` DOM element.",
      "Features: single file uploads (`'path/to/file.pdf'`), multiple files (`['file1.png', 'file2.png']`), buffer payloads without creating disk files, and clearing uploads with `setInputFiles([])`."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('upload profile picture and PDF document', async ({ page }) => {\n  await page.goto('/profile');\n  const fileInput = page.locator('input[type=\"file\"]');\n  await fileInput.setInputFiles('tests/fixtures/avatar.png');\n  await expect(page.getByText('avatar.png uploaded')).toBeVisible();\n  await fileInput.setInputFiles([]); // Clears selected file\n});",
      "explanation": "Attaching files to input elements directly using locator.setInputFiles()."
    },
    "proTip": "You can upload dynamically generated in-memory files: `setInputFiles({ name: 'test.csv', mimeType: 'text/csv', buffer: Buffer.from('id,name\\n1,Alice') })`.",
    "commonFollowUp": "How do you handle file upload when the <input type='file'> is hidden with display: none?"
  },
  {
    "id": 83,
    "question": "How do you test file uploads when the <input type='file'> is hidden or styled with display: none?",
    "shortAnswer": "Target the hidden input[type='file'] element directly with locator('input[type=\"file\"]').setInputFiles(), or listen for page.waitForEvent('filechooser').",
    "category": "Locators & Interactions",
    "difficulty": "Advanced",
    "tags": [
      "filechooser",
      "Hidden Input",
      "Custom Upload Button"
    ],
    "detailedExplanation": [
      "Modern websites almost always hide native `<input type='file'>` with `display: none` or `opacity: 0`, replacing it with a styled button like 'Upload Document'.",
      "Approach 1 (Direct): `setInputFiles` does NOT require the input to be visible! You can call `page.locator('input[type=\"file\"]').setInputFiles('path')` directly.",
      "Approach 2 (Event-Driven): If clicking the styled button triggers a hidden file chooser, use `page.waitForEvent('filechooser')`."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('upload file via styled button using filechooser event', async ({ page }) => {\n  await page.goto('/upload');\n  const fileChooserPromise = page.waitForEvent('filechooser');\n  await page.getByRole('button', { name: 'Upload Invoice' }).click();\n  const fileChooser = await fileChooserPromise;\n  await fileChooser.setFiles('tests/fixtures/invoice.pdf');\n  await expect(page.getByText('invoice.pdf')).toBeVisible();\n});",
      "explanation": "Using page.waitForEvent('filechooser') to intercept file pickers triggered by custom buttons."
    },
    "proTip": "Approach 2 (`waitForEvent('filechooser')`) is the cleanest because it tests the exact user flow: clicking the visible UI button.",
    "commonFollowUp": "Can you assert whether a file input accepts multiple files using fileChooser.isMultiple()?"
  },
  {
    "id": 84,
    "question": "How do you clear an input field that triggers formatters (e.g., currency or phone number masks)?",
    "shortAnswer": "Select all text with press('ControlOrMeta+A') followed by press('Backspace'), or call locator.clear().",
    "category": "Locators & Interactions",
    "difficulty": "Intermediate",
    "tags": [
      "Input Masks",
      "clear",
      "Formatters",
      "Forms"
    ],
    "detailedExplanation": [
      "Inputs with JavaScript masks (credit card formatting, telephone dashes, currency symbols) often break when using `locator.fill('')` because the mask script re-inserts formatting characters when empty.",
      "`locator.clear()` attempts to clear the input value and fire change events.",
      "For stubborn masked inputs, the most reliable real-world simulation is selecting all text (`ControlOrMeta+A`) and pressing `Backspace`."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('clear and re-populate masked currency input', async ({ page }) => {\n  await page.goto('/finance');\n  const amountInput = page.getByLabel('Loan Amount');\n  await amountInput.press('ControlOrMeta+A');\n  await amountInput.press('Backspace');\n  await amountInput.pressSequentially('75000', { delay: 50 });\n  await expect(amountInput).toHaveValue('$75,000.00');\n});",
      "explanation": "Using keyboard selection shortcuts to reset masked inputs."
    },
    "proTip": "If an input mask resists `clear()`, triple-click the input (`locator.click({ clickCount: 3 })`) to highlight all text before typing.",
    "commonFollowUp": "Why does locator.fill('') sometimes fail to trigger React state updates on masked inputs?"
  },
  {
    "id": 85,
    "question": "How do you click an element at specific coordinates using locator.click({ position: { x, y } })?",
    "shortAnswer": "Pass position: { x: number, y: number } in pixels relative to the top-left corner of the element's bounding box.",
    "category": "Locators & Interactions",
    "difficulty": "Intermediate",
    "tags": [
      "Coordinates",
      "Position Click",
      "Canvas",
      "Maps"
    ],
    "detailedExplanation": [
      "By default, `locator.click()` clicks the exact geometric center of an element.",
      "If you need to click a specific region—such as an interactive SVG chart slice, a progress bar scrub position, or a canvas game UI—pass `{ position: { x, y } }`.",
      "`x` and `y` are measured in CSS pixels relative to the top-left corner of the element's border box."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('click specific offset on interactive timeline scrubber', async ({ page }) => {\n  await page.goto('/video-player');\n  const progressBar = page.getByRole('slider', { name: 'Video progress' });\n  const box = await progressBar.boundingBox();\n  if (box) {\n    await progressBar.click({ position: { x: box.width * 0.75, y: box.height / 2 } });\n  }\n  await expect(page.getByTestId('current-time')).toHaveText('01:30');\n});",
      "explanation": "Clicking 75% across a timeline scrubber using calculated coordinate offsets."
    },
    "proTip": "Use `locator.boundingBox()` to calculate dynamic relative percentages rather than hardcoding static pixel offsets.",
    "commonFollowUp": "What happens if position coordinates exceed the element's bounding box dimensions?"
  },
  {
    "id": 86,
    "question": "What are the exact actionability checks Playwright performs before clicking an element?",
    "shortAnswer": "Playwright verifies: 1. Attached to DOM, 2. Visible, 3. Stable (not animating), 4. Receives Events (not obscured), 5. Enabled.",
    "category": "Auto-Waiting & Assertions",
    "difficulty": "Intermediate",
    "tags": [
      "Actionability",
      "Auto-Waiting",
      "Stability",
      "Core Engine"
    ],
    "detailedExplanation": [
      "Before performing any action (`click`, `dblclick`, `check`, `fill`), Playwright runs an automated Actionability Checklist:",
      "1. Attached: Element is present in the DOM tree.",
      "2. Visible: Element has non-empty bounding box and is not hidden by CSS display/visibility/opacity.",
      "3. Stable: Element has finished animating or scrolling (its position is constant over consecutive frames).",
      "4. Receives Events: Point is not obscured by sticky headers, modal overlays, or loading backdrops.",
      "5. Enabled: Element does not possess the `disabled` attribute.",
      "If any check fails, Playwright retries continuously until the timeout expires (default 30s)."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('actionability checks prevent clicking during animation', async ({ page }) => {\n  await page.goto('/sliding-menu');\n  const menuButton = page.getByRole('button', { name: 'Save Changes' });\n  // Playwright waits until the sliding CSS transition stops moving before clicking:\n  await menuButton.click();\n  await expect(page.getByText('Saved')).toBeVisible();\n});",
      "explanation": "Playwright automatically verifies stability and non-obscured status before clicking."
    },
    "proTip": "You can bypass actionability checks with `{ force: true }`, but use it sparingly—it clicks elements even if covered by modals!",
    "commonFollowUp": "How does Playwright determine whether an element is obscured by another element?"
  },
  {
    "id": 87,
    "question": "What causes an 'Element is not visible' or 'Element is not stable' timeout in Playwright?",
    "shortAnswer": "Infinite CSS animations, sticky headers overlaying buttons, offscreen placement, or layout thrashing prevent actionability checks from passing.",
    "category": "Auto-Waiting & Assertions",
    "difficulty": "Intermediate",
    "tags": [
      "Actionability Timeout",
      "Debugging",
      "Animations",
      "Obscured"
    ],
    "detailedExplanation": [
      "Common causes for actionability timeouts:",
      "1. Element is not visible: `display: none`, `visibility: hidden`, or zero bounding box (`width: 0`, `height: 0`).",
      "2. Element is not stable: An infinite CSS animation (e.g. pulsing glow, rotating loader) or smooth scroll keeps shifting bounding coordinates.",
      "3. Element does not receive pointer events: A sticky navigation bar or invisible modal overlay intercepts the click at coordinates (x, y).",
      "Check the Playwright error log: it prints the exact element that intercepted the pointer event!"
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "// If an animation causes 'not stable' timeouts, disable animations in config:\n// playwright.config.ts\nexport default defineConfig({\n  use: {\n    // Injects CSS to disable all transitions and animations:\n    contextOptions: {\n      reducedMotion: 'reduce',\n    },\n  },\n});",
      "explanation": "Disabling animations globally to prevent stability check timeouts."
    },
    "proTip": "Trace Viewer is your best friend for actionability errors: hover over the action to see the exact red dot where Playwright tried to click.",
    "commonFollowUp": "How do you inspect the topmost element at specific coordinates using page.evaluate()?"
  },
  {
    "id": 88,
    "question": "How do you configure custom assertion timeouts globally and locally per assertion?",
    "shortAnswer": "Configure expect: { timeout: 5000 } globally in playwright.config.ts, or pass { timeout: 10000 } as an option to individual expect() calls.",
    "category": "Auto-Waiting & Assertions",
    "difficulty": "Beginner",
    "tags": [
      "Timeouts",
      "expect",
      "playwright.config.ts",
      "Configuration"
    ],
    "detailedExplanation": [
      "Playwright has two distinct timeout mechanisms:",
      "1. Action Timeout (`timeout: 30000`): How long `click()`, `fill()`, and `goto()` wait for actionability.",
      "2. Assertion Timeout (`expect: { timeout: 5000 }`): How long web-first assertions like `expect(locator).toBeVisible()` poll the DOM before failing.",
      "By default, assertion timeout is 5 seconds. This is deliberately shorter than action timeouts to fail fast when expected text does not appear.",
      "You can override the timeout for a single slow assertion: `await expect(locator).toBeVisible({ timeout: 15000 })`."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "// Global configuration in playwright.config.ts:\nimport { defineConfig } from '@playwright/test';\n\nexport default defineConfig({\n  timeout: 30000, // 30s per test case\n  expect: {\n    timeout: 7000, // 7s for web-first assertions\n  },\n});\n\n// Local override in a test:\n// await expect(page.getByText('Report Generated')).toBeVisible({ timeout: 20000 });",
      "explanation": "Configuring global assertion timeouts and per-assertion overrides."
    },
    "proTip": "Never increase global assertion timeouts to 30s—it slows down failing test runs. Only increase timeouts on known slow operations like PDF generation.",
    "commonFollowUp": "What is the difference between test timeout, action timeout, and expect timeout?"
  },
  {
    "id": 89,
    "question": "What is the difference between toBeAttached() and toBeVisible()?",
    "shortAnswer": "toBeAttached checks if an element exists in the DOM tree. toBeVisible checks that it exists AND is visually rendered with non-zero dimensions and not hidden.",
    "category": "Auto-Waiting & Assertions",
    "difficulty": "Beginner",
    "tags": [
      "toBeAttached",
      "toBeVisible",
      "DOM vs Visual",
      "Assertions"
    ],
    "detailedExplanation": [
      "`await expect(locator).toBeAttached()` verifies the element is in the DOM. An element with `style='display: none'` or `opacity: 0` IS attached.",
      "`await expect(locator).toBeVisible()` verifies the element is attached AND has width/height > 0 and is not hidden by CSS display/visibility/opacity.",
      "95% of the time, tests should use `toBeVisible()` because real users only care about elements they can see and interact with.",
      "Use `toBeAttached()` when testing hidden metadata, analytics tags, or elements before triggering slide-in animations."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('attached vs visible distinction', async ({ page }) => {\n  await page.goto('/demo');\n  const hiddenInput = page.locator('input[type=\"hidden\"]');\n  await expect(hiddenInput).toBeAttached(); // PASSES\n  // await expect(hiddenInput).toBeVisible(); // FAILS because it has zero dimensions!\n\n  const visibleBtn = page.getByRole('button', { name: 'Submit' });\n  await expect(visibleBtn).toBeVisible(); // PASSES (Attached + Rendered)\n});",
      "explanation": "Comparing DOM attachment with visual rendered visibility."
    },
    "proTip": "If you want to assert an element has been removed from the DOM entirely, use `await expect(locator).not.toBeAttached()`.",
    "commonFollowUp": "Does toBeVisible() consider an element hidden if it is scrolled offscreen?"
  },
  {
    "id": 90,
    "question": "How do you assert that an element disappears or is removed from the DOM using toBeHidden() vs not.toBeAttached()?",
    "shortAnswer": "toBeHidden() asserts the element is either detached OR hidden via CSS (display: none). not.toBeAttached() strictly asserts the element is completely absent from DOM.",
    "category": "Auto-Waiting & Assertions",
    "difficulty": "Intermediate",
    "tags": [
      "toBeHidden",
      "not.toBeAttached",
      "Modal Dismissal",
      "Spinners"
    ],
    "detailedExplanation": [
      "When verifying that a loading spinner, modal dialog, or notification banner has gone away:",
      "`await expect(locator).toBeHidden()` succeeds if the element is detached OR if it remains in the DOM with `display: none`, `visibility: hidden`, or `opacity: 0`.",
      "`await expect(locator).not.toBeAttached()` succeeds ONLY if the element has been completely unmounted from the DOM tree (e.g. React conditionally unmounted `{isLoading && <Spinner />}`).",
      "For loading spinners, `toBeHidden()` is preferred because it handles both CSS fading and React unmounting."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('wait for spinner to disappear after form submission', async ({ page }) => {\n  await page.goto('/submit');\n  await page.getByRole('button', { name: 'Save' }).click();\n  const spinner = page.getByTestId('loading-spinner');\n  // Auto-waits until spinner disappears:\n  await expect(spinner).toBeHidden({ timeout: 10000 });\n  await expect(page.getByText('Saved successfully')).toBeVisible();\n});",
      "explanation": "Auto-waiting for loading overlays to disappear using toBeHidden()."
    },
    "proTip": "Never use `page.waitForTimeout(3000)` to wait for a spinner—use `await expect(spinner).toBeHidden()`.",
    "commonFollowUp": "What happens if the element never existed in the DOM when toBeHidden() is called?"
  },
  {
    "id": 91,
    "question": "How do you assert that an element has specific CSS styles or classes using toHaveCSS() and toHaveClass()?",
    "shortAnswer": "toHaveCSS(property, value | RegExp) asserts computed styles (e.g. background-color). toHaveClass(class | RegExp) asserts class names.",
    "category": "Auto-Waiting & Assertions",
    "difficulty": "Intermediate",
    "tags": [
      "toHaveCSS",
      "toHaveClass",
      "Styling",
      "Computed Style"
    ],
    "detailedExplanation": [
      "`toHaveCSS('color', 'rgb(255, 0, 0)')` examines the browser's computed style (values resolved by `window.getComputedStyle(element)`). Note that colors are resolved to `rgb()` or `rgba()` format.",
      "`toHaveClass('btn-active')` asserts against the `class` attribute string. Supports regex: `toHaveClass(/active/)`.",
      "Testing arrays of classes for multiple items: `await expect(page.locator('li')).toHaveClass(['done', 'pending', 'done'])`."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('assert error highlight color and active class', async ({ page }) => {\n  await page.goto('/forms');\n  const input = page.getByLabel('Email');\n  await input.fill('invalid-email');\n  await page.getByRole('button', { name: 'Submit' }).click();\n  // Assert CSS class added by React:\n  await expect(input).toHaveClass(/border-red-500/);\n  // Assert computed border color:\n  await expect(input).toHaveCSS('border-color', 'rgb(239, 68, 68)');\n});",
      "explanation": "Validating both CSS class attributes and computed browser styles."
    },
    "proTip": "Always use regular expressions with `toHaveClass(/my-class/)` so other utility classes (Tailwind, Bootstrap) don't cause false assertion failures.",
    "commonFollowUp": "How does toHaveCSS() handle inherited CSS properties?"
  },
  {
    "id": 92,
    "question": "How do you assert array counts and lists of elements using toHaveCount() and toHaveText([ ... ])?",
    "shortAnswer": "toHaveCount(n) auto-waits for a collection to have exactly n elements. toHaveText(['A', 'B']) asserts exact text items in order.",
    "category": "Auto-Waiting & Assertions",
    "difficulty": "Beginner",
    "tags": [
      "toHaveCount",
      "toHaveText",
      "Collections",
      "Lists"
    ],
    "detailedExplanation": [
      "`await expect(locator).toHaveCount(5)` auto-retries until exactly 5 elements match the locator. This is superior to `expect(await locator.count()).toBe(5)` which does not auto-retry!",
      "`await expect(locator).toHaveText(['Item 1', 'Item 2', 'Item 3'])` verifies that all elements in the list match the provided strings in order.",
      "Supports partial text matching via `toContainText(['Part 1', 'Part 2'])`."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('verify list count and item ordering', async ({ page }) => {\n  await page.goto('/todos');\n  const todoItems = page.getByRole('listitem');\n  // Auto-waits for initial items to render:\n  await expect(todoItems).toHaveCount(3);\n  // Verify text content of all 3 items in order:\n  await expect(todoItems).toHaveText([\n    'Buy Groceries',\n    'Pay Electric Bill',\n    'Schedule Doctor Visit'\n  ]);\n});",
      "explanation": "Web-first assertions verifying collection length and ordered content."
    },
    "proTip": "Always prefer `await expect(locator).toHaveCount(n)` over `expect((await locator.all()).length).toBe(n)`.",
    "commonFollowUp": "How do you assert that a list has at least one element without knowing the exact count?"
  },
  {
    "id": 93,
    "question": "What are Soft Assertions (expect.soft()) and when should you use them over standard assertions?",
    "shortAnswer": "expect.soft() collects assertion failures without stopping test execution immediately, allowing you to inspect multiple errors in a single test run.",
    "category": "Auto-Waiting & Assertions",
    "difficulty": "Intermediate",
    "tags": [
      "expect.soft",
      "Soft Assertions",
      "Reporting",
      "Diagnostics"
    ],
    "detailedExplanation": [
      "Standard `expect()` throws an error immediately on failure, terminating the test case at the first broken expectation.",
      "`expect.soft()` records the assertion failure, marks the test as failed in reports, but continues running subsequent lines.",
      "Ideal use cases: verifying 10 different fields on a profile summary card, validating all links in a navigation footer, or visual regression checklists.",
      "Check `test.info().errors` at any point to inspect accumulated soft failures."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('validate all user profile details in one pass', async ({ page }) => {\n  await page.goto('/profile');\n  // Soft assertions continue even if one fails:\n  await expect.soft(page.getByTestId('name')).toHaveText('Jane Doe');\n  await expect.soft(page.getByTestId('role')).toHaveText('Lead Architect');\n  await expect.soft(page.getByTestId('department')).toHaveText('Platform Engineering');\n  await expect.soft(page.getByTestId('status')).toHaveText('Active');\n});",
      "explanation": "Using expect.soft() to capture multiple field validation failures in a single run."
    },
    "proTip": "Do not use soft assertions before critical flow dependencies: if login fails, a soft assertion is useless because subsequent steps will crash anyway.",
    "commonFollowUp": "Can you fail a test conditionally based on the count of accumulated soft assertion errors?"
  },
  {
    "id": 94,
    "question": "How do you write custom Poll Assertions using expect.poll() to wait for backend or async state?",
    "shortAnswer": "expect.poll(async () => fn(), { intervals, timeout }).toBe(expected) repeatedly evaluates an async function until it satisfies the expectation.",
    "category": "Auto-Waiting & Assertions",
    "difficulty": "Advanced",
    "tags": [
      "expect.poll",
      "Polling",
      "Async State",
      "Database / API"
    ],
    "detailedExplanation": [
      "Sometimes you need to assert against state outside the DOM: a database record, an external API, a background job status, or a cookie.",
      "`expect.poll(asyncFn, options)` converts any asynchronous function into an auto-retrying web-first assertion.",
      "Options include `{ message, timeout, intervals: [500, 1000, 2000] }`.",
      "It eliminates manual `while` loops and hardcoded `sleep` calls."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('poll database until background export finishes', async ({ page, request }) => {\n  await page.goto('/export');\n  await page.getByRole('button', { name: 'Start Export' }).click();\n  // Repeatedly call API until job status reaches 'COMPLETED':\n  await expect.poll(async () => {\n    const res = await request.get('/api/export/status');\n    const data = await res.json();\n    return data.status;\n  }, {\n    message: 'Export job failed to complete within timeout',\n    timeout: 30000,\n    intervals: [1000, 2000, 3000]\n  }).toBe('COMPLETED');\n});",
      "explanation": "Using expect.poll to wait for asynchronous backend job completion."
    },
    "proTip": "Use `expect.poll` whenever you find yourself tempted to write `while (!ready) await page.waitForTimeout(1000)`.",
    "commonFollowUp": "What is the difference between expect.poll() and expect.toPass()?"
  },
  {
    "id": 95,
    "question": "How do you use expect(async () => { ... }).toPass() for custom auto-retrying code blocks?",
    "shortAnswer": "expect(async () => { ... }).toPass({ timeout }) retries an entire block of actions and assertions until no exceptions are thrown.",
    "category": "Auto-Waiting & Assertions",
    "difficulty": "Advanced",
    "tags": [
      "toPass",
      "Retry Block",
      "Auto-Waiting",
      "Complex Flakiness"
    ],
    "detailedExplanation": [
      "While `expect.poll` monitors a single return value, `expect().toPass()` retries an entire multi-step block of code.",
      "If any assertion or locator action inside the block throws an error, Playwright catches it, waits for the polling interval, and re-executes the entire block from the beginning.",
      "Ideal for: refreshing a page until dynamic data updates, or retrying an operation that experiences transient network 503 errors."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('retry refreshing page until order status updates', async ({ page }) => {\n  await page.goto('/orders/1024');\n  // Retries reload and assertion until it passes:\n  await expect(async () => {\n    await page.reload();\n    await expect(page.getByTestId('order-status')).toHaveText('Shipped', { timeout: 1000 });\n  }).toPass({\n    intervals: [2000, 5000],\n    timeout: 30000\n  });\n});",
      "explanation": "Using expect().toPass() to auto-retry an action + assertion block until success."
    },
    "proTip": "Ensure blocks passed to `toPass()` are idempotent (safe to retry multiple times without creating duplicate records).",
    "commonFollowUp": "How does toPass() configure its retry intervals?"
  },
  {
    "id": 96,
    "question": "How do you assert that an input has a specific value using toHaveValue() vs toHaveText()?",
    "shortAnswer": "toHaveValue() checks input/textarea element values (DOM .value property). toHaveText() checks inner text content of container elements.",
    "category": "Auto-Waiting & Assertions",
    "difficulty": "Beginner",
    "tags": [
      "toHaveValue",
      "toHaveText",
      "Forms",
      "Inputs"
    ],
    "detailedExplanation": [
      "HTML `<input>` and `<textarea>` elements store user input in their DOM `.value` property, NOT as inner text between opening and closing tags.",
      "Calling `expect(page.getByLabel('Name')).toHaveText('John')` will FAIL because an `<input>` has empty inner text.",
      "Always use `await expect(locator).toHaveValue('John')` for form controls.",
      "Supports regular expressions: `await expect(input).toHaveValue(/\\d{4}-\\d{2}-\\d{2}/)`."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('assert input value vs container text', async ({ page }) => {\n  await page.goto('/form');\n  const emailInput = page.getByLabel('Email');\n  await emailInput.fill('user@domain.com');\n  // ✅ Correct for input fields:\n  await expect(emailInput).toHaveValue('user@domain.com');\n  // ✅ Correct for standard text elements (h1, p, span):\n  await expect(page.getByRole('heading')).toHaveText('Account Settings');\n});",
      "explanation": "Using toHaveValue for inputs and toHaveText for DOM elements."
    },
    "proTip": "To assert that an input is completely empty, use `await expect(input).toHaveValue('')`.",
    "commonFollowUp": "How do you assert the value of a <select> element using toHaveValue()?"
  },
  {
    "id": 97,
    "question": "How do you assert that an attribute contains a value using toHaveAttribute() with regular expressions?",
    "shortAnswer": "await expect(locator).toHaveAttribute(name, stringOrRegex) asserts the attribute's existence and matches its value.",
    "category": "Auto-Waiting & Assertions",
    "difficulty": "Beginner",
    "tags": [
      "toHaveAttribute",
      "Attributes",
      "Regex",
      "DOM"
    ],
    "detailedExplanation": [
      "`toHaveAttribute('href', '/dashboard')` verifies that an HTML attribute matches an exact string.",
      "Passing a regular expression allows flexible matching: `toHaveAttribute('src', /.*\\/avatars\\/\\d+\\.png/)` or `toHaveAttribute('href', /.*github\\.com/i)`.",
      "You can also check for attribute presence without validating value: `await expect(locator).toHaveAttribute('data-active')`."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('verify link targets and image sources', async ({ page }) => {\n  await page.goto('/links');\n  const docsLink = page.getByRole('link', { name: 'API Reference' });\n  await expect(docsLink).toHaveAttribute('href', /\\/docs\\/api/);\n  await expect(docsLink).toHaveAttribute('target', '_blank');\n  const avatar = page.getByRole('img', { name: 'User avatar' });\n  await expect(avatar).toHaveAttribute('src', /.*\\.webp$/);\n});",
      "explanation": "Asserting HTML attribute values with regex matching."
    },
    "proTip": "Use `toHaveAttribute('aria-invalid', 'true')` to verify that accessible form error indicators are set.",
    "commonFollowUp": "What is the difference between toHaveAttribute() and locator.getAttribute()?"
  },
  {
    "id": 98,
    "question": "How do you assert visual regressions using toHaveScreenshot() with custom tolerance and masking?",
    "shortAnswer": "await expect(page).toHaveScreenshot('name.png', { maxDiffPixelRatio: 0.05, mask: [locators] }) compares pixel screenshots against committed baseline golden images.",
    "category": "Auto-Waiting & Assertions",
    "difficulty": "Advanced",
    "tags": [
      "Visual Regression",
      "toHaveScreenshot",
      "Masking",
      "Pixelmatch"
    ],
    "detailedExplanation": [
      "Playwright has built-in pixel visual comparison testing. On the first run, it generates a golden baseline image. Subsequent runs compare pixels and fail if difference exceeds threshold.",
      "Key options:",
      "- `maxDiffPixelRatio`: Acceptable percentage difference (e.g. 0.02 = 2% pixel tolerance).",
      "- `mask`: Array of locators to mask with a pink rectangle before screenshot (e.g. dynamic timestamps, avatars, ads).",
      "- `fullPage: true`: Captures full scrollable document.",
      "Update baselines via CLI: `npx playwright test --update-snapshots`."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('visual regression on dashboard with masked dynamic widgets', async ({ page }) => {\n  await page.goto('/dashboard');\n  // Compare screenshot while masking dynamic clock and user avatar:\n  await expect(page).toHaveScreenshot('dashboard-golden.png', {\n    maxDiffPixelRatio: 0.02,\n    mask: [\n      page.getByTestId('live-clock'),\n      page.getByTestId('user-avatar')\n    ],\n    animations: 'disabled'\n  });\n});",
      "explanation": "Visual comparison testing with masked dynamic widgets and disabled animations."
    },
    "proTip": "Always run visual snapshot tests in Docker on CI so differences in font rendering between macOS and Linux don't fail the build.",
    "commonFollowUp": "How does Playwright manage screenshot baselines across different browser engines (Chromium vs Firefox)?"
  },
  {
    "id": 99,
    "question": "How do you mask dynamic timestamps, avatars, or ads during toHaveScreenshot() visual comparisons?",
    "shortAnswer": "Pass an array of locators to the mask option in toHaveScreenshot({ mask: [locator1, locator2] }).",
    "category": "Auto-Waiting & Assertions",
    "difficulty": "Intermediate",
    "tags": [
      "Visual Testing",
      "Masking",
      "toHaveScreenshot",
      "Dynamic Content"
    ],
    "detailedExplanation": [
      "Dynamic content (current date/time, random advertising banners, live stock prices) causes 100% false failures in visual regression testing.",
      "The `mask` option instructs Playwright to paint solid pink `#FF00FF` bounding boxes over the specified locators immediately before taking the screenshot.",
      "Because the mask is painted on both baseline and test screenshots, dynamic changes within masked areas are ignored during pixel comparison."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('mask dynamic timestamps in order invoice', async ({ page }) => {\n  await page.goto('/invoice/1001');\n  const invoiceCard = page.getByTestId('invoice-card');\n  await expect(invoiceCard).toHaveScreenshot('invoice.png', {\n    mask: [\n      invoiceCard.getByTestId('generated-timestamp'),\n      invoiceCard.getByTestId('dynamic-qr-code')\n    ]\n  });\n});",
      "explanation": "Masking dynamic dates and QR codes during visual comparison."
    },
    "proTip": "Component-level snapshots (`await expect(locator).toHaveScreenshot()`) are much faster and less brittle than full-page visual tests.",
    "commonFollowUp": "Can you customize the color of the mask rectangle in Playwright?"
  },
  {
    "id": 100,
    "question": "How does Playwright handle animations and CSS transitions during visual snapshot comparisons?",
    "shortAnswer": "Playwright automatically freezes CSS animations and pauses transitions by default during toHaveScreenshot(), or accepts animations: 'disabled'.",
    "category": "Auto-Waiting & Assertions",
    "difficulty": "Intermediate",
    "tags": [
      "Visual Regression",
      "Animations",
      "CSS Transitions",
      "toHaveScreenshot"
    ],
    "detailedExplanation": [
      "In CSS, infinite keyframe animations (spinning loaders, pulsing glows, blinking carets) mean no two screenshots will ever match pixel-for-pixel.",
      "Playwright automatically freezes animations at their initial frame when taking screenshots.",
      "Optionally pass `animations: 'disabled'` to fast-forward all CSS animations and transitions to their final completed state before snapping pixels.",
      "It also hides blinking text carets automatically."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('visual snapshot with disabled transitions', async ({ page }) => {\n  await page.goto('/hero');\n  await expect(page).toHaveScreenshot('hero.png', {\n    animations: 'disabled',\n    scale: 'css' // Avoid device-pixel-ratio scaling artifacts\n  });\n});",
      "explanation": "Configuring toHaveScreenshot with disabled animations and CSS pixel scaling."
    },
    "proTip": "Use `scale: 'css'` in `toHaveScreenshot()` to prevent pixel differences caused by high-DPI Retina vs standard monitors.",
    "commonFollowUp": "How does Playwright handle canvas animations or WebGL in visual regression tests?"
  },
  {
    "id": 101,
    "question": "What is the difference between toBeEnabled() and toBeEditable()?",
    "shortAnswer": "toBeEnabled() asserts an element does not have the disabled attribute. toBeEditable() asserts it is enabled AND not marked readonly.",
    "category": "Auto-Waiting & Assertions",
    "difficulty": "Beginner",
    "tags": [
      "toBeEnabled",
      "toBeEditable",
      "Forms",
      "Readonly"
    ],
    "detailedExplanation": [
      "`toBeEnabled()` checks that an input or button is not disabled (does not have `disabled` attribute). An input with `readonly` IS enabled, but cannot be typed into!",
      "`toBeEditable()` checks that an element is enabled AND is editable (not `readonly` and not `disabled`).",
      "Always use `toBeEditable()` when testing form fields that could be locked in read-only mode based on user permission roles."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('verify editable vs readonly form fields', async ({ page }) => {\n  await page.goto('/account');\n  const username = page.getByLabel('Username');\n  const accountId = page.getByLabel('Account ID'); // <input readonly value=\"12345\" />\n  await expect(username).toBeEditable();\n  await expect(accountId).toBeEnabled(); // Passes (not disabled)\n  await expect(accountId).not.toBeEditable(); // Passes (is readonly!)\n});",
      "explanation": "Differentiating between enabled and editable input states."
    },
    "proTip": "Use `toBeEditable()` before calling `locator.fill()` in permission-based testing suites.",
    "commonFollowUp": "What HTML elements support the toBeEditable() assertion?"
  },
  {
    "id": 102,
    "question": "How do you assert that a checkbox or radio button is checked using toBeChecked()?",
    "shortAnswer": "await expect(locator).toBeChecked({ checked?: boolean }) asserts the checkbox or radio control is currently checked.",
    "category": "Auto-Waiting & Assertions",
    "difficulty": "Beginner",
    "tags": [
      "toBeChecked",
      "Checkbox",
      "Radio",
      "Forms"
    ],
    "detailedExplanation": [
      "`toBeChecked()` auto-waits for a native checkbox `<input type='checkbox'>`, radio button, or ARIA switch (`role='checkbox'` / `role='switch'`) to enter the checked state.",
      "To assert unchecked: `await expect(locator).not.toBeChecked()` or `await expect(locator).toBeChecked({ checked: false })`.",
      "Works with custom ARIA checkboxes having `aria-checked='true'`."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('toggle terms agreement checkbox', async ({ page }) => {\n  await page.goto('/signup');\n  const termsCheckbox = page.getByLabel('I agree to the Terms & Conditions');\n  await expect(termsCheckbox).not.toBeChecked();\n  await termsCheckbox.check();\n  await expect(termsCheckbox).toBeChecked();\n});",
      "explanation": "Asserting checked and unchecked states of form controls."
    },
    "proTip": "`locator.check()` is idempotent: if the box is already checked, calling `check()` does nothing and won't uncheck it by accident.",
    "commonFollowUp": "How do you assert indeterminate (partially checked) checkbox states in Playwright?"
  },
  {
    "id": 103,
    "question": "How do you assert that a <select> dropdown has a specific selected option using toHaveValues()?",
    "shortAnswer": "await expect(selectLocator).toHaveValues(['expectedValue']) asserts the selected option value(s) in single or multi-select dropdowns.",
    "category": "Auto-Waiting & Assertions",
    "difficulty": "Intermediate",
    "tags": [
      "toHaveValues",
      "select",
      "Dropdown",
      "Assertions"
    ],
    "detailedExplanation": [
      "For standard HTML `<select>` elements, `toHaveValues()` checks the `value` attribute of the currently selected `<option>` elements.",
      "For single select: `await expect(select).toHaveValues(['us'])`.",
      "For multi-select: `await expect(multiSelect).toHaveValues(['admin', 'editor'])`.",
      "Auto-waits for asynchronous options to load from API endpoints before asserting."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('verify country select value', async ({ page }) => {\n  await page.goto('/shipping');\n  const countrySelect = page.getByLabel('Country');\n  await countrySelect.selectOption('CA');\n  await expect(countrySelect).toHaveValues(['CA']);\n});",
      "explanation": "Asserting selected options on select dropdowns."
    },
    "proTip": "Remember that `toHaveValues` checks the option's `value` attribute, NOT its visible display text. Use `toHaveText` on the selected option if testing label text.",
    "commonFollowUp": "How do you assert selected values on custom headless UI comboboxes?"
  },
  {
    "id": 104,
    "question": "How do you assert page title, URL query params, and hash fragments using toHaveTitle() and toHaveURL()?",
    "shortAnswer": "await expect(page).toHaveTitle(/pattern/i) and await expect(page).toHaveURL(/pattern/) auto-wait for page routing and SPA history transitions.",
    "category": "Auto-Waiting & Assertions",
    "difficulty": "Beginner",
    "tags": [
      "toHaveTitle",
      "toHaveURL",
      "Routing",
      "SPA"
    ],
    "detailedExplanation": [
      "In SPAs (Single Page Applications), clicking navigation links changes the URL and `<title>` asynchronously via client-side routing (React Router, Next.js).",
      "`toHaveURL()` and `toHaveTitle()` are auto-retrying web-first assertions that poll the browser until the route transition completes.",
      "Supports strings or regex: `await expect(page).toHaveURL(/.*\\/order\\/\\d+\\?tab=details/)`.",
      "Immune to race conditions where the URL updates a few milliseconds after click."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('assert SPA navigation and query parameters', async ({ page }) => {\n  await page.goto('/products');\n  await page.getByRole('link', { name: 'Filter by Electronics' }).click();\n  // Auto-waits for client router to update URL:\n  await expect(page).toHaveURL(/.*category=electronics/);\n  await expect(page).toHaveTitle(/Electronics | My Store/i);\n});",
      "explanation": "Asserting asynchronous SPA routing and title changes."
    },
    "proTip": "Always use regular expressions with `toHaveURL()` when testing with dynamic `baseURL` across local, staging, and production environments.",
    "commonFollowUp": "How do you assert URL hash fragments (e.g. #section-2)?"
  },
  {
    "id": 105,
    "question": "Why should you avoid expect(await locator.isVisible()).toBe(true) in favor of await expect(locator).toBeVisible()?",
    "shortAnswer": "expect(await ...).toBe() evaluates instantly once without auto-waiting and causes flaky tests. await expect(locator).toBeVisible() polls the DOM continuously until timeout.",
    "category": "Auto-Waiting & Assertions",
    "difficulty": "Beginner",
    "tags": [
      "Anti-Pattern",
      "Web-First Assertions",
      "Flakiness",
      "Best Practice"
    ],
    "detailedExplanation": [
      "This is the #1 mistake made by developers transitioning from Selenium/Puppeteer to Playwright.",
      "In `expect(await locator.isVisible()).toBe(true)`:",
      "1. `await locator.isVisible()` checks the DOM ONCE at that exact millisecond. If the element is still fetching data or animating, it returns `false`.",
      "2. `expect(false).toBe(true)` fails immediately with no retry.",
      "In `await expect(locator).toBeVisible()` (Web-First):",
      "1. Playwright creates an auto-retrying polling loop (checking DOM every 100ms up to 5s).",
      "2. As soon as the element appears and stabilizes, the assertion passes cleanly.",
      "3. Eliminates 90% of all test flakiness."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "// ❌ FLAKY ANTI-PATTERN (Instant check, zero retry):\n// expect(await page.getByText('Success').isVisible()).toBe(true);\n\n// ✅ ROCK SOLID WEB-FIRST (Auto-retrying DOM poller):\nawait expect(page.getByText('Success')).toBeVisible();",
      "explanation": "Contrasting instant boolean checks with auto-retrying web-first assertions."
    },
    "proTip": "Remember the golden syntax rule: the `await` keyword must always be at the very FRONT: `await expect(...)`.",
    "commonFollowUp": "Are there any Jest or Chai assertion plugins that conflict with Playwright's web-first expect?"
  }
];

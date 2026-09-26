export interface QuizQuestion {
  id: number;
  questionNumber: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    questionNumber: 1,
    question: "What communication protocol does Playwright use to control browsers?",
    options: [
      "W3C WebDriver HTTP REST calls",
      "Direct WebSocket connections to browser debugging interfaces (e.g. CDP)",
      "Standard operating system mouse and keyboard hooks only",
      "Headless X11 virtual display buffers"
    ],
    correctIndex: 1,
    explanation: "Playwright bypasses traditional HTTP-based WebDriver intermediate layers and communicates directly with browser rendering engines using bidirectional WebSocket connections.",
    category: "Architecture & Core"
  },
  {
    id: 2,
    questionNumber: 6,
    question: "What is the primary advantage of a BrowserContext in Playwright?",
    options: [
      "It allows running tests on physical iOS hardware",
      "It enables tests in multiple tabs to share identical local storage",
      "It provides isolated incognito-like sessions that spawn in ~10ms without relaunching the browser process",
      "It automatically compiles TypeScript into minified JavaScript"
    ],
    correctIndex: 2,
    explanation: "A BrowserContext is an isolated session with its own cookies and storage. Creating a context takes ~10 milliseconds compared to seconds for launching a full browser process.",
    category: "Architecture & Core"
  },
  {
    id: 3,
    questionNumber: 7,
    question: "Why does Playwright recommend 'page.getByRole()' as the primary locator strategy?",
    options: [
      "It executes faster than CSS selectors in the browser engine",
      "It locates elements by accessibility roles, closely mirroring how real users and assistive technologies perceive the UI",
      "It prevents elements from being clicked if they don't have an ID attribute",
      "It only works in Chromium browsers"
    ],
    correctIndex: 1,
    explanation: "Role-based locators mimic real user perception and assistive tech, encouraging accessible HTML and creating resilient tests that don't break on class name refactors.",
    category: "Locators & Interactions"
  },
  {
    id: 4,
    questionNumber: 8,
    question: "Which of the following is NOT one of the standard Actionability Checks performed during auto-waiting before a click?",
    options: [
      "Element is Attached to the DOM",
      "Element is Stable (not animating or transitioning)",
      "Element has an exact test-id attribute present",
      "Element Receives Events (not obscured by an overlay)"
    ],
    correctIndex: 2,
    explanation: "Playwright checks for Attached, Visible, Stable, Enabled, and Receives Events. It does not require elements to possess a test-id attribute.",
    category: "Auto-Waiting & Assertions"
  },
  {
    id: 5,
    questionNumber: 9,
    question: "How does a Web-First Assertion like 'await expect(locator).toBeVisible()' differ from a standard synchronous check?",
    options: [
      "It executes asynchronously on a separate cloud worker",
      "It polls the DOM continuously and retries until the condition is met or the timeout expires",
      "It automatically takes a screenshot on failure",
      "It only works inside Page Object classes"
    ],
    correctIndex: 1,
    explanation: "Web-First Assertions retry continuously until the expected condition is fulfilled (or timeout occurs), eliminating timing flakiness in dynamic modern apps.",
    category: "Auto-Waiting & Assertions"
  },
  {
    id: 6,
    questionNumber: 17,
    question: "How does Playwright handle interactions inside an iframe?",
    options: [
      "You must switch context via driver.switchTo().frame() and call defaultContent() when done",
      "You must download the iframe source code and inspect it locally",
      "Use page.frameLocator(selector) which returns a locator operating inside the frame without manual context switching",
      "Playwright does not support nested iframes"
    ],
    correctIndex: 2,
    explanation: "Playwright provides `page.frameLocator()`, which encapsulates iframe traversal into the locator itself, eliminating tedious and error-prone context switching.",
    category: "Locators & Interactions"
  },
  {
    id: 7,
    questionNumber: 21,
    question: "Which method is used in Playwright to intercept network requests and return mock data?",
    options: [
      "page.intercept()",
      "page.route()",
      "page.mockApi()",
      "page.setNetworkProxy()"
    ],
    correctIndex: 1,
    explanation: "`page.route()` (or `context.route()`) intercepts network requests matching a URL pattern, allowing you to fulfill them with synthetic responses via `route.fulfill()`.",
    category: "Network & API Mocking"
  },
  {
    id: 8,
    questionNumber: 22,
    question: "What is the recommended best practice for handling authentication in large Playwright test suites?",
    options: [
      "Fill the login form in a beforeEach hook before every single test",
      "Save cookies and local storage to a storageState JSON file during global setup and reuse it across tests",
      "Hardcode session tokens in the test files directly",
      "Disable authentication entirely on the staging server"
    ],
    correctIndex: 1,
    explanation: "Using `storageState` allows tests to log in once during a setup project, saving session state to a JSON file and booting future test contexts already authenticated in milliseconds.",
    category: "Sessions, Auth & Dialogs"
  },
  {
    id: 9,
    questionNumber: 27,
    question: "Why is 'await page.waitForTimeout(3000)' strongly discouraged in production Playwright test suites?",
    options: [
      "It makes tests run needlessly slow, masks underlying race conditions, and will still flake under variable CI load",
      "It crashes the Node.js process if called more than once",
      "It is only supported in Python, not in TypeScript",
      "It forces the browser to run in headed mode"
    ],
    correctIndex: 0,
    explanation: "Hardcoded sleeps make test suites sluggish and do not guarantee stability under slow CI loads. Relying on auto-waiting and web-first assertions is the recommended standard.",
    category: "Auto-Waiting & Assertions"
  },
  {
    id: 10,
    questionNumber: 30,
    question: "What is the default behavior in Playwright when a browser dialog (alert, confirm, prompt) appears?",
    options: [
      "Playwright pauses execution and waits for human input",
      "Playwright automatically dismisses (cancels) all dialogs so tests do not freeze",
      "Playwright throws an unhandled modal exception immediately",
      "Playwright crashes the active tab"
    ],
    correctIndex: 1,
    explanation: "Playwright automatically auto-dismisses all dialogs by default. If you want to accept or supply text to a dialog, you must register a `page.on('dialog')` handler beforehand.",
    category: "Sessions, Auth & Dialogs"
  },
  {
    id: 11,
    questionNumber: 36,
    question: "What does the Playwright Trace Viewer provide for post-mortem debugging?",
    options: [
      "Only a plain-text console output log file",
      "A complete zip containing interactive DOM snapshots before and after every action, network waterfall, timeline scrubber, and console logs",
      "A video recording converted to GIF format",
      "An automated AI agent that rewrites your failed code"
    ],
    correctIndex: 1,
    explanation: "Trace Viewer packages complete DOM snapshots, visual scrubbers, network payloads, and source code into an interactive offline viewable bundle.",
    category: "Debugging & Tracing"
  },
  {
    id: 12,
    questionNumber: 46,
    question: "How can you execute REST API requests in Playwright without launching a browser?",
    options: [
      "You cannot; Playwright requires a browser for all operations",
      "Using the standalone APIRequestContext via the built-in 'request' fixture",
      "By launching Chromium in headless mode and using fetch() inside page.evaluate()",
      "By installing Axios as a required peer dependency"
    ],
    correctIndex: 1,
    explanation: "Playwright provides the `request` fixture (`APIRequestContext`), allowing developers to execute lightning-fast HTTP GET, POST, PUT, and DELETE calls without browser overhead.",
    category: "Network & API Mocking"
  }
];

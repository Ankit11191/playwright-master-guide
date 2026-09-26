import { PlaywrightQuestion } from '../playwrightQuestions';

export const QUESTIONS_PART_3: PlaywrightQuestion[] = [
  {
    "id": 106,
    "question": "How do you intercept and mock GraphQL requests using page.route()?",
    "shortAnswer": "Inspect request.postDataJSON() inside page.route() to check operationName, then fulfill with custom mock JSON data for specific queries or mutations.",
    "category": "Network & API Mocking",
    "difficulty": "Advanced",
    "tags": [
      "GraphQL",
      "page.route",
      "Mocking",
      "Network"
    ],
    "detailedExplanation": [
      "Unlike REST APIs where each resource has a distinct URL path, GraphQL requests almost always target a single endpoint (`/graphql` or `/api/graphql`) using HTTP POST.",
      "To selectively mock a GraphQL query or mutation:",
      "1. Route the endpoint: `await page.route('**/graphql', async (route) => { ... })`",
      "2. Parse the body: `const payload = route.request().postDataJSON();`",
      "3. Inspect operation: `if (payload?.operationName === 'GetCartItems') { route.fulfill(...) } else { route.continue(); }`",
      "This lets you mock specific GraphQL queries while allowing all other operations to hit the real server or secondary mocks."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('mock specific GraphQL query', async ({ page }) => {\n  await page.route('**/graphql', async (route) => {\n    const body = route.request().postDataJSON();\n    if (body?.operationName === 'GetUserProfile') {\n      await route.fulfill({\n        status: 200,\n        contentType: 'application/json',\n        body: JSON.stringify({\n          data: {\n            user: { id: '42', name: 'Mocked Developer', role: 'VIP' }\n          }\n        })\n      });\n    } else {\n      await route.continue();\n    }\n  });\n\n  await page.goto('/profile');\n  await expect(page.getByText('Mocked Developer')).toBeVisible();\n});",
      "explanation": "Intercepting /graphql and matching operationName to fulfill custom response data."
    },
    "proTip": "You can also simulate GraphQL error responses by returning `{ errors: [{ message: 'Unauthorized' }] }` with status 200.",
    "commonFollowUp": "How do you mock multiple distinct GraphQL operations executed within the same test file?"
  },
  {
    "id": 107,
    "question": "How do you modify network response headers (e.g., CORS, Content-Security-Policy) using route.fulfill()?",
    "shortAnswer": "Fetch the original response with route.fetch(), modify its headers in an object, and pass them to route.fulfill({ response, headers }).",
    "category": "Network & API Mocking",
    "difficulty": "Advanced",
    "tags": [
      "CORS",
      "Headers",
      "route.fetch",
      "Security"
    ],
    "detailedExplanation": [
      "When testing local mock servers or cross-origin embeds, Content Security Policy (CSP) or strict CORS policies may block test assets.",
      "`route.fetch()` allows you to fetch the real backend response, inspect or strip restrictive headers, and fulfill the modified response back to the page.",
      "Useful for: injecting `Access-Control-Allow-Origin: *`, stripping CSP frame-ancestors to test iframes, or simulating missing security headers."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('bypass restrictive CSP header during local development', async ({ page }) => {\n  await page.route('**/*', async (route) => {\n    const response = await route.fetch();\n    const headers = response.headers();\n    delete headers['content-security-policy']; // Strip CSP restrictions\n    headers['access-control-allow-origin'] = '*';\n\n    await route.fulfill({\n      response,\n      headers\n    });\n  });\n\n  await page.goto('/');\n});",
      "explanation": "Intercepting real HTTP responses to rewrite security headers."
    },
    "proTip": "Never strip CSP headers in production smoke tests; only use this technique in isolated synthetic mock test environments.",
    "commonFollowUp": "Can Playwright intercept and modify HTTP request headers before they reach the server?"
  },
  {
    "id": 108,
    "question": "How do you mock slow 3G network conditions or delay responses using page.route()?",
    "shortAnswer": "Add an artificial delay inside page.route() before calling route.continue() or route.fulfill(), or use CDP network emulation in Chromium.",
    "category": "Network & API Mocking",
    "difficulty": "Intermediate",
    "tags": [
      "Throttling",
      "Network Latency",
      "Slow 3G",
      "page.route"
    ],
    "detailedExplanation": [
      "To test loading skeletons, disabled submit buttons, and cancellation tokens, you need to simulate high network latency.",
      "Approach 1 (Route Delay): Inside `page.route()`, call `await new Promise(r => setTimeout(r, 2000))` before fulfilling. This delays specific endpoints without slowing down the entire page load.",
      "Approach 2 (CDP Throttling): Use Chrome DevTools Protocol to throttle global network bandwidth (Slow 3G / Fast 3G) at the socket level."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('verify save button displays loading spinner during delayed API response', async ({ page }) => {\n  // Artificially delay payment checkout endpoint by 2 seconds:\n  await page.route('**/api/checkout', async (route) => {\n    await new Promise(resolve => setTimeout(resolve, 2000));\n    await route.fulfill({ status: 200, json: { success: true } });\n  });\n\n  await page.goto('/checkout');\n  await page.getByRole('button', { name: 'Pay Now' }).click();\n  // Assert button enters loading state immediately:\n  await expect(page.getByRole('button', { name: 'Processing...' })).toBeDisabled();\n  // Assert success after delay completes:\n  await expect(page.getByText('Order Complete')).toBeVisible();\n});",
      "explanation": "Introducing artificial latency into API routes to verify loading indicators."
    },
    "proTip": "Prefer delaying specific API endpoints with `page.route` over global browser throttling because your test suite won't needlessly wait for static JS and CSS bundles to download.",
    "commonFollowUp": "How do you emulate offline mode in Playwright?"
  },
  {
    "id": 109,
    "question": "How do you abort specific third-party analytics (Google Analytics, Segment, Sentry) to speed up test execution?",
    "shortAnswer": "Use page.route('**/*google-analytics.com/**', route => route.abort()) to instantly block third-party tracking scripts and beacons.",
    "category": "Network & API Mocking",
    "difficulty": "Beginner",
    "tags": [
      "route.abort",
      "Analytics",
      "Optimization",
      "Speed"
    ],
    "detailedExplanation": [
      "Production web applications load dozens of external tracking and monitoring scripts (Google Tag Manager, Segment, Mixpanel, Hotjar, Sentry, Facebook Pixel).",
      "These scripts add 1-3 seconds of network overhead, pollute production analytics with automated bot data, and introduce third-party flakiness.",
      "Using `page.route()` with glob patterns, you can immediately abort matching requests with `route.abort()`.",
      "Playwright drops the request at the browser networking layer before DNS lookup or socket creation."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest.beforeEach(async ({ context }) => {\n  // Abort analytics and tracking across all tests in suite:\n  await context.route(/google-analytics|hotjar|doubleclick|segment\\.io/, (route) => {\n    route.abort();\n  });\n});\n\ntest('fast test run without third-party noise', async ({ page }) => {\n  await page.goto('/');\n  await expect(page.getByRole('heading')).toBeVisible();\n});",
      "explanation": "Blocking external analytics scripts at the context level to accelerate tests."
    },
    "proTip": "Applying `context.route()` in `beforeEach` blocks tracking across all pages and popups opened by that browser context.",
    "commonFollowUp": "What error code does the browser report when a request is aborted via route.abort()?"
  },
  {
    "id": 110,
    "question": "How do you capture and assert all outgoing HTTP requests matching a pattern using page.waitForRequest()?",
    "shortAnswer": "Promise.all([page.waitForRequest(urlOrPredicate), triggerAction()]) waits for and returns the Request object for inspection.",
    "category": "Network & API Mocking",
    "difficulty": "Intermediate",
    "tags": [
      "waitForRequest",
      "Payload Assertion",
      "HTTP"
    ],
    "detailedExplanation": [
      "When testing form submissions, tracking beacons, or audit logs, you often need to assert that the browser dispatched an outgoing HTTP request with specific headers or body.",
      "`page.waitForRequest(url | predicate, { timeout })` returns a Promise that resolves to the matching `Request`.",
      "Always set up the listener BEFORE triggering the action using `Promise.all()` to avoid race conditions."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('assert outgoing request payload on form submission', async ({ page }) => {\n  await page.goto('/contact');\n  await page.getByLabel('Name').fill('John Doe');\n  await page.getByLabel('Message').fill('Inquiring about enterprise tier');\n\n  // Wait for request while clicking submit:\n  const [request] = await Promise.all([\n    page.waitForRequest(req => req.url().includes('/api/leads') && req.method() === 'POST'),\n    page.getByRole('button', { name: 'Send Message' }).click(),\n  ]);\n\n  // Assert JSON payload submitted by frontend:\n  const payload = request.postDataJSON();\n  expect(payload.name).toBe('John Doe');\n  expect(payload.message).toContain('enterprise tier');\n});",
      "explanation": "Using Promise.all with waitForRequest to assert request payloads."
    },
    "proTip": "Use `page.waitForResponse()` instead of `waitForRequest()` if you need to verify both the sent payload AND the server's HTTP status code.",
    "commonFollowUp": "What happens if multiple requests match the pattern in page.waitForRequest()?"
  },
  {
    "id": 111,
    "question": "How do you use the request fixture for pure backend REST API testing without launching a browser?",
    "shortAnswer": "Inject the request fixture into test({ request }) to make direct HTTP calls (get, post, put, delete) with zero browser overhead.",
    "category": "Network & API Mocking",
    "difficulty": "Beginner",
    "tags": [
      "request fixture",
      "API Testing",
      "Headless HTTP",
      "REST"
    ],
    "detailedExplanation": [
      "Playwright is not just a browser UI automation tool; it is a world-class HTTP API testing framework.",
      "The `request` fixture provides an `APIRequestContext` that operates directly in Node.js without launching Chromium, Firefox, or WebKit.",
      "Benefits: tests execute in under 50ms, share cookies and authentication tokens with browser contexts, and validate backend endpoints before running UI tests."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('API CRUD operations using request fixture', async ({ request }) => {\n  // 1. Create a new user record:\n  const createRes = await request.post('/api/users', {\n    data: {\n      name: 'Alice Developer',\n      email: 'alice@company.com'\n    }\n  });\n  expect(createRes.status()).toBe(201);\n  const user = await createRes.json();\n\n  // 2. Fetch created user:\n  const getRes = await request.get(`/api/users/${user.id}`);\n  expect(getRes.ok()).toBeTruthy();\n  expect((await getRes.json()).name).toBe('Alice Developer');\n});",
      "explanation": "Fast REST API testing using the built-in request fixture."
    },
    "proTip": "Use the `request` fixture in `beforeAll` hooks to seed test users and database state, slashing 80% off test run durations.",
    "commonFollowUp": "How do you configure default headers and base URL for the request fixture?"
  },
  {
    "id": 112,
    "question": "How do you test API authentication tokens and session cookies using request.newContext()?",
    "shortAnswer": "Call request.newContext({ extraHTTPHeaders, storageState }) to instantiate an isolated API context with bearer tokens or pre-set cookies.",
    "category": "Network & API Mocking",
    "difficulty": "Intermediate",
    "tags": [
      "APIRequestContext",
      "Auth Tokens",
      "Bearer",
      "Cookies"
    ],
    "detailedExplanation": [
      "When testing microservices, you often need multiple API clients with different authentication tokens (e.g. Admin token vs Read-Only token).",
      "Using `playwright.request.newContext({ extraHTTPHeaders: { Authorization: 'Bearer ...' } })`, you can create independent API contexts.",
      "You can also pass `storageState: 'auth.json'` to initialize the API context with cookies and localStorage saved from a prior browser login."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect, request } from '@playwright/test';\n\ntest('authenticated API requests with custom bearer tokens', async () => {\n  // Create isolated admin API client:\n  const adminApi = await request.newContext({\n    baseURL: 'https://api.example.com',\n    extraHTTPHeaders: {\n      'Authorization': 'Bearer admin-secret-token',\n      'Accept': 'application/json'\n    }\n  });\n\n  const res = await adminApi.get('/v1/admin/metrics');\n  expect(res.status()).toBe(200);\n  await adminApi.dispose();\n});",
      "explanation": "Instantiating isolated API contexts with custom authorization headers."
    },
    "proTip": "Always call `await apiContext.dispose()` when creating custom contexts to free up HTTP connection pools.",
    "commonFollowUp": "Can you pass an APIRequestContext directly into a browser context's cookie jar?"
  },
  {
    "id": 113,
    "question": "How do you test file downloads and assert HTTP Content-Disposition headers using page.waitForEvent('download')?",
    "shortAnswer": "Promise.all([page.waitForEvent('download'), clickDownload()]) captures the Download object to assert filename, content, and save path.",
    "category": "Network & API Mocking",
    "difficulty": "Intermediate",
    "tags": [
      "Downloads",
      "waitForEvent",
      "Files",
      "CSV Export"
    ],
    "detailedExplanation": [
      "Browsers trigger file downloads when links have the `download` attribute or servers send `Content-Disposition: attachment; filename=...` headers.",
      "Playwright intercepts file downloads cleanly without opening OS Save Dialogs.",
      "The `Download` object provides: `suggestedFilename()`, `path()`, `saveAs(destinationPath)`, and `failure()`.",
      "You can read downloaded CSV or PDF files directly from the temporary disk path into your test assertion."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\nimport fs from 'fs';\n\ntest('verify CSV report export and content', async ({ page }) => {\n  await page.goto('/reports');\n\n  // Wait for download while clicking export button:\n  const [download] = await Promise.all([\n    page.waitForEvent('download'),\n    page.getByRole('button', { name: 'Export to CSV' }).click(),\n  ]);\n\n  expect(download.suggestedFilename()).toBe('sales-2024.csv');\n  const tempPath = await download.path();\n  const content = fs.readFileSync(tempPath!, 'utf8');\n  expect(content).toContain('Order ID,Total,Status');\n});",
      "explanation": "Intercepting file downloads and asserting CSV content."
    },
    "proTip": "Playwright automatically deletes temporary downloaded files when the browser context closes unless you save them with `download.saveAs()`.",
    "commonFollowUp": "What happens if a download fails due to network termination?"
  },
  {
    "id": 114,
    "question": "How do you mock WebSocket connections and messages in Playwright?",
    "shortAnswer": "Use page.routeWebSocket() to intercept client-server WebSocket handshakes and simulate incoming or outgoing messages.",
    "category": "Network & API Mocking",
    "difficulty": "Advanced",
    "tags": [
      "WebSocket",
      "routeWebSocket",
      "Real-Time",
      "Mocking"
    ],
    "detailedExplanation": [
      "In modern applications, live updates (chat, stock tickers, notifications) happen over persistent WebSockets rather than HTTP polling.",
      "Playwright 1.48+ introduced `page.routeWebSocket(url, handler)` for full WebSocket interception.",
      "Inside the handler, you can:",
      "- Listen to client messages: `ws.onMessage(msg => ...)`",
      "- Send mock messages to the client: `ws.send('...')`",
      "- Forward to a real server or block connections.",
      "This enables deterministic testing of real-time UIs without needing active WebSocket backend servers."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('mock incoming live price updates via WebSocket', async ({ page }) => {\n  // Intercept WebSocket connection to price feed:\n  await page.routeWebSocket('**/ws/prices', (ws) => {\n    // Send synthetic price update to the browser UI:\n    ws.send(JSON.stringify({ symbol: 'AAPL', price: 189.50 }));\n  });\n\n  await page.goto('/crypto-dashboard');\n  await expect(page.getByTestId('aapl-price')).toHaveText('$189.50');\n});",
      "explanation": "Intercepting WebSocket connections and pushing synthetic real-time payloads."
    },
    "proTip": "Mocking WebSockets eliminates flakiness caused by dropped socket connections or race conditions during rapid test runs.",
    "commonFollowUp": "Can you intercept binary ArrayBuffer messages on WebSockets in Playwright?"
  },
  {
    "id": 115,
    "question": "How do you mock Server-Sent Events (SSE) or streaming HTTP responses?",
    "shortAnswer": "Use page.route() to fulfill requests with contentType: 'text/event-stream' and stream data chunks formatted as data: ...\\n\\n.",
    "category": "Network & API Mocking",
    "difficulty": "Advanced",
    "tags": [
      "SSE",
      "Server-Sent Events",
      "Streaming",
      "AI Chat"
    ],
    "detailedExplanation": [
      "Server-Sent Events (SSE) stream server updates (such as AI chat completions or live feeds) over a persistent HTTP connection using `text/event-stream`.",
      "Using `page.route()`, you can mock the initial response headers and send formatted SSE data packets: `data: {\"text\": \"Hello\"}\\n\\n`.",
      "This allows you to test streaming markdown rendering and typewriter animations deterministically."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('mock streaming AI assistant response', async ({ page }) => {\n  await page.route('**/api/chat/stream', async (route) => {\n    await route.fulfill({\n      status: 200,\n      contentType: 'text/event-stream',\n      headers: { 'Cache-Control': 'no-cache' },\n      body: 'data: {\"content\": \"Playwright is fast!\"}\\n\\ndata: [DONE]\\n\\n'\n    });\n  });\n\n  await page.goto('/ai-chat');\n  await page.getByRole('textbox').fill('Tell me about Playwright');\n  await page.getByRole('button', { name: 'Ask' }).click();\n  await expect(page.getByText('Playwright is fast!')).toBeVisible();\n});",
      "explanation": "Mocking Server-Sent Events with text/event-stream formatting."
    },
    "proTip": "Ensure your mock payload ends with double newlines `\\n\\n` as required by the SSE protocol specification.",
    "commonFollowUp": "How do you test automatic reconnection behavior when an SSE stream drops?"
  },
  {
    "id": 116,
    "question": "How do you test API rate limiting (HTTP 429 Too Many Requests) and exponential backoff retry behavior?",
    "shortAnswer": "Fulfill initial requests with status: 429 and Retry-After headers via page.route(), then fulfill subsequent requests with status: 200.",
    "category": "Network & API Mocking",
    "difficulty": "Advanced",
    "tags": [
      "Rate Limiting",
      "429",
      "Backoff",
      "Resilience"
    ],
    "detailedExplanation": [
      "Enterprise frontends must gracefully handle API rate limiting (HTTP 429) by showing warning banners or retrying with exponential backoff.",
      "Using a counter variable inside `page.route()`, you can reject the first N requests with HTTP 429 and return 200 on the retry.",
      "This verifies that your frontend doesn't crash, shows appropriate throttle messages, and recovers automatically."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('frontend retries on HTTP 429 rate limit', async ({ page }) => {\n  let requestCount = 0;\n  await page.route('**/api/search', async (route) => {\n    requestCount++;\n    if (requestCount === 1) {\n      // Reject first attempt with 429:\n      await route.fulfill({\n        status: 429,\n        headers: { 'Retry-After': '1' },\n        json: { error: 'Rate limit exceeded' }\n      });\n    } else {\n      // Succeed on second attempt:\n      await route.fulfill({\n        status: 200,\n        json: { results: ['Product A', 'Product B'] }\n      });\n    }\n  });\n\n  await page.goto('/search');\n  await page.getByRole('button', { name: 'Search' }).click();\n  await expect(page.getByText('Product A')).toBeVisible();\n  expect(requestCount).toBe(2);\n});",
      "explanation": "Simulating HTTP 429 rate limiting and verifying automated retry logic."
    },
    "proTip": "Verify both user-facing behavior (e.g. 'Retrying...') and that the final request count matches expectations.",
    "commonFollowUp": "How do you test circuit-breaker fallbacks in micro-frontend architectures?"
  },
  {
    "id": 117,
    "question": "How do you combine API setup with UI testing to seed test users and database records before UI navigation?",
    "shortAnswer": "Use the request fixture in the same test to call backend APIs for setup, then navigate page to the newly created resource.",
    "category": "Network & API Mocking",
    "difficulty": "Intermediate",
    "tags": [
      "Hybrid Testing",
      "API Seeding",
      "Fast Setup",
      "Best Practice"
    ],
    "detailedExplanation": [
      "Creating test prerequisites via the UI (clicking through 5 form wizards to create an order) makes tests slow and flaky.",
      "Best Practice: Use the `request` fixture to create the test entity via API in 50ms, then use `page.goto('/orders/' + order.id)` to test the specific UI feature (e.g. Canceling the order).",
      "This pattern delivers maximum speed and keeps tests focused strictly on the component under test."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('seed order via API, verify cancel in UI', async ({ page, request }) => {\n  // 1. Fast API setup:\n  const newOrder = await request.post('/api/orders', {\n    data: { item: 'Headphones', quantity: 1 }\n  });\n  const { id } = await newOrder.json();\n\n  // 2. Direct UI navigation to target state:\n  await page.goto(`/orders/${id}`);\n  await page.getByRole('button', { name: 'Cancel Order' }).click();\n  await expect(page.getByText('Order Cancelled')).toBeVisible();\n});",
      "explanation": "Seeding data via API before performing UI interactions."
    },
    "proTip": "Follow the rule: 'Only test the feature through the UI; create all prerequisites through the API.'",
    "commonFollowUp": "How do you ensure test data created via API is cleaned up after test completion?"
  },
  {
    "id": 118,
    "question": "What is route.fetch() and how do you intercept a real backend response, modify its JSON body, and return it?",
    "shortAnswer": "route.fetch() makes the real HTTP request to the server, allows you to inspect and modify the JSON data, and fulfills it via route.fulfill({ response, json }).",
    "category": "Network & API Mocking",
    "difficulty": "Intermediate",
    "tags": [
      "route.fetch",
      "Response Mutation",
      "HAR",
      "Mocking"
    ],
    "detailedExplanation": [
      "Completely fake mocks often drift out of date with real backend schemas.",
      "`route.fetch()` solves this by executing the actual network call to your backend. You receive the real production or staging response, modify just one specific field (e.g. inject an admin role, or add an edge-case empty list), and hand it back to the frontend.",
      "This guarantees 99% real data with precise control over edge-case fields."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('inject edge-case flag into real backend response', async ({ page }) => {\n  await page.route('**/api/features', async (route) => {\n    // Fetch real response from server:\n    const response = await route.fetch();\n    const json = await response.json();\n\n    // Mutate only the specific feature flag under test:\n    json.experimentalCheckoutV2 = true;\n\n    // Fulfill modified JSON to browser:\n    await route.fulfill({ response, json });\n  });\n\n  await page.goto('/settings');\n  await expect(page.getByText('Checkout V2 Active')).toBeVisible();\n});",
      "explanation": "Fetching real backend data and mutating target fields using route.fetch()."
    },
    "proTip": "Use `route.fetch()` when you want realistic production data but need to trigger an edge-case error banner or experimental flag.",
    "commonFollowUp": "Can route.fetch() send custom headers different from the original browser request?"
  },
  {
    "id": 119,
    "question": "How do you mock OAuth redirects or third-party SSO providers (Google, GitHub, Okta) in Playwright?",
    "shortAnswer": "Intercept the OAuth authorize URL with page.route() and simulate the callback redirect with code and state query parameters.",
    "category": "Network & API Mocking",
    "difficulty": "Advanced",
    "tags": [
      "OAuth",
      "SSO",
      "Mocking",
      "Redirects"
    ],
    "detailedExplanation": [
      "Testing real third-party OAuth logins (Google, Facebook, Okta) in automated suites is notoriously difficult: Google blocks automated logins with CAPTCHAs and 2FA.",
      "Best Practice: Mock the OAuth handshake. When the user clicks 'Sign in with Google', intercept the navigation to `accounts.google.com/o/oauth2/v2/auth`, and immediately fulfill a redirect to your app's callback URL (`/api/auth/callback?code=mock_code&state=...`).",
      "This tests your application's complete OAuth exchange flow without ever contacting Google."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('mock Google OAuth login handshake', async ({ page }) => {\n  // Intercept Google OAuth endpoint and redirect back to app:\n  await page.route('https://accounts.google.com/**', async (route) => {\n    const url = new URL(route.request().url());\n    const redirectUri = url.searchParams.get('redirect_uri') || '/auth/callback';\n    await route.fulfill({\n      status: 302,\n      headers: {\n        'Location': `${redirectUri}?code=mock_valid_auth_code&state=test_state`\n      }\n    });\n  });\n\n  await page.goto('/login');\n  await page.getByRole('button', { name: 'Sign in with Google' }).click();\n  await expect(page).toHaveURL('/dashboard');\n  await expect(page.getByText('Welcome back')).toBeVisible();\n});",
      "explanation": "Mocking third-party OAuth redirect flows seamlessly."
    },
    "proTip": "Never attempt to automate real Google or GitHub login screens in CI—you will inevitably be flagged and blocked by anti-bot systems.",
    "commonFollowUp": "How do you test refresh token rotation with mocked OAuth providers?"
  },
  {
    "id": 120,
    "question": "How do you test offline mode and network disconnect behavior using context.setOffline(true)?",
    "shortAnswer": "Call await context.setOffline(true) to sever all network connections, then verify offline caching, banners, and queued actions.",
    "category": "Network & API Mocking",
    "difficulty": "Intermediate",
    "tags": [
      "Offline",
      "PWA",
      "ServiceWorker",
      "setOffline"
    ],
    "detailedExplanation": [
      "Progressive Web Apps (PWAs) and resilient web apps must function when internet access is lost.",
      "`context.setOffline(true)` disconnects the browser context from the network instantly, triggering `navigator.onLine = false` and `window.addEventListener('offline')` in the DOM.",
      "Useful for: testing offline toast banners, ServiceWorker cached asset fallback, and local draft saving in IndexedDB."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('verify offline banner and local draft saving', async ({ page, context }) => {\n  await page.goto('/notes');\n  await page.getByPlaceholder('Note title').fill('My Offline Note');\n\n  // Simulate offline network condition:\n  await context.setOffline(true);\n\n  await expect(page.getByRole('alert')).toHaveText(/You are currently offline/i);\n  await page.getByRole('button', { name: 'Save Note' }).click();\n  await expect(page.getByText('Saved to offline storage')).toBeVisible();\n\n  // Restore online connection:\n  await context.setOffline(false);\n  await expect(page.getByText('Synced with server')).toBeVisible();\n});",
      "explanation": "Toggling network connectivity to test offline PWA behavior."
    },
    "proTip": "Always restore `context.setOffline(false)` or let the context close naturally to avoid affecting subsequent tests.",
    "commonFollowUp": "Does context.setOffline(true) block requests served by an active Service Worker cache?"
  },
  {
    "id": 121,
    "question": "How do you implement the recommended Playwright Project Dependencies pattern for Authentication Setup?",
    "shortAnswer": "Configure a setup project that logs in once, saves storageState to disk, and declare dependencies: ['setup'] in all browser projects.",
    "category": "Sessions, Auth & Dialogs",
    "difficulty": "Advanced",
    "tags": [
      "Project Dependencies",
      "storageState",
      "Auth Setup",
      "Architecture"
    ],
    "detailedExplanation": [
      "In enterprise test suites, logging in through the UI before every test wastes thousands of seconds.",
      "The official recommended Playwright pattern uses Project Dependencies:",
      "1. Define a `'setup'` project in `playwright.config.ts` matching `auth.setup.ts`.",
      "2. The setup test logs in via UI or API once and saves tokens/cookies to `.auth/user.json`.",
      "3. All browser projects specify `dependencies: ['setup']` and `use: { storageState: '.auth/user.json' }`.",
      "Playwright guarantees the setup test runs first, and all subsequent tests start already authenticated."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "// playwright.config.ts\nimport { defineConfig, devices } from '@playwright/test';\n\nexport default defineConfig({\n  projects: [\n    // 1. Setup project executes first:\n    {\n      name: 'setup',\n      testMatch: /.*\\.setup\\.ts/,\n    },\n    // 2. Main tests depend on setup and load saved cookies:\n    {\n      name: 'chromium',\n      use: {\n        ...devices['Desktop Chrome'],\n        storageState: 'playwright/.auth/user.json',\n      },\n      dependencies: ['setup'],\n    },\n  ],\n});",
      "explanation": "Configuring Playwright Project Dependencies for zero-overhead authentication."
    },
    "proTip": "Add `playwright/.auth/` to your `.gitignore` so temporary session credentials are never committed to source control.",
    "commonFollowUp": "What happens if the setup project test fails during CI execution?"
  },
  {
    "id": 122,
    "question": "How do you handle multi-role testing (Admin, Manager, Customer) in the same test suite with isolated storageState?",
    "shortAnswer": "Generate separate storage states (.auth/admin.json, .auth/user.json) during setup and apply them per project or per describe block via test.use().",
    "category": "Sessions, Auth & Dialogs",
    "difficulty": "Advanced",
    "tags": [
      "RBAC",
      "Multi-Role",
      "storageState",
      "test.use"
    ],
    "detailedExplanation": [
      "Role-Based Access Control (RBAC) requires testing that Admins have permission to delete resources while standard Users see permission denied.",
      "Generate multiple storage files during setup: `.auth/admin.json`, `.auth/manager.json`, `.auth/user.json`.",
      "Apply them granularly:",
      "- Per Project: Define an 'admin-tests' project and a 'customer-tests' project in config.",
      "- Per File / Describe: Use `test.use({ storageState: 'playwright/.auth/admin.json' })` inside a specific describe block."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest.describe('Admin Operations', () => {\n  // Override storageState for this describe block:\n  test.use({ storageState: 'playwright/.auth/admin.json' });\n\n  test('admin can access billing dashboard', async ({ page }) => {\n    await page.goto('/admin/billing');\n    await expect(page.getByRole('heading', { name: 'Financial Overview' })).toBeVisible();\n  });\n});\n\ntest.describe('Standard User Operations', () => {\n  test.use({ storageState: 'playwright/.auth/user.json' });\n\n  test('regular user is forbidden from billing', async ({ page }) => {\n    await page.goto('/admin/billing');\n    await expect(page.getByText('403 Forbidden')).toBeVisible();\n  });\n});",
      "explanation": "Switching authentication state per describe block using test.use()."
    },
    "proTip": "This pattern allows testing complex RBAC matrices in seconds without ever logging in or out during test execution.",
    "commonFollowUp": "Can a single test switch storageState mid-execution?"
  },
  {
    "id": 123,
    "question": "How do you handle 2-Factor Authentication (2FA / OTP / TOTP) in automated Playwright tests?",
    "shortAnswer": "Generate time-based one-time passwords (TOTP) algorithmically in Node.js using libraries like otplib with your shared secret key.",
    "category": "Sessions, Auth & Dialogs",
    "difficulty": "Advanced",
    "tags": [
      "2FA",
      "TOTP",
      "OTP",
      "Security"
    ],
    "detailedExplanation": [
      "Automating SMS-based 2FA is brittle and expensive. Best practice for automated test accounts is using Time-based One-Time Passwords (TOTP) like Google Authenticator.",
      "Store the test user's base32 TOTP secret key securely in an environment variable (e.g. `process.env.TEST_USER_TOTP_SECRET`).",
      "In your setup test, use the `otplib` npm package to generate the current valid 6-digit code and fill the verification input.",
      "Once verified, save the session via `storageState` so 2FA is executed only once per test run."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\nimport { authenticator } from 'otplib';\n\ntest('login with automated 2FA token generation', async ({ page }) => {\n  await page.goto('/login');\n  await page.getByLabel('Email').fill('test@company.com');\n  await page.getByLabel('Password').fill('Password123!');\n  await page.getByRole('button', { name: 'Sign in' }).click();\n\n  // Generate current 6-digit code using secret key:\n  const secret = process.env.TEST_2FA_SECRET || 'JBSWY3DPEHPK3PXP';\n  const token = authenticator.generate(secret);\n\n  await page.getByLabel('Verification Code').fill(token);\n  await page.getByRole('button', { name: 'Verify' }).click();\n  await expect(page).toHaveURL('/dashboard');\n});",
      "explanation": "Generating valid TOTP 2FA tokens on the fly using otplib."
    },
    "proTip": "Work with your security team to provision dedicated test accounts with static TOTP secrets or bypass flags for internal test runner IPs.",
    "commonFollowUp": "How do you handle hardware security keys (WebAuthn / FIDO2) in Playwright?"
  },
  {
    "id": 124,
    "question": "How do you test browser popups opened via window.open() or target='_blank' links?",
    "shortAnswer": "Use Promise.all([page.waitForEvent('popup'), clickTrigger()]) to capture the newly opened Page object.",
    "category": "Sessions, Auth & Dialogs",
    "difficulty": "Beginner",
    "tags": [
      "Popups",
      "waitForEvent",
      "target=_blank",
      "Tabs"
    ],
    "detailedExplanation": [
      "When users click `<a target='_blank'>` or trigger `window.open()`, the browser opens a new tab or popup window.",
      "Playwright does not automatically switch the `page` variable to the new window.",
      "To interact with the new popup:",
      "1. Set up listener: `page.waitForEvent('popup')`",
      "2. Click the link",
      "3. Await the popup `Page` instance.",
      "The returned popup `Page` has all standard Playwright methods (`goto`, `getByRole`, `close`)."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('handle new tab opened by external link', async ({ page }) => {\n  await page.goto('/help');\n\n  // Wait for popup while clicking link:\n  const [popup] = await Promise.all([\n    page.waitForEvent('popup'),\n    page.getByRole('link', { name: 'Privacy Policy' }).click(),\n  ]);\n\n  // Assert elements inside the new tab:\n  await popup.waitForLoadState();\n  await expect(popup).toHaveTitle(/Privacy Policy/);\n  await popup.close(); // Clean up tab\n});",
      "explanation": "Capturing and asserting against popups and new tabs."
    },
    "proTip": "Always call `await popup.close()` when finished testing the popup to free up browser memory.",
    "commonFollowUp": "What is the difference between page.waitForEvent('popup') and context.waitForEvent('page')?"
  },
  {
    "id": 125,
    "question": "How do you switch focus and control between multiple open tabs and browser windows?",
    "shortAnswer": "Access context.pages() to get an array of all open tabs, or assign individual Page references when tabs open.",
    "category": "Sessions, Auth & Dialogs",
    "difficulty": "Intermediate",
    "tags": [
      "Multi-Tab",
      "context.pages",
      "Window Management"
    ],
    "detailedExplanation": [
      "In Selenium, managing windows required cumbersome window handles: `driver.switchTo().window(handle)`.",
      "In Playwright, each tab is simply an independent `Page` object. There is NO concept of 'switching focus'—you can perform actions on Page 1 and Page 2 concurrently without any switching commands!",
      "`context.pages()` returns an array of all active tabs currently open in that browser context."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('interact with multiple open tabs simultaneously', async ({ context }) => {\n  const page1 = await context.newPage();\n  const page2 = await context.newPage();\n\n  await page1.goto('/dashboard');\n  await page2.goto('/analytics');\n\n  // No switchTo needed! Interact with both tabs in parallel:\n  await page1.getByRole('button', { name: 'Create Project' }).click();\n  await page2.reload();\n  await expect(page2.getByText('New Project Detected')).toBeVisible();\n\n  expect(context.pages().length).toBe(2);\n});",
      "explanation": "Controlling multiple tabs concurrently without context-switching commands."
    },
    "proTip": "Because you hold direct references to `page1` and `page2`, you never have to worry about focus loss or active window state.",
    "commonFollowUp": "How do you bring a specific tab to the visual front in headed mode?"
  },
  {
    "id": 126,
    "question": "How do you handle native JavaScript dialogs (alert(), confirm(), prompt()) using page.on('dialog')?",
    "shortAnswer": "Attach a listener page.on('dialog', dialog => dialog.accept()) before triggering the dialog. Playwright auto-dismisses dialogs by default.",
    "category": "Sessions, Auth & Dialogs",
    "difficulty": "Beginner",
    "tags": [
      "Dialogs",
      "alert",
      "confirm",
      "prompt"
    ],
    "detailedExplanation": [
      "Native JavaScript dialogs (`window.alert()`, `window.confirm()`, `window.prompt()`) block the browser's JavaScript execution thread until closed.",
      "Playwright auto-dismisses all dialogs by default so tests don't hang indefinitely.",
      "To verify or accept dialogs:",
      "1. Listen: `page.on('dialog', async (dialog) => { ... })`",
      "2. Inspect: `dialog.type()`, `dialog.message()`, `dialog.defaultValue()`",
      "3. Action: `await dialog.accept('optional text')` or `await dialog.dismiss()`."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('handle confirm dialog and verify warning message', async ({ page }) => {\n  await page.goto('/admin');\n\n  // Register dialog handler before clicking delete:\n  page.on('dialog', async (dialog) => {\n    expect(dialog.type()).toBe('confirm');\n    expect(dialog.message()).toBe('Are you sure you want to delete this user?');\n    await dialog.accept(); // Clicks OK\n  });\n\n  await page.getByRole('button', { name: 'Delete User' }).click();\n  await expect(page.getByText('User Deleted')).toBeVisible();\n});",
      "explanation": "Accepting a native confirmation dialog and verifying message text."
    },
    "proTip": "Remember that `page.on('dialog')` must be attached BEFORE clicking the button that triggers the dialog!",
    "commonFollowUp": "What happens if a test does not register a dialog listener and a prompt() opens?"
  },
  {
    "id": 127,
    "question": "How do you handle 'BeforeUnload' dialogs when leaving unsaved forms?",
    "shortAnswer": "Listen for page.on('dialog') with type: 'beforeunload' and call dialog.accept() to permit navigation.",
    "category": "Sessions, Auth & Dialogs",
    "difficulty": "Advanced",
    "tags": [
      "beforeunload",
      "Unsaved Changes",
      "Navigation",
      "Dialogs"
    ],
    "detailedExplanation": [
      "When users edit form fields and attempt to navigate away, web applications register `window.onbeforeunload` to display a native prompt: 'Changes you made may not be saved.'",
      "In Playwright, `beforeunload` events are treated as dialogs with `dialog.type() === 'beforeunload'`.",
      "Calling `dialog.accept()` confirms leaving the page, allowing navigation to proceed."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('confirm departure from unsaved form', async ({ page }) => {\n  await page.goto('/document-editor');\n  await page.getByRole('textbox').fill('Unsaved draft notes...');\n\n  // Handle native beforeunload prompt:\n  page.on('dialog', async (dialog) => {\n    if (dialog.type() === 'beforeunload') {\n      await dialog.accept(); // Leave page anyway\n    }\n  });\n\n  await page.goto('/home');\n  await expect(page).toHaveURL('/home');\n});",
      "explanation": "Accepting a native beforeunload prompt to allow page departure."
    },
    "proTip": "If you want to cancel the navigation and stay on the form, call `dialog.dismiss()` instead.",
    "commonFollowUp": "Can you assert the custom message text inside a modern beforeunload dialog?"
  },
  {
    "id": 128,
    "question": "How do you emulate mobile viewports, touch screens, and device pixel ratios using devices['iPhone 14']?",
    "shortAnswer": "Import devices from @playwright/test and assign devices['Pixel 7'] or devices['iPhone 14'] to projects or browser contexts.",
    "category": "Sessions, Auth & Dialogs",
    "difficulty": "Beginner",
    "tags": [
      "Mobile Emulation",
      "devices",
      "Responsive",
      "Touch"
    ],
    "detailedExplanation": [
      "Playwright has an extensive built-in device registry (`devices`) containing precise mobile device specifications:",
      "- Viewport dimensions (`width`, `height`)",
      "- `deviceScaleFactor` (Retina 2x/3x pixel densities)",
      "- `isMobile: true` (dispatches touch events instead of mouse clicks)",
      "- `hasTouch: true`",
      "- Real mobile User-Agent string.",
      "Configure per project in `playwright.config.ts` to run full matrix tests on Mobile Chrome and Mobile Safari."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "// playwright.config.ts\nimport { defineConfig, devices } from '@playwright/test';\n\nexport default defineConfig({\n  projects: [\n    {\n      name: 'Mobile Safari (iPhone 14)',\n      use: { ...devices['iPhone 14'] },\n    },\n    {\n      name: 'Mobile Android (Pixel 7)',\n      use: { ...devices['Pixel 7'] },\n    },\n  ],\n});",
      "explanation": "Configuring mobile device emulations with accurate touch, screen size, and user agent."
    },
    "proTip": "Testing with `isMobile: true` triggers hamburger menus, responsive layout breakpoints, and touch swipe gestures automatically.",
    "commonFollowUp": "Does mobile emulation run in a real mobile OS simulator like iOS Simulator or Android Emulator?"
  },
  {
    "id": 129,
    "question": "How do you test dark mode and light mode using colorScheme: 'dark' emulation?",
    "shortAnswer": "Set colorScheme: 'dark' in playwright.config.ts or call page.emulateMedia({ colorScheme: 'dark' }) at runtime.",
    "category": "Sessions, Auth & Dialogs",
    "difficulty": "Beginner",
    "tags": [
      "Dark Mode",
      "colorScheme",
      "CSS Media Queries",
      "Theme"
    ],
    "detailedExplanation": [
      "Modern web applications adapt their themes using CSS `@media (prefers-color-scheme: dark)` or Tailwind `dark:` classes.",
      "Playwright allows toggling the OS color scheme preference instantly.",
      "- Static config: `use: { colorScheme: 'dark' }` in `playwright.config.ts`.",
      "- Dynamic runtime: `await page.emulateMedia({ colorScheme: 'dark' })` mid-test.",
      "Combine with visual screenshot testing to verify dark mode styles across your entire application."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('verify dark mode background styling', async ({ page }) => {\n  await page.goto('/');\n  // Switch OS preference to dark mode:\n  await page.emulateMedia({ colorScheme: 'dark' });\n  // Verify body background switches to dark tone:\n  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(15, 23, 42)');\n});",
      "explanation": "Emulating dark mode media preference at runtime."
    },
    "proTip": "You can also emulate print media stylesheets: `await page.emulateMedia({ media: 'print' })`.",
    "commonFollowUp": "How do you test forced-colors: active for high contrast accessibility modes?"
  },
  {
    "id": 130,
    "question": "How do you emulate geolocation (GPS latitude/longitude) and grant browser location permissions?",
    "shortAnswer": "Configure geolocation: { latitude, longitude } and permissions: ['geolocation'] in context options.",
    "category": "Sessions, Auth & Dialogs",
    "difficulty": "Intermediate",
    "tags": [
      "Geolocation",
      "GPS",
      "Permissions",
      "Maps"
    ],
    "detailedExplanation": [
      "Apps with location-aware features (store finders, local weather, maps) query `navigator.geolocation.getCurrentPosition()`.",
      "In real browsers, an OS permission popup blocks until approved.",
      "Playwright bypasses permission prompts by pre-granting permissions and providing synthetic GPS coordinates.",
      "Can be configured globally in `playwright.config.ts` or dynamically via `context.setGeolocation()`."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('test store locator near London landmarks', async ({ browser }) => {\n  const context = await browser.newContext({\n    permissions: ['geolocation'],\n    geolocation: { latitude: 51.5074, longitude: -0.1278 } // London coordinates\n  });\n  const page = await context.newPage();\n\n  await page.goto('/find-store');\n  await page.getByRole('button', { name: 'Use Current Location' }).click();\n  await expect(page.getByText('Nearest Store: Covent Garden')).toBeVisible();\n  await context.close();\n});",
      "explanation": "Emulating GPS coordinates and pre-granting location permissions."
    },
    "proTip": "Use `context.grantPermissions(['notifications', 'camera', 'microphone'])` to pre-approve any browser permission dialogs.",
    "commonFollowUp": "What happens if you test behavior when geolocation permission is denied?"
  },
  {
    "id": 131,
    "question": "How do you emulate browser locales, timezones (e.g., 'America/New_York'), and currency formatting?",
    "shortAnswer": "Set locale: 'de-DE' and timezoneId: 'Europe/Berlin' in config or context options to test localized numbers, dates, and translations.",
    "category": "Sessions, Auth & Dialogs",
    "difficulty": "Intermediate",
    "tags": [
      "Localization",
      "i18n",
      "Timezone",
      "Locale"
    ],
    "detailedExplanation": [
      "International applications format dates (`MM/DD/YYYY` vs `DD.MM.YYYY`), currencies (`$1,000` vs `1.000 €`), and UI text based on browser locale and timezone.",
      "Playwright controls `navigator.language` and the underlying V8/ICU internationalization timezone.",
      "Setting `timezoneId: 'America/Los_Angeles'` guarantees that `new Date()` executes in Pacific Time, regardless of whether your CI server runs in Ireland or Tokyo."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('verify German currency and date formatting', async ({ browser }) => {\n  const context = await browser.newContext({\n    locale: 'de-DE',\n    timezoneId: 'Europe/Berlin'\n  });\n  const page = await context.newPage();\n\n  await page.goto('/pricing');\n  // Assert German comma decimal separator and € symbol:\n  await expect(page.getByTestId('plan-price')).toHaveText('49,99 €');\n  await context.close();\n});",
      "explanation": "Configuring locale and timezone for internationalization testing."
    },
    "proTip": "Fixing `timezoneId` in CI prevents tests that check dates and schedules from breaking around Daylight Saving Time transitions.",
    "commonFollowUp": "Can you change the timezone of a page dynamically after it has loaded?"
  },
  {
    "id": 132,
    "question": "How do you emulate PDF generation in headless Chrome using page.pdf()?",
    "shortAnswer": "Call await page.pdf({ path: 'output.pdf', format: 'A4' }) to render and save a pixel-perfect PDF document in Chromium.",
    "category": "Sessions, Auth & Dialogs",
    "difficulty": "Intermediate",
    "tags": [
      "PDF",
      "page.pdf",
      "Printing",
      "Reporting"
    ],
    "detailedExplanation": [
      "Generating invoices, certificates, and export reports in PDF format is a critical enterprise workflow.",
      "Playwright allows generating PDFs directly from HTML using `page.pdf()`.",
      "Options include: `format: 'A4'`, `landscape: true`, `printBackground: true`, `margin: { top, bottom, left, right }`, and custom header/footer templates.",
      "Note: `page.pdf()` is supported ONLY in headless Chromium mode."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\nimport fs from 'fs';\n\ntest('generate invoice PDF document', async ({ page, browserName }) => {\n  test.skip(browserName !== 'chromium', 'page.pdf is Chromium-exclusive');\n\n  await page.goto('/invoice/2048');\n  const pdfBuffer = await page.pdf({\n    format: 'A4',\n    printBackground: true,\n    margin: { top: '20px', bottom: '20px' }\n  });\n\n  expect(pdfBuffer.length).toBeGreaterThan(5000); // Verify PDF generated\n});",
      "explanation": "Exporting web pages to PDF format in headless Chromium."
    },
    "proTip": "Always pass `printBackground: true` so CSS background colors and images are rendered into the generated PDF.",
    "commonFollowUp": "Can you assert text content inside a generated PDF using Playwright?"
  },
  {
    "id": 133,
    "question": "How do you clear browser cookies, localStorage, and sessionStorage programmatically mid-test?",
    "shortAnswer": "Use context.clearCookies() for cookies, and page.evaluate(() => localStorage.clear()) for storage.",
    "category": "Sessions, Auth & Dialogs",
    "difficulty": "Beginner",
    "tags": [
      "clearCookies",
      "localStorage",
      "sessionStorage",
      "Logout"
    ],
    "detailedExplanation": [
      "While Playwright automatically isolates storage between tests, you occasionally need to test session expiration, manual logout, or clearing the shopping cart within a single test.",
      "- Cookies: `await context.clearCookies()` removes all cookies.",
      "- LocalStorage: `await page.evaluate(() => localStorage.clear())`.",
      "- SessionStorage: `await page.evaluate(() => sessionStorage.clear())`."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('test session expiration when cookies are cleared', async ({ page, context }) => {\n  await page.goto('/dashboard');\n  await expect(page.getByRole('heading')).toHaveText('Welcome Back');\n\n  // Clear session authentication cookies:\n  await context.clearCookies();\n  await page.reload();\n\n  // Verify redirected to login:\n  await expect(page).toHaveURL(/.*login/);\n});",
      "explanation": "Clearing session cookies to verify logout and token expiration flows."
    },
    "proTip": "Use `context.clearCookies({ name: 'session_id' })` to target and delete a specific single cookie while keeping others intact.",
    "commonFollowUp": "How do you inspect the current list of cookies via context.cookies()?"
  },
  {
    "id": 134,
    "question": "How do you test Progressive Web Apps (PWA) and Service Worker registration in Playwright?",
    "shortAnswer": "Inspect context.serviceWorkers(), wait for active workers with context.waitForEvent('serviceworker'), and verify cache storage.",
    "category": "Sessions, Auth & Dialogs",
    "difficulty": "Advanced",
    "tags": [
      "PWA",
      "ServiceWorker",
      "CacheStorage",
      "Offline"
    ],
    "detailedExplanation": [
      "Progressive Web Apps rely on background Service Workers to intercept network requests and manage offline cache stores.",
      "Playwright allows monitoring and testing Service Workers directly via `context.serviceWorkers()`.",
      "You can assert that a Service Worker has registered, verify its state ('activated'), and test offline fallback by pairing it with `context.setOffline(true)`."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('verify service worker registration and cache', async ({ page, context }) => {\n  const swPromise = context.waitForEvent('serviceworker');\n  await page.goto('/');\n  const sw = await swPromise;\n  expect(sw.url()).toContain('sw.js');\n\n  // Verify offline mode operates via Service Worker cache:\n  await context.setOffline(true);\n  await page.reload();\n  await expect(page.getByRole('heading')).toBeVisible();\n});",
      "explanation": "Testing PWA Service Worker lifecycle and offline cache resiliency."
    },
    "proTip": "Note that Service Workers only register in Chromium and Firefox; WebKit on Linux does not support full PWA Service Worker lifecycles.",
    "commonFollowUp": "How do you bypass or unregister a Service Worker in Playwright?"
  },
  {
    "id": 135,
    "question": "How do you simulate clipboard copy and paste operations using browser context permissions?",
    "shortAnswer": "Grant permissions: ['clipboard-read', 'clipboard-write'] to the context, then read or write via page.evaluate(navigator.clipboard).",
    "category": "Sessions, Auth & Dialogs",
    "difficulty": "Intermediate",
    "tags": [
      "Clipboard",
      "Copy Paste",
      "Permissions",
      "Navigator"
    ],
    "detailedExplanation": [
      "Web applications frequently feature 'Copy Link to Clipboard' or 'Copy Code' buttons.",
      "Browsers restrict access to the system clipboard for security reasons.",
      "In Playwright, pre-grant permissions: `permissions: ['clipboard-read', 'clipboard-write']`.",
      "After clicking your copy button, assert the clipboard content via `page.evaluate(() => navigator.clipboard.readText())`."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('verify copy link to clipboard button', async ({ browser }) => {\n  const context = await browser.newContext({\n    permissions: ['clipboard-read', 'clipboard-write']\n  });\n  const page = await context.newPage();\n\n  await page.goto('/share');\n  await page.getByRole('button', { name: 'Copy Share Link' }).click();\n\n  const clipboardText = await page.evaluate(() => navigator.clipboard.readText());\n  expect(clipboardText).toContain('https://example.com/share?id=123');\n  await context.close();\n});",
      "explanation": "Testing clipboard copy functionality with pre-granted permissions."
    },
    "proTip": "You can also paste into inputs using `locator.focus()` followed by `page.keyboard.press('ControlOrMeta+KeyV')`.",
    "commonFollowUp": "How do you test copying rich formatted HTML or images to the clipboard?"
  },
  {
    "id": 136,
    "question": "How does Playwright test sharding work (--shard=1/4), and how do you split test runs across GitHub Actions matrix jobs?",
    "shortAnswer": "Sharding divides the test suite into N equal chunks (--shard=index/total) to run in parallel across independent CI runners, slashing build time proportionally.",
    "category": "Test Runner, CI/CD & Config",
    "difficulty": "Advanced",
    "tags": [
      "Sharding",
      "GitHub Actions",
      "CI/CD",
      "Parallelism"
    ],
    "detailedExplanation": [
      "When a test suite grows to 2,000 tests taking 40 minutes on a single CI machine, vertical scaling (adding CPU cores) reaches diminishing returns.",
      "Playwright has built-in horizontal sharding: `npx playwright test --shard=1/4`, `--shard=2/4`, etc.",
      "Playwright computes a deterministic hash of all test files and splits them into 4 balanced buckets.",
      "In GitHub Actions, define a matrix job: `strategy: { matrix: { shard: [1, 2, 3, 4] } }`. All 4 runners execute concurrently, reducing a 40-minute run to 10 minutes."
    ],
    "codeSnippet": {
      "language": "yaml",
      "code": "# .github/workflows/playwright.yml\njobs:\n  test:\n    strategy:\n      fail-fast: false\n      matrix:\n        shardIndex: [1, 2, 3, 4]\n        shardTotal: [4]\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n      - run: npm ci\n      - run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}",
      "explanation": "GitHub Actions matrix configuration for horizontal 4-way test sharding."
    },
    "proTip": "Pair sharding with the `blob` reporter to merge individual shard results into one comprehensive HTML report after all jobs finish.",
    "commonFollowUp": "What happens if one shard finishes significantly faster than another?"
  },
  {
    "id": 137,
    "question": "How do you merge Blob reports from multiple sharded CI runners into a single unified HTML report?",
    "shortAnswer": "Configure reporter: 'blob' on each shard, upload the blob report artifacts to CI, and run npx playwright merge-reports in a final post-processing job.",
    "category": "Test Runner, CI/CD & Config",
    "difficulty": "Advanced",
    "tags": [
      "Blob Reporter",
      "merge-reports",
      "HTML Report",
      "CI/CD"
    ],
    "detailedExplanation": [
      "When running 10 sharded GitHub Actions jobs, each runner produces its own test results. Having 10 separate reports is unmanageable.",
      "Playwright's solution:",
      "1. On sharded runners: Set `reporter: 'blob'` in config. Each runner outputs a zip file containing raw test results and traces.",
      "2. Upload artifacts using `actions/upload-artifact`.",
      "3. Final Job: Download all blob artifacts into a single folder and execute: `npx playwright merge-reports --reporter=html ./all-blob-reports`.",
      "4. Upload the single unified HTML report to GitHub Pages or S3."
    ],
    "codeSnippet": {
      "language": "bash",
      "code": "# On sharded runners:\nnpx playwright test --shard=1/4 --reporter=blob\n\n# In final report aggregator job:\nnpx playwright merge-reports --reporter=html ./blob-reports\nnpx playwright show-report",
      "explanation": "Merging distributed shard test results into a single consolidated HTML report."
    },
    "proTip": "The merged report correctly combines timings, retry attempts, video recordings, and traces from all distributed machines.",
    "commonFollowUp": "Can you merge JUnit XML reports from multiple shards as well?"
  },
  {
    "id": 138,
    "question": "What is the difference between workers, fullyParallel, and test.describe.configure({ mode: 'serial' })?",
    "shortAnswer": "workers sets process concurrency. fullyParallel runs individual tests in a file concurrently. serial mode forces tests in a file to run sequentially and stops on first failure.",
    "category": "Test Runner, CI/CD & Config",
    "difficulty": "Intermediate",
    "tags": [
      "workers",
      "fullyParallel",
      "serial mode",
      "Concurrency"
    ],
    "detailedExplanation": [
      "- `workers: 4`: The number of concurrent Node.js processes running tests.",
      "- `fullyParallel: true`: By default, Playwright runs files in parallel, but tests inside a file sequentially. `fullyParallel: true` runs every individual `test()` across different workers in parallel.",
      "- `mode: 'serial'`: Forces tests inside a describe block to run sequentially on the SAME worker. If Test 1 fails, Tests 2 and 3 are automatically skipped because they depend on Test 1's state."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\n// Serial mode: Tests depend on prior steps\ntest.describe.configure({ mode: 'serial' });\n\ntest.describe('Wizard Creation Flow', () => {\n  test('Step 1: Create Organization', async ({ page }) => { /* ... */ });\n  test('Step 2: Invite Team Member', async ({ page }) => { /* ... */ });\n  test('Step 3: Verify Admin Billing', async ({ page }) => { /* ... */ });\n});",
      "explanation": "Configuring serial execution for dependent multi-step workflows."
    },
    "proTip": "Use serial mode sparingly! Always aim for independent, atomic tests that can run with `fullyParallel: true`.",
    "commonFollowUp": "What happens if a test in a serial suite fails during retry?"
  },
  {
    "id": 139,
    "question": "How do you configure automatic test retries on CI (retries: 2) vs local development (retries: 0)?",
    "shortAnswer": "Set retries: process.env.CI ? 2 : 0 in playwright.config.ts to retry transient failures on CI while failing fast locally.",
    "category": "Test Runner, CI/CD & Config",
    "difficulty": "Beginner",
    "tags": [
      "retries",
      "CI/CD",
      "Flakiness",
      "playwright.config.ts"
    ],
    "detailedExplanation": [
      "During local development, you want tests to fail immediately so you can fix bugs without waiting for retries.",
      "In CI/CD environments, transient network hiccups, cloud runner CPU spikes, or database locks can cause occasional failures.",
      "Setting `retries: process.env.CI ? 2 : 0` gives failed tests two chances to retry in a fresh browser context.",
      "Tests that pass on retry are flagged as 'Flaky' in reports, giving your team visibility into instability."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "// playwright.config.ts\nimport { defineConfig } from '@playwright/test';\n\nexport default defineConfig({\n  // Retry twice on CI, 0 times locally:\n  retries: process.env.CI ? 2 : 0,\n  // Fail fast locally if needed:\n  maxFailures: process.env.CI ? undefined : 1,\n});",
      "explanation": "Environment-aware retry configuration in playwright.config.ts."
    },
    "proTip": "Never use retries as an excuse for poor locators. Regularly review your 'Flaky' test report tab and fix root causes.",
    "commonFollowUp": "How does Playwright assign workers when a test is retried?"
  },
  {
    "id": 140,
    "question": "How do you define custom fixtures using test.extend<MyFixtures>() to inject authenticated Page Objects?",
    "shortAnswer": "Use test.extend<{ myPage: MyPageClass }> to instantiate, initialize, and tear down custom fixtures automatically for every test.",
    "category": "Test Runner, CI/CD & Config",
    "difficulty": "Advanced",
    "tags": [
      "Fixtures",
      "test.extend",
      "Page Object Model",
      "Dependency Injection"
    ],
    "detailedExplanation": [
      "Playwright fixtures are based on Dependency Injection. Built-in fixtures include `page`, `context`, `browser`, and `request`.",
      "Using `test.extend<T>()`, you can create custom fixtures that:",
      "1. Setup: Instantiate Page Object classes, authenticate users, seed database records.",
      "2. Pass: Provide the initialized instance to the test callback.",
      "3. Teardown: Automatically clean up after the test completes (code following `await use(instance)`).",
      "Tests simply declare `{ loginPage, dashboardPage }` in their arguments."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "// fixtures.ts\nimport { test as base } from '@playwright/test';\nimport { DashboardPage } from './pages/DashboardPage';\n\ntype CustomFixtures = {\n  dashboardPage: DashboardPage;\n};\n\nexport const test = base.extend<CustomFixtures>({\n  dashboardPage: async ({ page }, use) => {\n    // Setup:\n    const dashboard = new DashboardPage(page);\n    await dashboard.goto();\n    // Provide to test:\n    await use(dashboard);\n    // Teardown (runs automatically after test):\n    await dashboard.cleanup();\n  },\n});\n\nexport { expect } from '@playwright/test';",
      "explanation": "Creating self-cleaning custom Page Object fixtures with test.extend."
    },
    "proTip": "Custom fixtures eliminate repetitive `beforeEach` boilerplate and guarantee teardown runs even if the test crashes.",
    "commonFollowUp": "What is the difference between a test-scoped fixture and a worker-scoped fixture?"
  },
  {
    "id": 141,
    "question": "What is the difference between a test scoped fixture and a worker scoped fixture in Playwright?",
    "shortAnswer": "Test-scoped fixtures run once per test case (fresh instance). Worker-scoped fixtures ({ scope: 'worker' }) run once per worker process (shared across all tests in that worker).",
    "category": "Test Runner, CI/CD & Config",
    "difficulty": "Advanced",
    "tags": [
      "Fixtures",
      "Worker Scope",
      "Performance",
      "Database Setup"
    ],
    "detailedExplanation": [
      "- Test-scoped (default): Setup and teardown run for EVERY test. Built-in examples: `page`, `context`.",
      "- Worker-scoped (`{ scope: 'worker' }`): Setup runs ONCE when the worker process boots, and teardown runs when the worker exits. Built-in example: `browser`.",
      "Use worker fixtures for heavy operations: spinning up a local test database (PostgreSQL in Docker), starting a backend mock server, or establishing database connection pools."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "// fixtures.ts\nimport { test as base } from '@playwright/test';\n\ntype WorkerFixtures = {\n  dbConnection: any;\n};\n\nexport const test = base.extend<{}, WorkerFixtures>({\n  // Worker-scoped fixture created once per worker process:\n  dbConnection: [async ({}, use) => {\n    const db = await createDatabaseConnection();\n    await use(db);\n    await db.close(); // Cleaned up when worker process terminates\n  }, { scope: 'worker' }],\n});",
      "explanation": "Declaring a worker-scoped fixture that shares database connections across tests in that worker."
    },
    "proTip": "Worker fixtures cannot depend on test-scoped fixtures (e.g. A worker fixture cannot use `page`), but test fixtures CAN depend on worker fixtures.",
    "commonFollowUp": "How do worker fixtures coordinate data when multiple workers run in parallel?"
  },
  {
    "id": 142,
    "question": "How do you configure multiple test environments (Local, Staging, QA, Prod) with dotenv and baseURL?",
    "shortAnswer": "Use dotenv to load .env.${process.env.ENV || 'staging'} dynamically in playwright.config.ts and assign baseURL: process.env.BASE_URL.",
    "category": "Test Runner, CI/CD & Config",
    "difficulty": "Intermediate",
    "tags": [
      "Environments",
      "dotenv",
      "baseURL",
      "Staging",
      "Production"
    ],
    "detailedExplanation": [
      "Test automation suites must seamlessly target Local (`localhost:3000`), Staging, and Production smoke tests without code changes.",
      "In `playwright.config.ts`, load the appropriate environment file using `dotenv`:",
      "`dotenv.config({ path: `.env.${process.env.TEST_ENV || 'staging'}` })`.",
      "Assign `use: { baseURL: process.env.BASE_URL }`.",
      "In your tests, always navigate using relative paths: `await page.goto('/login')`."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "// playwright.config.ts\nimport { defineConfig } from '@playwright/test';\nimport dotenv from 'dotenv';\nimport path from 'path';\n\nconst env = process.env.TEST_ENV || 'staging';\ndotenv.config({ path: path.resolve(__dirname, `.env.${env}`) });\n\nexport default defineConfig({\n  use: {\n    baseURL: process.env.BASE_URL || 'https://staging.example.com',\n  },\n});\n\n// Run with: TEST_ENV=prod npx playwright test",
      "explanation": "Dynamic environment switching using dotenv and configurable baseURL."
    },
    "proTip": "Always use relative navigation in tests (`page.goto('/cart')`). If `baseURL` is set, Playwright automatically resolves relative paths against it.",
    "commonFollowUp": "How do you protect production environments from destructive test data mutations during smoke runs?"
  },
  {
    "id": 143,
    "question": "How do you organize tests using tags (e.g. @smoke, @regression, @slow) and filter with --grep and --grep-invert?",
    "shortAnswer": "Add { tag: '@smoke' } to test declarations or include tags in test titles, then execute via --grep '@smoke' or invert with --grep-invert '@slow'.",
    "category": "Test Runner, CI/CD & Config",
    "difficulty": "Beginner",
    "tags": [
      "Tags",
      "Grep",
      "Smoke Tests",
      "CLI Filter"
    ],
    "detailedExplanation": [
      "Tagging tests enables selective execution based on build triggers (e.g. Run 2-minute `@smoke` suite on every pull request, and run 45-minute `@regression` suite nightly).",
      "Playwright supports two tagging methods:",
      "1. Modern API: `test('checkout', { tag: '@smoke' }, async ({ page }) => { ... })`",
      "2. Title String: `test('checkout @smoke', async ({ page }) => { ... })`",
      "CLI Flags:",
      "- `npx playwright test --grep @smoke` (runs only tests tagged with @smoke)",
      "- `npx playwright test --grep-invert @slow` (runs everything EXCEPT tests tagged @slow)."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\n// Modern tag declaration:\ntest('critical login path', { tag: ['@smoke', '@auth'] }, async ({ page }) => {\n  await page.goto('/login');\n  await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();\n});\n\ntest('heavy data export report', { tag: '@slow' }, async ({ page }) => {\n  // Long running regression test\n});",
      "explanation": "Declaring and running tagged tests with Playwright."
    },
    "proTip": "You can apply tags to entire suites: `test.describe('Payment Flows', { tag: '@billing' }, () => { ... })`.",
    "commonFollowUp": "Can you combine multiple tags with boolean AND/OR logic in --grep?"
  },
  {
    "id": 144,
    "question": "How do you set up custom HTML, JUnit, Allure, or Slack reporters in playwright.config.ts?",
    "shortAnswer": "Pass an array of reporter configurations: reporter: [['html', { open: 'never' }], ['junit', { outputFile: 'results.xml' }]].",
    "category": "Test Runner, CI/CD & Config",
    "difficulty": "Intermediate",
    "tags": [
      "Reporters",
      "HTML",
      "JUnit",
      "CI/CD",
      "Allure"
    ],
    "detailedExplanation": [
      "Playwright allows configuring multiple simultaneous reporters in `playwright.config.ts`.",
      "Built-in reporters:",
      "- `html`: Rich interactive report with step timelines, traces, videos, and screenshots.",
      "- `junit`: XML output parsed natively by Jenkins, Azure DevOps, and GitLab CI.",
      "- `list`: Clean CLI terminal output during execution.",
      "- `github`: Annotates failed lines directly inside GitHub PR pull request diffs.",
      "- `blob`: Raw test results for sharded merge operations."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "// playwright.config.ts\nimport { defineConfig } from '@playwright/test';\n\nexport default defineConfig({\n  reporter: [\n    ['list'],\n    ['html', { open: 'never', outputFolder: 'playwright-report' }],\n    ['junit', { outputFile: 'test-results/junit.xml' }],\n    ['github'], // Direct PR line annotations on GitHub Actions\n  ],\n});",
      "explanation": "Configuring multi-reporter arrays for local viewing and CI ingestion."
    },
    "proTip": "The `github` reporter annotates the exact line of failure in pull request code reviews automatically on GitHub Actions.",
    "commonFollowUp": "How do you build a custom reporter from scratch in Playwright?"
  },
  {
    "id": 145,
    "question": "How do you run tests inside an official Playwright Docker container (mcr.microsoft.com/playwright)?",
    "shortAnswer": "Use Microsoft's official Docker images containing pre-installed browser binaries and system OS dependencies for 100% reproducible Linux runs.",
    "category": "Test Runner, CI/CD & Config",
    "difficulty": "Intermediate",
    "tags": [
      "Docker",
      "Container",
      "Reproducibility",
      "CI/CD"
    ],
    "detailedExplanation": [
      "Font rendering differences, missing Linux shared libraries, and OS window managers can cause tests to behave differently locally on macOS vs CI Linux runners.",
      "Microsoft publishes official Docker images: `mcr.microsoft.com/playwright:v1.48.0-jammy`.",
      "These images contain:",
      "- Ubuntu Linux OS",
      "- Exact pinned versions of Chromium, Firefox, and WebKit",
      "- All required multimedia codecs and font rendering packages",
      "Running your tests inside this container guarantees that local runs and CI runs produce identical pixel results."
    ],
    "codeSnippet": {
      "language": "bash",
      "code": "# Run tests inside official Playwright container:\ndocker run --rm --network host -v $(pwd):/work/ -w /work/ \\n  mcr.microsoft.com/playwright:v1.48.0-jammy \\n  npx playwright test",
      "explanation": "Running Playwright tests inside Microsoft's official Docker image."
    },
    "proTip": "Always pin the exact version tag (`v1.48.0-jammy`) to match your `@playwright/test` package version in `package.json`.",
    "commonFollowUp": "How do you run Docker tests with volume-mounted results so reports are viewable on host machines?"
  },
  {
    "id": 146,
    "question": "How do you configure Playwright webServer in playwright.config.ts to automatically boot your frontend before tests?",
    "shortAnswer": "Set webServer: { command: 'npm run dev', port: 3000, reuseExistingServer: !process.env.CI } to launch the dev server automatically.",
    "category": "Test Runner, CI/CD & Config",
    "difficulty": "Beginner",
    "tags": [
      "webServer",
      "Local Development",
      "playwright.config.ts"
    ],
    "detailedExplanation": [
      "Forgetting to start your local dev server (`npm run dev`) before running tests leads to instant connection refused errors.",
      "Playwright provides a built-in `webServer` configuration block:",
      "- `command`: Shell command to launch your app (`npm run dev` or `npm run start`).",
      "- `port` or `url`: Health check endpoint Playwright polls before starting tests.",
      "- `reuseExistingServer`: If true (locally), Playwright re-uses an already running dev server on port 3000 rather than rebooting it.",
      "- Automatically shuts down the server when tests finish."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "// playwright.config.ts\nimport { defineConfig } from '@playwright/test';\n\nexport default defineConfig({\n  webServer: {\n    command: 'npm run dev',\n    url: 'http://localhost:3000',\n    reuseExistingServer: !process.env.CI,\n    timeout: 120 * 1000, // 2 minutes to boot\n  },\n  use: {\n    baseURL: 'http://localhost:3000',\n  },\n});",
      "explanation": "Configuring webServer to auto-boot frontend applications before test execution."
    },
    "proTip": "Set `reuseExistingServer: !process.env.CI` so developers can keep their local Vite/Next.js dev server running during test authoring.",
    "commonFollowUp": "Can you configure multiple webServers (e.g. Frontend on 3000, Backend API on 8080)?"
  },
  {
    "id": 147,
    "question": "What is globalSetup and globalTeardown in Playwright and what should (and shouldn't) be placed in them?",
    "shortAnswer": "globalSetup runs once in the main runner process before any workers boot. Use for database migrations or Docker startup; avoid using it for browser logins.",
    "category": "Test Runner, CI/CD & Config",
    "difficulty": "Advanced",
    "tags": [
      "globalSetup",
      "globalTeardown",
      "Database Migration",
      "Lifecycle"
    ],
    "detailedExplanation": [
      "`globalSetup` is a single file specified in `playwright.config.ts` that runs in the root Node.js process before any worker processes are spawned.",
      "Good uses for `globalSetup`:",
      "- Running database migrations or seeding global database fixtures.",
      "- Starting a Docker container or verifying backend services are healthy.",
      "- Clearing remote test buckets.",
      "What NOT to do: Do NOT perform browser UI login inside `globalSetup`! Use Project Dependencies (`auth.setup.ts`) instead. Project dependencies support tracing, fixtures, HTML reporting, and video; `globalSetup` does not."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "// global-setup.ts\nimport { FullConfig } from '@playwright/test';\n\nasync function globalSetup(config: FullConfig) {\n  console.log('Running global database migrations before test suite...');\n  await runDatabaseMigrations();\n}\n\nexport default globalSetup;\n\n// global-teardown.ts\nexport async function globalTeardown() {\n  console.log('Tearing down global services...');\n  await purgeDatabase();\n}",
      "explanation": "Setting up and tearing down global database services."
    },
    "proTip": "Modern Playwright guidelines strongly favor Project Dependencies over `globalSetup` for any tasks involving browser pages.",
    "commonFollowUp": "How can globalSetup pass runtime variables (e.g. dynamic port) to individual worker tests?"
  },
  {
    "id": 148,
    "question": "How do you handle flakiness caused by third-party tracking scripts, fonts, or slow external CDNs?",
    "shortAnswer": "Route and block non-essential third-party hosts via page.route(), and configure waitUntil: 'domcontentloaded' instead of waiting for full networkidle.",
    "category": "Test Runner, CI/CD & Config",
    "difficulty": "Intermediate",
    "tags": [
      "Flakiness",
      "Third-Party",
      "CDNs",
      "Optimization"
    ],
    "detailedExplanation": [
      "A frequent cause of random CI failures is slow third-party services (Google Fonts, Intercom chat widgets, Stripe checkout CDN, Google Analytics).",
      "Techniques to eliminate third-party flakiness:",
      "1. Avoid `waitUntil: 'networkidle'`. Networkidle will wait for ongoing tracking beacons, websockets, and background polling, causing 30s timeouts.",
      "2. Block external third-party domains: `await context.route(/google-analytics|intercom/, route => route.abort())`.",
      "3. Use `waitUntil: 'domcontentloaded'` in `page.goto()`."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('fast navigation ignoring slow external CDNs', async ({ page, context }) => {\n  // Block third-party widgets and analytics:\n  await context.route(/intercom|widget|analytics/, route => route.abort());\n\n  // Wait only for DOM ready rather than waiting for slow external images:\n  await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });\n  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();\n});",
      "explanation": "Bypassing slow external resources to achieve deterministic navigation times."
    },
    "proTip": "Never use `page.waitForLoadState('networkidle')` in production test suites—it is the single biggest cause of intermittent CI flakiness.",
    "commonFollowUp": "What is the difference between 'load', 'domcontentloaded', and 'commit' wait states?"
  },
  {
    "id": 149,
    "question": "How do you configure Playwright to fail fast (--max-failures=1) in CI pull request pipelines?",
    "shortAnswer": "Use maxFailures: process.env.CI ? 5 : 1 in config, or pass --max-failures=1 via CLI to abort immediately upon broken builds.",
    "category": "Test Runner, CI/CD & Config",
    "difficulty": "Beginner",
    "tags": [
      "max-failures",
      "Fail Fast",
      "CI/CD",
      "Cost Reduction"
    ],
    "detailedExplanation": [
      "In a 500-test suite, if a breaking backend change causes the very first test to fail, continuing to run the remaining 499 failing tests wastes CI build minutes and delays developer feedback.",
      "`--max-failures=N` instructs the test runner to stop all workers and terminate the run as soon as N tests fail.",
      "Typical configuration: `--max-failures=1` for PR pre-merge checks, or `--max-failures=5` on nightly runs."
    ],
    "codeSnippet": {
      "language": "bash",
      "code": "# Stop test run immediately on the first test failure:\nnpx playwright test --max-failures=1\n\n# Or configure in playwright.config.ts:\n# maxFailures: process.env.CI ? 5 : 1",
      "explanation": "Stopping test execution immediately on failure to conserve CI computing credits."
    },
    "proTip": "Pair `--max-failures=1` with GitHub Actions commit status checks for ultra-fast PR feedback loops.",
    "commonFollowUp": "Does maxFailures count retried tests that eventually passed?"
  },
  {
    "id": 150,
    "question": "How do you record and attach custom metadata, screenshots, or logs to test reports using testInfo.attach()?",
    "shortAnswer": "Call await testInfo.attach(name, { body, contentType }) to embed custom text logs, JSON payloads, or images into the HTML report and Trace.",
    "category": "Test Runner, CI/CD & Config",
    "difficulty": "Intermediate",
    "tags": [
      "testInfo.attach",
      "HTML Report",
      "Artifacts",
      "Debugging"
    ],
    "detailedExplanation": [
      "When debugging complex CI failures, having custom metadata (such as backend API transaction IDs, database query logs, or dynamic user credentials) attached directly to the HTML test report is invaluable.",
      "`testInfo.attach(name, options)` embeds custom artifacts directly into the test result.",
      "Attached text, JSON, screenshots, or CSV files appear in the test's report tab and within the Trace Viewer."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('attach backend transaction ID and payload to report', async ({ page }, testInfo) => {\n  await page.goto('/order');\n  const transactionId = 'TXN_987654321';\n\n  // Attach structured JSON log to report:\n  await testInfo.attach('transaction-metadata', {\n    body: JSON.stringify({ transactionId, environment: 'staging', timestamp: Date.now() }, null, 2),\n    contentType: 'application/json',\n  });\n\n  await expect(page.getByText('Order Confirmation')).toBeVisible();\n});",
      "explanation": "Embedding custom debugging metadata directly into Playwright HTML reports."
    },
    "proTip": "Use `testInfo.attach()` in an `afterEach` hook to automatically attach server error logs whenever a test fails.",
    "commonFollowUp": "What is the maximum file size supported for testInfo attachments?"
  },
  {
    "id": 151,
    "question": "What is Playwright Trace Viewer and how does it provide time-travel DOM snapshots and action filmstrips?",
    "shortAnswer": "Trace Viewer is a post-mortem GUI tool recording full DOM snapshots, network requests, console logs, and visual filmstrips for every single test action.",
    "category": "Debugging & Tracing",
    "difficulty": "Beginner",
    "tags": [
      "Trace Viewer",
      "Time-Travel",
      "DOM Snapshots",
      "Debugging"
    ],
    "detailedExplanation": [
      "Playwright Trace Viewer is widely regarded as the most powerful debugging tool in modern test automation.",
      "Unlike static screenshots or lossy video recordings, a Playwright Trace captures full, interactive DOM snapshots before and after every action.",
      "In Trace Viewer, you can:",
      "1. Inspect the live DOM tree as it existed at the exact millisecond of a failure.",
      "2. View all HTTP request/response payloads that occurred during that step.",
      "3. Test new locators live against the captured DOM snapshot without re-running the test.",
      "4. View console logs, source code lines, and mouse click coordinates."
    ],
    "codeSnippet": {
      "language": "bash",
      "code": "# Record trace during test run:\nnpx playwright test --trace on\n\n# Open and inspect the trace file:\nnpx playwright show-trace test-results/trace.zip\n\n# Or inspect online in any browser without installing Playwright:\n# Visit https://trace.playwright.dev and drag-and-drop trace.zip!",
      "explanation": "Recording and launching Playwright Trace Viewer."
    },
    "proTip": "Anyone on your team (including developers and product managers) can inspect a trace at https://trace.playwright.dev by simply dragging the zip file into their browser.",
    "commonFollowUp": "Does recording traces impact test execution performance?"
  },
  {
    "id": 152,
    "question": "How do you configure trace: 'on-first-retry' to capture rich traces only when tests fail in CI?",
    "shortAnswer": "Configure trace: 'on-first-retry' in playwright.config.ts. Tests run lean on their first attempt, and record full traces only if a retry is triggered.",
    "category": "Debugging & Tracing",
    "difficulty": "Intermediate",
    "tags": [
      "on-first-retry",
      "CI/CD",
      "Trace",
      "Optimization"
    ],
    "detailedExplanation": [
      "Recording traces for 10,000 passing tests produces gigabytes of zip files and adds ~15% overhead to CI execution.",
      "Setting `trace: 'on-first-retry'` is the enterprise golden standard:",
      "1. First attempt: Test runs at maximum speed with tracing disabled.",
      "2. If the test passes: Zero disk storage or overhead used.",
      "3. If the test fails: Playwright launches the retry with full tracing enabled, producing a `trace.zip` artifact exclusively for the failed test.",
      "This gives you 100% diagnostic traces for real failures with 0% wasted storage on passing tests."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "// playwright.config.ts\nimport { defineConfig } from '@playwright/test';\n\nexport default defineConfig({\n  retries: process.env.CI ? 2 : 0,\n  use: {\n    // Captures trace exclusively when a test fails and retries:\n    trace: 'on-first-retry',\n  },\n});",
      "explanation": "Configuring conditional trace capture on first retry."
    },
    "proTip": "Use `trace: 'retain-on-failure'` if you run without retries locally but still want traces saved for any failed test.",
    "commonFollowUp": "What is the difference between 'on-first-retry' and 'retain-on-failure'?"
  },
  {
    "id": 153,
    "question": "How do you use page.pause() and the Playwright Inspector for interactive step-by-step test authoring?",
    "shortAnswer": "Add await page.pause() in your test code and run with npx playwright test --debug to pause execution and launch the live Inspector GUI.",
    "category": "Debugging & Tracing",
    "difficulty": "Beginner",
    "tags": [
      "page.pause",
      "Playwright Inspector",
      "Debug Mode",
      "Authoring"
    ],
    "detailedExplanation": [
      "Debugging tests by guessing selectors or adding `console.log()` is slow and frustrating.",
      "Adding `await page.pause()` suspends test execution at that line and launches the Playwright Inspector window.",
      "From the Inspector, you can:",
      "- Step over actions one by one (`F10`).",
      "- Resume execution (`F8`).",
      "- Use the Locator Picker: hover over any element in the live browser window to generate and copy the optimal accessible `getByRole` locator.",
      "- Edit and evaluate locators live in the console."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('interactive debugging session', async ({ page }) => {\n  await page.goto('/checkout');\n  await page.getByLabel('Promo Code').fill('DISCOUNT50');\n\n  // Pauses execution right before applying code:\n  await page.pause();\n\n  await page.getByRole('button', { name: 'Apply' }).click();\n  await expect(page.getByText('50% Off Applied')).toBeVisible();\n});",
      "explanation": "Freezing execution with page.pause() for live debugging and locator tuning."
    },
    "proTip": "Be sure to remove `await page.pause()` before pushing to CI—if a headless runner hits `page.pause()`, it will hang until the 30s timeout!",
    "commonFollowUp": "How does the Playwright VS Code extension streamline interactive debugging compared to the CLI inspector?"
  },
  {
    "id": 154,
    "question": "How do you monitor and assert against browser console errors and unhandled exceptions using page.on('console')?",
    "shortAnswer": "Attach page.on('console', msg => { if (msg.type() === 'error') ... }) to capture browser console.error calls and fail tests on unhandled JS errors.",
    "category": "Debugging & Tracing",
    "difficulty": "Intermediate",
    "tags": [
      "console.error",
      "page.on('console')",
      "Quality",
      "JavaScript Errors"
    ],
    "detailedExplanation": [
      "A UI test might pass because buttons and text are visible, while hidden React runtime errors or unhandled promise rejections are flooding the browser console.",
      "You can listen for browser console output using `page.on('console')`.",
      "Filter by message type (`error`, `warning`, `info`, `log`).",
      "Many engineering teams establish a rule: 'Zero console errors permitted in automated test runs' to catch frontend bugs before production."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('assert no browser console errors occur during navigation', async ({ page }) => {\n  const consoleErrors: string[] = [];\n  page.on('console', (msg) => {\n    if (msg.type() === 'error') {\n      consoleErrors.push(msg.text());\n    }\n  });\n\n  await page.goto('/dashboard');\n  await page.getByRole('button', { name: 'Load Analytics' }).click();\n\n  // Assert zero console errors occurred:\n  expect(consoleErrors).toEqual([]);\n});",
      "explanation": "Collecting and asserting against browser console errors."
    },
    "proTip": "Some third-party tracking scripts log harmless errors; filter out known third-party warnings with `if (!msg.text().includes('analytics'))`.",
    "commonFollowUp": "What is the difference between page.on('console') and page.on('pageerror')?"
  },
  {
    "id": 155,
    "question": "How do you monitor page crashes (page.on('crash')) and uncaught exceptions (page.on('pageerror'))?",
    "shortAnswer": "page.on('pageerror') listens for uncaught JavaScript exceptions in the DOM window. page.on('crash') listens for Out-Of-Memory browser renderer crashes.",
    "category": "Debugging & Tracing",
    "difficulty": "Advanced",
    "tags": [
      "pageerror",
      "crash",
      "Unhandled Exception",
      "OOM"
    ],
    "detailedExplanation": [
      "- `page.on('pageerror', error => ...)`: Fires when an unhandled top-level exception occurs inside the browser's window context (e.g. `Uncaught TypeError: Cannot read properties of undefined`).",
      "- `page.on('crash', page => ...)`: Fires when the browser rendering engine process crashes entirely (typically due to Out-Of-Memory, GPU driver failure, or infinite recursion).",
      "Monitoring `pageerror` ensures your tests fail proactively when frontend code throws uncaught exceptions, even if the UI appeared to render."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('fail test if uncaught window exception throws', async ({ page }) => {\n  let uncaughtError: Error | null = null;\n  page.on('pageerror', (err) => {\n    uncaughtError = err;\n  });\n\n  await page.goto('/complex-data-table');\n  expect(uncaughtError).toBeNull();\n});",
      "explanation": "Capturing uncaught window exceptions using page.on('pageerror')."
    },
    "proTip": "Use `page.on('crash')` to log diagnostic dumps if high-memory WebGL or Canvas applications intermittently crash Chromium.",
    "commonFollowUp": "How does Playwright recover when a worker experiences a browser process crash?"
  },
  {
    "id": 156,
    "question": "How do you record full-motion videos of test runs with video: 'retain-on-failure'?",
    "shortAnswer": "Set video: 'retain-on-failure' and size: { width, height } in playwright.config.ts to record WebM videos only when tests fail.",
    "category": "Debugging & Tracing",
    "difficulty": "Beginner",
    "tags": [
      "Video Recording",
      "retain-on-failure",
      "CI/CD",
      "Artifacts"
    ],
    "detailedExplanation": [
      "Watching a full-motion video of a test run makes it immediately obvious what went wrong (e.g. a unexpected popup modal covered the screen).",
      "Options in `playwright.config.ts`:",
      "- `'off'`: Do not record video.",
      "- `'on'`: Record video for every test.",
      "- `'retain-on-failure'`: Record video during test execution, but discard video files for passing tests. Save videos only for failed runs.",
      "- `'on-first-retry'`: Record video only when retrying a failed test.",
      "Saved as standard `.webm` files and embedded directly into HTML reports."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "// playwright.config.ts\nimport { defineConfig } from '@playwright/test';\n\nexport default defineConfig({\n  use: {\n    video: 'retain-on-failure',\n    viewport: { width: 1280, height: 720 },\n  },\n});",
      "explanation": "Configuring automated video recordings retained exclusively on failure."
    },
    "proTip": "Access the video file path programmatically inside a test using `await page.video()?.path()`.",
    "commonFollowUp": "How do you control the resolution and dimensions of recorded test videos?"
  },
  {
    "id": 157,
    "question": "What is the Page Object Model (POM) in Playwright and how does it compare to Component Object Models?",
    "shortAnswer": "POM encapsulates page locators and user interactions into reusable TypeScript classes. Component Object Models encapsulate modular sub-widgets (modals, navbars, tables).",
    "category": "Advanced Testing & Best Practices",
    "difficulty": "Intermediate",
    "tags": [
      "POM",
      "Page Object Model",
      "Design Patterns",
      "Clean Code"
    ],
    "detailedExplanation": [
      "Page Object Model (POM) is an industry-standard architectural pattern for test automation.",
      "Core principles:",
      "1. Encapsulation: Locators and low-level interactions are declared inside Page Object classes, NOT repeated across 50 test files.",
      "2. Readability: Tests read like user stories (`await loginPage.login('alice', 'password');`).",
      "3. Component Object Model (COM): Decompose large pages into reusable components (e.g. `NavBar`, `PaginationWidget`, `ConfirmModal`) that can be instantiated across multiple page classes.",
      "Playwright Locators are lazy, making them ideal class property members."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "// pages/LoginPage.ts\nimport { Page, Locator } from '@playwright/test';\n\nexport class LoginPage {\n  readonly page: Page;\n  readonly usernameInput: Locator;\n  readonly passwordInput: Locator;\n  readonly submitButton: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.usernameInput = page.getByLabel('Username');\n    this.passwordInput = page.getByLabel('Password');\n    this.submitButton = page.getByRole('button', { name: 'Log in' });\n  }\n\n  async goto() {\n    await this.page.goto('/login');\n  }\n\n  async login(user: string, pass: string) {\n    await this.usernameInput.fill(user);\n    await this.passwordInput.fill(pass);\n    await this.submitButton.click();\n  }\n}",
      "explanation": "Clean TypeScript Page Object Model using lazy Playwright Locators."
    },
    "proTip": "Never include assertions inside Page Object helper methods—keep assertions in the test files so failures are pinpointed accurately in test reports.",
    "commonFollowUp": "How do you combine Page Objects with Playwright custom fixtures for zero-boilerplate tests?"
  },
  {
    "id": 158,
    "question": "How do you measure Core Web Vitals (LCP, FID, CLS) and page performance timings in Playwright?",
    "shortAnswer": "Evaluate window.performance.timing or PerformanceObserver inside page.evaluate() to extract LCP, FCP, TTFB, and DOMContentLoaded metrics.",
    "category": "Advanced Testing & Best Practices",
    "difficulty": "Advanced",
    "tags": [
      "Web Vitals",
      "LCP",
      "Performance",
      "PerformanceObserver"
    ],
    "detailedExplanation": [
      "Automated tests can double as performance regression gates by asserting against Core Web Vitals:",
      "- Largest Contentful Paint (LCP): Perceived loading speed (< 2.5s).",
      "- First Input Delay / INP: Interactivity response.",
      "- Cumulative Layout Shift (CLS): Visual layout stability (< 0.1).",
      "Use `page.evaluate()` to query the browser's standard Performance APIs (`window.performance.getEntriesByType('navigation')`)."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\n\ntest('assert page load performance budget', async ({ page }) => {\n  await page.goto('https://example.com');\n\n  const timing = await page.evaluate(() => {\n    const [nav] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];\n    return {\n      ttfb: nav.responseStart - nav.requestStart,\n      domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,\n      loadComplete: nav.loadEventEnd - nav.startTime,\n    };\n  });\n\n  // Assert performance budgets:\n  expect(timing.ttfb).toBeLessThan(500); // TTFB under 500ms\n  expect(timing.domContentLoaded).toBeLessThan(2000); // DOM ready under 2s\n});",
      "explanation": "Measuring navigation timing metrics and enforcing performance budgets."
    },
    "proTip": "Run performance budget tests on fixed Chromium headless runners in Docker to eliminate machine-to-machine variability.",
    "commonFollowUp": "How can you capture Largest Contentful Paint (LCP) using a PerformanceObserver script?"
  },
  {
    "id": 159,
    "question": "How do you test accessibility (a11y) using @axe-core/playwright and assert zero WCAG violations?",
    "shortAnswer": "Install @axe-core/playwright, run new AxeBuilder({ page }).analyze(), and assert expect(results.violations).toEqual([]).",
    "category": "Advanced Testing & Best Practices",
    "difficulty": "Intermediate",
    "tags": [
      "Accessibility",
      "a11y",
      "axe-core",
      "WCAG"
    ],
    "detailedExplanation": [
      "Automating accessibility guarantees that your application complies with legal and ethical standards (WCAG 2.1 AA).",
      "`@axe-core/playwright` is the industry-standard axe accessibility engine from Deque.",
      "It tests for: color contrast ratios, missing form labels, invalid ARIA attributes, missing image alt text, and broken keyboard navigation.",
      "You can analyze the entire page or scope analysis to a specific component container."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "import { test, expect } from '@playwright/test';\nimport AxeBuilder from '@axe-core/playwright';\n\ntest('homepage must pass WCAG 2.1 AA accessibility audit', async ({ page }) => {\n  await page.goto('/');\n\n  // Run automated axe accessibility analysis:\n  const accessibilityScanResults = await new AxeBuilder({ page })\n    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])\n    .analyze();\n\n  expect(accessibilityScanResults.violations).toEqual([]);\n});",
      "explanation": "Running automated WCAG accessibility audits using @axe-core/playwright."
    },
    "proTip": "You can exclude known third-party widgets: `new AxeBuilder({ page }).exclude('.third-party-chat')`.",
    "commonFollowUp": "What percentage of total accessibility defects can automated tools like axe-core catch?"
  },
  {
    "id": 160,
    "question": "What are the Top 10 Anti-Patterns to avoid in Playwright automation?",
    "shortAnswer": "1. Hard sleeps (waitForTimeout), 2. CSS class selectors, 3. Manual page.$/$$ handles, 4. UI logins in every test, 5. Interdependent tests, 6. expect(await isVisible()).toBe(true), 7. networkidle overuse, 8. Asserting in Page Objects, 9. Missing relative baseURL paths, 10. Ignoring Traces.",
    "category": "Advanced Testing & Best Practices",
    "difficulty": "Advanced",
    "tags": [
      "Anti-Patterns",
      "Best Practices",
      "Architecture",
      "Stability"
    ],
    "detailedExplanation": [
      "To achieve an enterprise-grade test automation suite that runs reliably with zero false alarms, eliminate these 10 anti-patterns:",
      "1. Hard Sleeps: Never use `await page.waitForTimeout()`. Rely on auto-waiting and web-first assertions.",
      "2. Brittle Locators: Never select by implementation details (`.btn-primary.mt-4`). Use accessible roles (`getByRole`).",
      "3. Legacy Handles: Eliminate `page.$()` and `page.$$()`. Always use lazy `Locator` objects.",
      "4. UI Login in Every Test: Eliminate repeated UI logins; authenticate once with `storageState` and project dependencies.",
      "5. Shared Mutable State: Tests must be 100% atomic and self-contained; never rely on the execution order of other tests.",
      "6. Boolean Assertions: Replace `expect(await el.isVisible()).toBe(true)` with `await expect(el).toBeVisible()`.",
      "7. Overusing networkidle: Avoid `page.waitForLoadState('networkidle')`—it times out on apps with background polling.",
      "8. Assertions in Page Objects: Keep Page Objects focused purely on actions; keep assertions in test specs.",
      "9. Hardcoded Absolute URLs: Use relative paths (`page.goto('/cart')`) with configurable `baseURL`.",
      "10. Disabling Traces: Always configure `trace: 'on-first-retry'` on CI so every failure has actionable diagnostic recordings."
    ],
    "codeSnippet": {
      "language": "typescript",
      "code": "// The Golden Playwright Standard:\nimport { test, expect } from '@playwright/test';\n\ntest('atomic, resilient, user-aligned checkout test', async ({ page }) => {\n  // 1. Relative navigation using baseURL:\n  await page.goto('/products');\n\n  // 2. Semantic accessibility locator:\n  const buyButton = page.getByRole('button', { name: 'Buy Now' });\n\n  // 3. Built-in auto-waiting action:\n  await buyButton.click();\n\n  // 4. Auto-retrying web-first assertion:\n  await expect(page.getByRole('alert')).toHaveText(/Item added to cart/i);\n});",
      "explanation": "The Golden Standard Playwright test avoiding all common anti-patterns."
    },
    "proTip": "Share this Top 10 checklist with your engineering team as a code review guideline for all test automation pull requests.",
    "commonFollowUp": "How do you enforce these best practices across an engineering team using ESLint plugins?"
  }
];

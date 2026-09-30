export interface StudyCard {
  id: string;
  code: string;
  title: string;
  moduleCode: string;
  category: string;
  summary: string;
  deepDive: {
    problemStatement: string;
    architecturalSolution: string;
    keyCodeSnippet: string;
    bulletTakeaways: string[];
    antiPatterns: string[];
  };
}

export const STUDY_CARDS: StudyCard[] = [
  {
    id: 'sc-01',
    code: 'SC-01',
    moduleCode: 'M01',
    title: 'TypeScript Type Systems in Test Automation',
    category: 'Foundations & Language',
    summary: 'Why type-safe contracts, utility types (Pick, Omit, Partial), and generics prevent flaky test data bugs before runtime.',
    deepDive: {
      problemStatement: 'In JavaScript test frameworks, typos in payload keys (e.g. userEmail vs email) pass silently until the test crashes 40 seconds into execution on a missing DOM element.',
      architecturalSolution: 'Enforce strict TypeScript compiler flags (noImplicitAny, strictNullChecks). Model all Page Objects and API contracts with interfaces and branded types. Use Pick and Omit to derive test fixtures from backend models.',
      keyCodeSnippet: `// Type-safe payload derivation with compile-time verification
export interface OrderPayload {
  orderId: string;
  customerEmail: string;
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP';
  createdAt: string;
}

// Omit server-generated fields for POST request body
export type CreateOrderDTO = Omit<OrderPayload, 'orderId' | 'createdAt'>;`,
      bulletTakeaways: [
        'Interfaces define contracts for Page Objects and custom fixtures.',
        'Type aliases are ideal for union literals and mapped transformations.',
        'Generics enable fluent navigation patterns (e.g., this.navigate<DashboardPage>()).',
        'Zod integration bridges runtime JSON schemas with TypeScript static types.'
      ],
      antiPatterns: [
        'Overusing "any" across helper utilities, disabling compiler checks.',
        'Duplicating interfaces across test files instead of sharing a centralized types/ directory.'
      ]
    }
  },
  {
    id: 'sc-02',
    code: 'SC-02',
    moduleCode: 'M02',
    title: 'The Death of Thread.sleep()',
    category: 'Synchronization & Locators',
    summary: 'The technical mechanics of auto-waiting, the 5-point actionability pipeline, and why web-first assertions eliminate flake.',
    deepDive: {
      problemStatement: 'Hardcoded sleeps (page.waitForTimeout, Thread.sleep) are either too short (causing flaky crashes on busy CI workers) or too long (wasting thousands of engineering hours annually).',
      architecturalSolution: 'Playwright auto-waiting verifies 5 conditions (Attached, Visible, Stable, Receives Events, Enabled) before dispatching any action. Web-first assertions (expect(locator).toBeVisible()) poll with exponential backoff until the condition passes or timeout occurs.',
      keyCodeSnippet: `// ZERO SLEEPS: Playwright handles waiting natively
// 1. Automatically awaits visibility and stability before clicking
await page.getByRole('button', { name: 'Submit Purchase' }).click();

// 2. Web-first assertion polls DOM state up to 5000ms timeout
await expect(page.getByRole('alert')).toHaveText('Transaction Confirmed');`,
      bulletTakeaways: [
        'Playwright actionability checks run automatically before every click, fill, or check.',
        'Web-first assertions retry continuously; standard expect(boolean).toBeTruthy() evaluates once and fails.',
        'Use getByRole as priority #1 to query the browser accessibility tree.',
        'Isolate tests in lightweight BrowserContexts instead of relaunching browser processes.'
      ],
      antiPatterns: [
        'Adding page.waitForTimeout(3000) before clicking an element.',
        'Using { force: true } to bypass animation warnings instead of properly asserting container visibility.'
      ]
    }
  },
  {
    id: 'sc-03',
    code: 'SC-03',
    moduleCode: 'M03',
    title: 'Dependency Injection vs Global State',
    category: 'Framework Architecture',
    summary: 'Architecting parallel-safe test suites using Playwright Custom Fixtures (test.extend) instead of static singletons and fragile @Before hooks.',
    deepDive: {
      problemStatement: 'Traditional automation frameworks store browser instances and user sessions in static class variables. When running across 8 parallel worker threads, tests clobber each other state, causing untraceable flaky failures.',
      architecturalSolution: 'Playwright Custom Fixtures create an isolated directed acyclic graph (DAG) of dependencies per test. Setup runs before the test yields control via await use(resource), and teardown is guaranteed even if the test fails.',
      keyCodeSnippet: `// Parallel-safe dependency injection fixture
export const test = base.extend<{ adminPage: AdminDashboardPage }>({
  adminPage: async ({ page }, use) => {
    const admin = new AdminDashboardPage(page);
    await admin.loginWithRole('SuperAdmin');
    await use(admin); // Yields to test
    await admin.cleanupAuditLogs(); // Guaranteed teardown
  }
});`,
      bulletTakeaways: [
        'Fixtures only initialize when a test explicitly requests them in its parameter destructuring.',
        'Worker-scoped fixtures (scope: "worker") handle expensive tasks once per worker thread.',
        'Teardown logic in fixtures executes reliably even after uncaught test errors.',
        'Zero global mutable state enables true horizontal scalability.'
      ],
      antiPatterns: [
        'Declaring let variables at the top of test files shared across test cases.',
        'Putting business logic in global beforeEach hooks instead of modular composable fixtures.'
      ]
    }
  },
  {
    id: 'sc-04',
    code: 'SC-04',
    moduleCode: 'M04',
    title: 'Hybrid UI-API Test Design Patterns',
    category: 'Integration & CI/CD',
    summary: 'Accelerating test execution by 80% through APIRequestContext data seeding while preserving realistic browser assertions.',
    deepDive: {
      problemStatement: 'End-to-end tests that navigate 8 different forms to create preconditions (e.g. register user, search product, add to cart) take 45 seconds each and fail if any cosmetic UI change occurs.',
      architecturalSolution: 'Execute setup and teardown through direct backend HTTP requests using APIRequestContext. Use the browser only for the specific user journey under test, navigating directly to the pre-seeded URL.',
      keyCodeSnippet: `test('hybrid order return workflow', async ({ request, page }) => {
  // Fast backend seeding: 40ms
  const res = await request.post('/api/v1/orders/seed', { data: { status: 'DELIVERED' } });
  const { orderId } = await res.json();

  // Focused UI verification: Only what needs visual confirmation
  await page.goto(\`/orders/\${orderId}/returns\`);
  await page.getByRole('button', { name: 'Request Refund' }).click();
  await expect(page.getByText('Return Approved')).toBeVisible();
});`,
      bulletTakeaways: [
        'APIRequestContext shares cookie jars and auth tokens with browser contexts.',
        'Reduces test execution time from minutes to seconds.',
        'Pinpoints failures directly: if the API fails, the backend is down; if the UI fails, the layout is broken.',
        'Use page.route() to mock flaky third-party analytics, chat widgets, and ad trackers.'
      ],
      antiPatterns: [
        'Filling 20 input fields via UI to test a single button on page 5.',
        'Using manual database direct SQL queries instead of versioned REST/GraphQL APIs.'
      ]
    }
  },
  {
    id: 'sc-05',
    code: 'SC-05',
    moduleCode: 'M05',
    title: 'MCP in Modern Software Quality',
    category: 'AI & Next-Gen Testing',
    summary: 'Standardizing LLM integration with test runners via Model Context Protocol, accessibility tree heuristics, and strict safety guardrails.',
    deepDive: {
      problemStatement: 'Naive "AI testing" tools execute raw LLM-generated code directly in production environments or hallucinate locators that silently pass on incorrect elements, masking critical bugs.',
      architecturalSolution: 'Model Context Protocol (MCP) establishes a standardized, schema-validated communication channel between the test runner, browser accessibility tree, and LLM. Self-healing algorithms require minimum 85% confidence scores and pass through safety filters.',
      keyCodeSnippet: `// MCP Tool Definition for Playwright Element Inspection
export const inspectElementTool = {
  name: "inspect_accessible_element",
  description: "Queries the browser Accessibility Tree to find candidate elements matching user intent",
  parameters: {
    type: "object",
    properties: {
      role: { type: "string", description: "WCAG accessible role (button, link, heading)" },
      accessibleName: { type: "string", description: "Visible or aria-label text" }
    },
    required: ["role", "accessibleName"]
  }
};`,
      bulletTakeaways: [
        'MCP provides structured JSON schemas for AI tools instead of freeform code generation.',
        'Never execute raw model output without strict sandboxing and AST validation.',
        'Self-healing locators must require confidence scoring and explicit telemetry logging.',
        'Mask dynamic data (timestamps, ads) during visual regression with pixelmatch.'
      ],
      antiPatterns: [
        'Using page.evaluate(unvetted_ai_string) directly on live pages.',
        'Silently auto-fixing broken selectors in git without human engineer review.'
      ]
    }
  },
  {
    id: 'sc-06',
    code: 'SC-06',
    moduleCode: 'M06',
    title: 'Risk-Based Quality Engineering',
    category: 'Agile & Process',
    summary: 'Prioritizing automation investment using risk scoring (Impact x Probability), JIRA traceability, and Shift-Left quality gates.',
    deepDive: {
      problemStatement: 'Attempting 100% UI end-to-end automation leads to sluggish CI pipelines, high maintenance burdens, and delayed release cycles.',
      architecturalSolution: 'Score features using Risk = Business Impact (1-5) * Failure Probability (1-5). Reserve full-browser UI tests for Tier-1 risks (score 15-25); push Tier-2 and Tier-3 down to API and unit tests.',
      keyCodeSnippet: `// Playwright test metadata linking tests to JIRA requirements and risk tier
test('checkout order placement @tier-1 @p0', {
  annotation: [
    { type: 'risk-score', description: '25' },
    { type: 'jira-story', description: 'PAY-8921' },
    { type: 'owner', description: 'checkout-sdet-team' }
  ]
}, async ({ page }) => {
  // High-impact revenue critical test
});`,
      bulletTakeaways: [
        'Shift-Left: Refine acceptance criteria during sprint grooming before coding begins.',
        'Automate smoke tests on every PR; run full regression suites on nightly schedules.',
        'Use JQL filters to correlate automated test passes with Jira user story sign-offs.',
        'Enforce zero-flake blocking gates in main branch protection rules.'
      ],
      antiPatterns: [
        'Treating a cosmetic header test with the same CI priority as payment processing.',
        'Manually testing repetitive regression paths every sprint instead of automating them.'
      ]
    }
  },
  {
    id: 'sc-07',
    code: 'SC-07',
    moduleCode: 'M07',
    title: 'Senior Test Automation Architect Interview Questions',
    category: 'Interview & Leadership',
    summary: 'System design for 5,000+ tests, parallel matrix sharding, distributed cloud grids, and the STAR behavioral framework.',
    deepDive: {
      problemStatement: 'Senior SDET candidates frequently fail system design rounds because they focus on coding individual tests rather than architecting infrastructure capable of scaling to 10,000+ tests.',
      architecturalSolution: 'Architect distributed grids with Playwright matrix sharding (--shard=x/y), spot container orchestration, blob report aggregation, and quantifiable ROI metrics (developer build time saved, defect escape rate reduction).',
      keyCodeSnippet: `# GitHub Actions 10-Shard Parallel Matrix
strategy:
  fail-fast: false
  matrix:
    shard: [1/10, 2/10, 3/10, 4/10, 5/10, 6/10, 7/10, 8/10, 9/10, 10/10]
steps:
  - run: npx playwright test --shard=\${{ matrix.shard }} --reporter=blob`,
      bulletTakeaways: [
        'Structure behavioral answers with STAR: Situation, Task, Action, Result.',
        'Cap CI test suite wall-clock execution time at under 10 minutes using sharding.',
        'Isolate flaky tests immediately with quarantine tags to preserve developer velocity.',
        'Communicate automation value in terms of engineering hours and business revenue saved.'
      ],
      antiPatterns: [
        'Explaining how you wrote a single click() script in an architect-level interview.',
        'Ignoring infrastructure costs, container memory limits, and backend database bottlenecks.'
      ]
    }
  }
];

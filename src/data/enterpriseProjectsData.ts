export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
}

export interface EnterpriseProject {
  id: string;
  code: string;
  title: string;
  type: 'Mini-Project' | 'Capstone';
  duration: string;
  difficulty: 'Intermediate' | 'Advanced' | 'Enterprise' | 'Architect';
  businessScenario: string;
  architectureRequirements: string[];
  tasks: ProjectTask[];
  evaluationRubric: {
    criteria: string;
    weight: string;
    description: string;
  }[];
  starterFiles: {
    filename: string;
    code: string;
  }[];
}

export const ENTERPRISE_PROJECTS: EnterpriseProject[] = [
  {
    id: 'proj-01',
    code: 'EP-01',
    title: 'TypeScript Environment Configuration CLI',
    type: 'Mini-Project',
    duration: '6 hours',
    difficulty: 'Intermediate',
    businessScenario: 'A multi-brand enterprise automation platform runs tests across 4 regions (US, EU, APAC, LATAM) with dev, staging, and prod tiers. Hardcoding URLs or relying on unvalidated environment variables causes tests to silently execute against the wrong backend.',
    architectureRequirements: [
      'Parse command line arguments via commander or yargs with strict type checking.',
      'Validate configuration payloads using Zod schemas at startup.',
      'Inject validated environment variables into Playwright testConfig with zero runtime drift.',
      'Provide clear terminal diagnostic error output when required env vars are missing.'
    ],
    tasks: [
      {
        id: 't-01',
        title: 'Define Zod Environment Schema',
        description: 'Create an environment schema enforcing valid URLs, API keys, and supported region enums.',
        acceptanceCriteria: [
          'Throws readable error when BASE_URL is not a valid HTTPS URL',
          'Enforces region to be one of ["us-east", "eu-west", "apac-south"]',
          'Sets default timeout to 30000ms if not explicitly provided'
        ]
      },
      {
        id: 't-02',
        title: 'Build CLI Runner Script',
        description: 'Implement bin/test-runner.ts that loads the target environment and executes playwright test.',
        acceptanceCriteria: [
          'Supports flags: --env=staging --region=eu-west --tags=@smoke',
          'Exits with code 1 if configuration validation fails before launching Playwright'
        ]
      }
    ],
    evaluationRubric: [
      { criteria: 'Type Safety & Schema Validation', weight: '35%', description: 'Zod schemas catch malformed URLs and invalid region flags before runtime.' },
      { criteria: 'CLI Ergonomics', weight: '35%', description: 'Intuitive flags, helpful error messages, and seamless environment switching.' },
      { criteria: 'Code Cleanliness & Structure', weight: '30%', description: 'Modular file separation, strict tsconfig, and no any types.' }
    ],
    starterFiles: [
      {
        filename: 'src/config/env.schema.ts',
        code: `import { z } from 'zod';

export const EnvSchema = z.object({
  BASE_URL: z.string().url(),
  API_KEY: z.string().min(10),
  REGION: z.enum(['us-east', 'eu-west', 'apac-south']).default('us-east'),
  TIMEOUT: z.coerce.number().default(30000),
  WORKERS: z.coerce.number().default(4),
});

export type ValidatedEnv = z.infer<typeof EnvSchema>;`
      }
    ]
  },
  {
    id: 'proj-02',
    code: 'EP-02',
    title: 'Dynamic E-Commerce Multi-Tab Checkout Suite',
    type: 'Mini-Project',
    duration: '10 hours',
    difficulty: 'Advanced',
    businessScenario: 'Automate a complex omnichannel shopping experience: search catalog, handle dynamic promo popups, traverse third-party PCI payment iframes, handle external banking OAuth popups, and verify order receipts.',
    architectureRequirements: [
      'Strict Page Object Model with Component composition (Header, CartDrawer, StripeFrame).',
      'Zero arbitrary page.waitForTimeout() calls; reliance entirely on Web-First Locators.',
      'Multi-window and popup event synchronization using Promise.all.',
      'Graceful handling of asynchronous marketing popups using Playwright page.addLocatorHandler().'
    ],
    tasks: [
      {
        id: 't-03',
        title: 'Automate Stripe PCI Iframe Interaction',
        description: 'Interact with credit card inputs embedded inside Stripe cross-origin iframes using frameLocator.',
        acceptanceCriteria: [
          'Inputs card number, expiration, and CVC inside iframe',
          'Asserts 3D Secure bank authorization popup window and approves transaction',
          'Verifies order confirmation number appears in top-level document'
        ]
      }
    ],
    evaluationRubric: [
      { criteria: 'Locator Strategy & Resilience', weight: '40%', description: '100% accessible role and label queries; zero brittle CSS classes.' },
      { criteria: 'Iframe & Popup Stability', weight: '35%', description: 'Proper Promise.all event handling and frameLocator usage.' },
      { criteria: 'Framework Abstraction', weight: '25%', description: 'Clean Page Component boundaries without leaky locator abstractions.' }
    ],
    starterFiles: [
      {
        filename: 'pages/CheckoutPage.ts',
        code: `import { Page, Locator, FrameLocator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly stripeFrame: FrameLocator;
  readonly payBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.stripeFrame = page.frameLocator('iframe[name="__privateStripeFrame"]');
    this.payBtn = page.getByRole('button', { name: /complete order/i });
  }

  async enterPaymentDetails(card: string, exp: string, cvc: string) {
    await this.stripeFrame.getByLabel('Card number').fill(card);
    await this.stripeFrame.getByLabel('Expires').fill(exp);
    await this.stripeFrame.getByLabel('CVC').fill(cvc);
  }
}`
      }
    ]
  },
  {
    id: 'proj-03',
    code: 'EP-03',
    title: 'Dockerized CI/CD Matrix Pipeline with Sharding',
    type: 'Mini-Project',
    duration: '8 hours',
    difficulty: 'Advanced',
    businessScenario: 'Build an enterprise GitHub Actions CI workflow that checks out code, runs linting, executes Playwright across 4 parallel runner shards, captures traces on failure, and merges blob reports into a single artifact.',
    architectureRequirements: [
      'Multi-stage Dockerfile or official Playwright Jammy container image.',
      'GitHub Actions matrix strategy with shard: 1/4, 2/4, 3/4, 4/4.',
      'Blob reporter configuration with automatic report merging step.',
      'GitHub Pages automated publishing of the combined HTML report.'
    ],
    tasks: [
      {
        id: 't-04',
        title: 'Author Matrix Sharding Workflow',
        description: 'Define .github/workflows/e2e.yml with parallel shards and report aggregation.',
        acceptanceCriteria: [
          'Runs tests in 4 parallel jobs with independent blob artifacts',
          'Aggregates reports into single HTML dashboard even if tests fail',
          'Saves traces for any failing test executions'
        ]
      }
    ],
    evaluationRubric: [
      { criteria: 'CI Optimization & Parallelism', weight: '40%', description: 'Clean matrix sharding with 4x execution time reduction.' },
      { criteria: 'Failure Diagnostics & Traceability', weight: '35%', description: 'Traces captured only on failure, preventing bloated artifacts.' },
      { criteria: 'Pipeline Security & Hygiene', weight: '25%', description: 'Pinned actions, npm ci caching, and secure secrets handling.' }
    ],
    starterFiles: [
      {
        filename: '.github/workflows/matrix-e2e.yml',
        code: `name: Enterprise Sharded Matrix
on: [push, pull_request]
jobs:
  test-shards:
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - run: npx playwright test --shard=\${{ matrix.shardIndex }}/\${{ matrix.shardTotal }} --reporter=blob
      - uses: actions/upload-artifact@v4
        with:
          name: blob-report-\${{ matrix.shardIndex }}
          path: blob-report`
      }
    ]
  },
  {
    id: 'proj-capstone',
    code: 'CAPSTONE',
    title: 'Enterprise Quality Engineering Platform',
    type: 'Capstone',
    duration: '25 hours',
    difficulty: 'Architect',
    businessScenario: 'You are the Lead SDET / Automation Architect at a high-growth fintech enterprise. You must design and implement the company-wide Playwright automation platform from the ground up: strict TypeScript architecture, custom fixtures with dependency injection, hybrid API data seeding, Dockerized parallel CI/CD, AI-assisted self-healing locators, and automated failure reporting.',
    architectureRequirements: [
      'Complete Page Component Model (Navigation, DataGrid, Modals, Forms).',
      'Worker-scoped and test-scoped custom fixtures (test.extend) with isolated sessions.',
      'APIRequestContext integration for instantaneous test user generation and state priming.',
      'Self-healing locator module leveraging accessibility tree heuristics and safety thresholds.',
      'Visual regression testing with pixelmatch and masked dynamic timestamps.',
      'Multi-browser testing (Chromium, Firefox, WebKit, Mobile Safari).',
      'GitHub Actions sharded execution matrix with merged HTML reports.',
      'Full documentation: README, Architecture Decision Records (ADR), and developer guidelines.'
    ],
    tasks: [
      {
        id: 'cap-01',
        title: 'Core Framework & Custom Fixtures Architecture',
        description: 'Implement base.extend fixtures providing authenticated pages, API clients, and mock servers.',
        acceptanceCriteria: [
          'Worker fixtures perform one-time auth and write storageState JSON',
          'Test fixtures inject typed Page Objects with zero boilerplate',
          'Clean teardown removes seeded database records'
        ]
      },
      {
        id: 'cap-02',
        title: 'Hybrid UI + API Testing Suite',
        description: 'Author 20+ automated tests covering account creation, fund transfers, and ledger reporting.',
        acceptanceCriteria: [
          'Preconditions seeded via API in <50ms',
          'Critical assertions executed via UI using accessible role locators',
          'Zero sleep() calls with 100% pass rate in headless CI'
        ]
      },
      {
        id: 'cap-03',
        title: 'AI Self-Healing & Visual Testing Integration',
        description: 'Integrate dynamic selector recovery heuristic and baseline visual comparisons.',
        acceptanceCriteria: [
          'Recovers from renamed CSS selectors using getByRole fallback',
          'Visual tests mask dynamic account balances and clocks',
          'Emits structured failure telemetry and confidence metrics'
        ]
      },
      {
        id: 'cap-04',
        title: 'Dockerized CI/CD & Sharded Pipeline',
        description: 'Deploy GitHub Actions matrix running 4 parallel workers with merged Allure/HTML reports.',
        acceptanceCriteria: [
          'Total suite execution under 5 minutes',
          'Artifacts uploaded and published to GitHub Pages',
          'Branch protection rule enforces green status before merge'
        ]
      }
    ],
    evaluationRubric: [
      { criteria: 'Architecture & Design Patterns', weight: '25%', description: 'Modular Page Components, custom fixtures, zero global state, strict TypeScript.' },
      { criteria: 'Test Reliability & Zero Flake', weight: '25%', description: 'Web-first locators, auto-waiting assertions, no hardcoded sleeps.' },
      { criteria: 'CI/CD & Infrastructure Scalability', weight: '20%', description: 'Parallel sharding, Docker containerization, merged reporting.' },
      { criteria: 'Hybrid API & AI Safety Integration', weight: '15%', description: 'Fast API data seeding, verified AI self-healing with strict safety boundaries.' },
      { criteria: 'Engineering Documentation & ADRs', weight: '15%', description: 'Comprehensive README, architecture diagrams, and runbooks.' }
    ],
    starterFiles: [
      {
        filename: 'playwright.config.ts',
        code: `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'reports/results.json' }],
    ['list']
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://fintech.enterprise.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 14'] } },
  ],
});`
      }
    ]
  }
];

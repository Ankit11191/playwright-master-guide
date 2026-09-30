export interface InterviewQuestion {
  id: string;
  type: 'Technical' | 'Framework Design' | 'System Design' | 'Debugging' | 'Behavioral';
  question: string;
  scenario?: string;
  keyEvaluationPoints: string[];
  sampleStarAnswer?: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  sampleTechnicalAnswer?: string;
}

export interface InterviewTrack {
  id: string;
  title: string;
  level: string;
  targetRole: string;
  estimatedTime: string;
  description: string;
  questions: InterviewQuestion[];
}

export const INTERVIEW_TRACKS: InterviewTrack[] = [
  {
    id: 'track-sdet',
    title: 'SDET / Automation Engineer',
    level: 'Mid-Level',
    targetRole: 'Software Development Engineer in Test (SDET)',
    estimatedTime: '45 mins',
    description: 'Comprehensive assessment of core Playwright, Web-First Locators, async/await handling, API testing, and Page Object Model design.',
    questions: [
      {
        id: 'q-sdet-01',
        type: 'Technical',
        question: 'Why does Playwright recommend getByRole over CSS selectors or XPath, and how does it query elements internally?',
        keyEvaluationPoints: [
          'Understands the Accessibility Tree and ARIA roles (button, textbox, link, dialog)',
          'Explains how getByRole aligns test queries with user accessibility perception',
          'Identifies how getByRole avoids breakage during HTML tag or CSS class refactoring'
        ],
        sampleTechnicalAnswer: 'Playwright getByRole queries elements through the browser Accessibility (A11y) Tree rather than parsing DOM strings. This mimics how assistive tech and real human users locate controls. When designers change a button class or convert a <div> into a styled <button>, getByRole("button", { name: "Save" }) remains completely unaffected, whereas CSS or XPath break immediately.'
      },
      {
        id: 'q-sdet-02',
        type: 'Debugging',
        question: 'A test interacting with a dropdown menu works locally in headed mode but consistently fails in headless CI with "element is not visible". How do you diagnose and fix it?',
        keyEvaluationPoints: [
          'Checks viewport resolution difference between local browser and CI headless default (1280x720)',
          'Verifies whether responsive layout collapses the menu into a hamburger on smaller viewports',
          'Inspects Playwright Trace Viewer for action logs, screencast, and DOM snapshots'
        ],
        sampleTechnicalAnswer: 'I download the Playwright Trace artifact from the CI run and open it in Trace Viewer (npx playwright show-trace trace.zip). First, I check the screencast: in CI, default viewport resolution is 1280x720, which frequently triggers mobile responsive CSS rules, collapsing the desktop menu into a hamburger icon. I resolve this by configuring explicit viewport size in playwright.config.ts or asserting the hamburger menu trigger first.'
      },
      {
        id: 'q-sdet-03',
        type: 'Behavioral',
        question: 'Tell me about a time you identified a high-risk production bug through automated testing that manual testing missed.',
        keyEvaluationPoints: [
          'Structured using the STAR framework (Situation, Task, Action, Result)',
          'Demonstrates technical initiative and business risk understanding',
          'Quantifies impact (e.g. prevented customer downtime, saved revenue)'
        ],
        sampleStarAnswer: {
          situation: 'During a major billing system migration, our team needed to verify that thousands of recurring subscription renewals would charge accurately across foreign currencies.',
          task: 'I was responsible for designing automated regression validation covering edge-case currency exchange rounding and webhook receipt timing.',
          action: 'I built a hybrid API-UI Playwright test suite that seeded test orders across 15 currency pairs via APIRequestContext and verified micro-cent rounding in the ledger UI. I mocked network latency using page.route() to test race conditions in transaction settlement.',
          result: 'The automated suite flagged a silent truncation defect where Japanese Yen transactions lost decimal precision, saving an estimated $45,000 in potential monthly billing leakage before release.'
        }
      }
    ]
  },
  {
    id: 'track-senior',
    title: 'Senior SDET / Automation Lead',
    level: 'Senior',
    targetRole: 'Senior SDET / QA Automation Lead',
    estimatedTime: '60 mins',
    description: 'Advanced testing patterns, custom fixtures, dependency injection, CI/CD pipeline optimization, flake quarantine, and mentoring engineers.',
    questions: [
      {
        id: 'q-sr-01',
        type: 'Framework Design',
        question: 'How do you design a Playwright test framework using Custom Fixtures (test.extend) to eliminate repeated UI login across 500 tests?',
        keyEvaluationPoints: [
          'Explains Playwright storageState JSON mechanism for session re-use',
          'Uses worker-scoped setup fixture to authenticate once per worker thread',
          'Demonstrates understanding of parallel-safe dependency injection without static variables'
        ],
        sampleTechnicalAnswer: 'I implement Playwright global authentication via a setup project in playwright.config.ts or a worker-scoped fixture. Before running tests, a setup script logs in once through API or UI and saves cookies/localStorage to storageState.json. Test projects define dependencies: ["setup"] and reference storageState: "playwright/.auth/user.json". Individual test fixtures (test.extend) consume this state automatically, eliminating 500 redundant login forms and shaving 25+ minutes off the CI run.'
      },
      {
        id: 'q-sr-02',
        type: 'System Design',
        question: 'Your regression suite of 3,000 Playwright tests takes 2.5 hours in CI and frequently fails with transient network timeouts. How do you re-architect it?',
        keyEvaluationPoints: [
          'Sharding tests across GitHub Actions matrix or Docker containers (--shard=x/y)',
          'Converting UI preconditions to API seed calls (Hybrid UI/API approach)',
          'Isolating and quarantining flaky tests; tracking flakiness metrics',
          'Optimizing browser assets (disabling images/fonts for non-visual tests via page.route)'
        ],
        sampleTechnicalAnswer: 'I apply a 4-pillar architectural refactor: 1) Matrix Sharding: Distribute the 3,000 tests across 15 parallel GitHub Actions workers (--shard=1/15 to 15/15), reducing wall-clock runtime from 150 mins to ~10 mins. 2) Hybrid Preconditions: Replace UI-based user registration with APIRequestContext setup calls. 3) Resource Blocking: Intercept third-party trackers (Google Analytics, Hotjar) using page.route to stop network noise. 4) Flake Quarantine: Implement a quarantine tag (@quarantined) to prevent non-deterministic tests from blocking PRs while engineering investigates.'
      },
      {
        id: 'q-sr-03',
        type: 'Behavioral',
        question: 'How do you handle pushback from development teams when automated quality gates block an urgent production release?',
        keyEvaluationPoints: [
          'Objective risk assessment vs emotional debate',
          'Presenting data: failure logs, reproduction steps, business impact',
          'Offering constructive release paths (hotfix cherry-pick, feature flag isolation)'
        ],
        sampleStarAnswer: {
          situation: 'On the eve of Black Friday, an urgent marketing hotfix was blocked by our CI quality gate because 3 checkout automation tests failed.',
          task: 'Engineering management wanted to override the gate and deploy immediately to meet executive deadlines.',
          action: 'Rather than simply saying no, I pulled the Playwright failure trace in 5 minutes, recorded a 20-second screencast showing that clicking the new banner obscured the checkout CTA on Safari, and calculated the immediate revenue risk. I proposed isolating the banner behind a feature flag so the release could proceed without touching checkout.',
          result: 'The hotfix deployed safely without blocking marketing, and zero checkout regressions occurred during our peak traffic weekend.'
        }
      }
    ]
  },
  {
    id: 'track-architect',
    title: 'Automation Architect & Principal SDET',
    level: 'Architect',
    targetRole: 'Test Automation Architect / Director of Quality',
    estimatedTime: '75 mins',
    description: 'Enterprise quality engineering vision, cloud-native execution grids for 10,000+ tests, AI testing & MCP integration, self-healing governance, and organizational quality metrics.',
    questions: [
      {
        id: 'q-arch-01',
        type: 'System Design',
        question: 'Design an end-to-end, multi-region Cloud Native Test Grid capable of running 10,000 Playwright tests across multiple browsers in under 12 minutes.',
        keyEvaluationPoints: [
          'Dynamic ephemeral runner provisioning on AWS ECS / Kubernetes / GitHub Actions',
          'Blob report distribution and central aggregation with S3 and CloudFront',
          'Database state isolation with ephemeral tenant databases or isolated schemas',
          'Cost optimization using Spot instances and pre-warmed container images'
        ],
        sampleTechnicalAnswer: 'Architecture: 1) Orchestration: AWS ECS Fargate or Kubernetes cluster with Karpenter autoscaler spinning up 40 ephemeral spot containers with pre-cached Playwright Jammy images. 2) Sharding: Playwright native sharding (--shard=1/40). 3) Test Data: Microservice ephemeral schemas spun up via Testcontainers or pre-seeded API tenants. 4) Reporting: Each worker outputs a compressed blob report to Amazon S3. A final aggregator job runs npx playwright merge-reports and publishes an interactive Allure dashboard with historical flakiness analytics.'
      },
      {
        id: 'q-arch-02',
        type: 'Technical',
        question: 'How would you evaluate and integrate Model Context Protocol (MCP) and Generative AI into an enterprise testing organization while ensuring safety and deterministic repeatability?',
        keyEvaluationPoints: [
          'Understands MCP architecture (client, server, tools, resources)',
          'Clear safety boundaries: no unvetted arbitrary code execution, token sanitization',
          'Distinguishes between exploratory testing assistance vs deterministic CI gates',
          'Metrics: tracks hallucination rate, self-healing accuracy, and engineering hours saved'
        ],
        sampleTechnicalAnswer: 'I implement MCP as an assistive developer tool rather than an unconstrained CI actor. We deploy an MCP server exposing Playwright inspection tools (read_accessibility_tree, inspect_network_traffic, propose_selector). When a locator fails in development, the AI assistant proposes semantic alternatives with confidence scores and reasoning. In CI, self-healing is strictly bounded: candidates must achieve >85% confidence, adhere to WCAG roles, and be logged for mandatory human approval before git commit. Secrets and PII are scrubbed via AST parsers before touching any model prompt.'
      }
    ]
  }
];

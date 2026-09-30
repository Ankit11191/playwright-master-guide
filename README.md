# Playwright AI Testing Academy 🚀
### Master Education Platform: Learn. Build. Automate. Debug. Architect.

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-indigo?style=for-the-badge&logo=github)](https://ankit11191.github.io/playwright-master-guide/)
[![Languages](https://img.shields.io/badge/Languages-Java%20%7C%20Python%20%7C%20JavaScript%20%7C%20TypeScript-amber?style=for-the-badge)](https://ankit11191.github.io/playwright-master-guide/)
[![Playwright](https://img.shields.io/badge/Playwright-v1.49+-green?style=for-the-badge&logo=playwright)](https://playwright.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-blue?style=for-the-badge)](https://ankit11191.github.io/playwright-master-guide/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

A production-quality, practice-first, interactive learning management and engineering academy that teaches the complete **Professional Institute Master Curriculum: Playwright with AI Testing & Next-Gen Automation**.

Unlike static course websites or passive video playlists, this academy is a **hands-on developer platform** where learners write executable code, diagnose production flakes, simulate Model Context Protocol (MCP) AI test agents, explore enterprise architectural designs, and prepare for SDET and automation architect technical interviews.

---

## 🌐 Live Application
- **Live URL**: [https://ankit11191.github.io/playwright-master-guide/](https://ankit11191.github.io/playwright-master-guide/)
- **Repository**: [https://github.com/Ankit11191/playwright-master-guide](https://github.com/Ankit11191/playwright-master-guide)
- **Author**: [Ankit Mittal](https://www.linkedin.com/in/ankitmittal061091/)

---

## 🎯 Product Vision & Core Philosophy

The primary mission is to transform a learner from beginner or intermediate test automation knowledge into an **enterprise-ready Playwright, CI/CD, API testing, AI testing, and automation architecture professional**.

### The Learning Philosophy:
- **Practice Before Memorization**: Over 70% of learner time is spent writing code, diagnosing flakes, and solving realistic engineering challenges rather than reading static prose.
- **Learn Concepts Through Real-World Problems**: Every concept is anchored to a real production need (e.g. eliminating race conditions, preventing worker state leaks, or accelerating CI runtimes).
- **Executable Minimal Working Examples**: Every major concept includes working, production-grade code.
- **Debugging as a First-Class Skill**: Diagnosing broken automation, deciphering stack traces, and preventing regression flakes is taught with equal importance to authoring tests.
- **Multi-Language Flexibility**: Learn Playwright in your team's preferred stack—**Java (Default)**, **Python**, **JavaScript**, or **TypeScript**—with synchronized roadmaps and instant code switching.

### Practice-to-Theory Ratio:
| Category | Ratio | Description |
|---|---|---|
| **Hands-On Coding & Labs** | **50%** | In-browser exercises, diagnostic repair challenges, and MCP simulator. |
| **Enterprise Projects & Capstones** | **20%** | Real-world CLI utilities, e-commerce suites, CI sharding, and AI self-healing. |
| **Architectural Theory & Rationale** | **30%** | Deep-dive concepts, CDP engine internals, design patterns, and interview system design. |

---

## 🌟 Multi-Language Learning Tracks

Students enter the academy with varied technical backgrounds. The platform features an **entry criteria onboarding modal** that configures the entire course for the student's primary language:

### Supported Languages:
1. **☕ Java (⭐ Default Preference)**:
   - Runner: **JUnit 5 / TestNG**
   - Assertion Library: `PlaywrightAssertions.assertThat(locator)`
   - Build Tools: **Maven (`pom.xml`) / Gradle**
   - Highlights: Thread-safe `BrowserContext` execution, `ThreadLocal` state isolation, Page Object Models with Java OOP, Jackson API mapping.
2. **🐍 Python**:
   - Runner: **pytest-playwright**
   - Assertion Library: `expect(locator)`
   - Build Tools: **pip / poetry / pyproject.toml**
   - Highlights: `pytest` fixtures, `conftest.py` dependency injection, snake_case APIs, sync & async execution modes.
3. **🟨 JavaScript**:
   - Runner: **@playwright/test**
   - Assertion Library: `expect(locator)`
   - Build Tools: **npm / yarn / Node.js**
   - Highlights: Node.js ES6/CommonJS, async/await microtasks, zero-transpilation rapid prototyping.
4. **🔷 TypeScript**:
   - Runner: **@playwright/test with Strict TS**
   - Assertion Library: `expect(locator)`
   - Build Tools: **npm / pnpm / tsc**
   - Highlights: Strict typing, interface contracts, custom generic fixtures (`test.extend<T>()`), compile-time safety.

> **Zero Progress Loss Guarantee**: Switching your language at any time via the top header pill (`[ ☕ Java ▾ ]`) preserves 100% of your completed lessons, practice scores, streak days, and XP while dynamically updating all code examples, file names, and runner feedback.

---

## 🗺️ Complete 7-Module Curriculum Roadmap

```
M01: Ecosystem Setup ──► M02: Core Fundamentals ──► M03: Advanced Architecture
                                                            │
M06: CI/CD & Cloud Grids ◄── M05: AI Testing & MCP ◄── M04: API & Network Mocking
        │
        ▼
M07: Observability & Capstone ──► Verified Master Certificate 🎓
```

### Module M01: Foundations & Modern Ecosystem Setup
- **Duration**: 1 week / 10 hours · **Level**: Foundation
- **Topics**: Playwright Driver Architecture, JSON-RPC & Chrome DevTools Protocol (CDP) WebSocket communication, Thread models, Dependency pinning (Maven pom.xml, pip, npm), Factory patterns, Git feature branch hygiene, and Conventional Commits.
- **Architecture Lab**: Build an enterprise-grade strict multi-language test workspace with path aliases, linting, and environment config management.
- **Practice Project**: Environment configuration loader CLI that validates test options at compile time.
- **Study Card**: *Type Systems & OOP in Test Automation (SC-01)*.

### Module M02: Playwright Core Fundamentals & Test Engineering
- **Duration**: 2 weeks / 20 hours · **Level**: Intermediate
- **Topics**: Browser, BrowserContext & Page hierarchy, Multi-tab & popup synchronization, Web-first accessible locators (`getByRole`, `getByLabel`, `getByTestId`), Shadow DOM & nested iframe penetration, Auto-waiting actionability checks, and Web-first assertions.
- **Architecture Lab**: Zero-flake browser matrix supporting Chromium, Firefox, WebKit, and mobile device emulation.
- **Study Card**: *The Death of Thread.sleep() - Auto-Waiting Mechanics (SC-02)*.

### Module M03: Advanced Automation Architecture & Design Patterns
- **Duration**: 2 weeks / 20 hours · **Level**: Advanced
- **Topics**: Component-Based Page Object Model (POM), Composition over inheritance, Custom fixtures with `test.extend` (TypeScript/JS) and `@pytest.fixture` (Python) and Base Test extensions (Java), Automatic storage state injection for instantaneous login, Soft assertions, and Custom matchers.
- **Architecture Lab**: Enterprise framework template with dependency injection, parallel worker isolation, and environment configuration.
- **Study Card**: *Dependency Injection & Fixtures vs. Global Static State (SC-03)*.

### Module M04: API Testing, Mocking & Network Orchestration
- **Duration**: 1.5 weeks / 15 hours · **Level**: Advanced
- **Topics**: `APIRequestContext`, Hybrid UI/API testing (fast backend seeding in ~25ms), Network route interception (`page.route`), HAR recording & deterministic playback, WebSockets, Server-Sent Events (SSE), and GraphQL mocking.
- **Architecture Lab**: Hybrid test data seeding matrix combining direct REST payloads with selective UI assertions.
- **Study Card**: *Hybrid UI-API Testing & Network Mocking Architecture (SC-04)*.

### Module M05: AI-Driven Testing, Self-Healing & Model Context Protocol (MCP)
- **Duration**: 2 weeks / 20 hours · **Level**: Enterprise
- **Topics**: Model Context Protocol (MCP) server architecture, Exposing the live accessibility tree and DOM snapshots to LLMs, Autonomous test agent workflows, Algorithmic self-healing locator engines with confidence scoring, AI prompt engineering for QA, and AI safety boundaries.
- **Architecture Lab**: Interactive Model Context Protocol simulator and autonomous healing recovery engine.
- **Study Card**: *Model Context Protocol (MCP) & Self-Healing Locators (SC-05)*.

### Module M06: CI/CD, Containerization, Distributed Execution & Cloud Grids
- **Duration**: 1.5 weeks / 15 hours · **Level**: Enterprise
- **Topics**: Official Playwright Docker images, GitHub Actions enterprise pipelines, Matrix sharding across N parallel runners (`--shard=x/y`), Dynamic worker allocation based on CPU/RAM, Flake retry strategies, and Automated PR status checks.
- **Architecture Lab**: Distributed cloud grid architecture orchestrating 5,000+ tests across parallel cloud containers.
- **Study Card**: *CI/CD Sharding, Docker Isolation & Parallel Workers (SC-06)*.

### Module M07: Performance, Accessibility, Security & Quality Observability
- **Duration**: 1 week / 10 hours · **Level**: Architect
- **Topics**: Core Web Vitals (LCP, CLS, FID) capture, Automated accessibility auditing with `@axe-core/playwright`, OWASP security headers & CSRF cookie validation, Post-mortem Trace Viewer diagnostics, Monocart/Allure reporting dashboards, and Automation ROI metrics.
- **Architecture Lab**: Enterprise quality gatekeeper enforcing performance budgets, zero WCAG AA accessibility violations, and security headers.
- **Study Card**: *Enterprise Observability, Axe-Core & Trace Diagnostics (SC-07)*.

---

## 🛠️ Interactive Engineering Labs & Tools

### 1. 💻 Interactive Code Practice Lab (`CodePracticeLab.tsx`)
- In-browser code editor with syntax formatting and line numbers.
- 6 progressively harder coding challenges covering config factories, web-first locators, multi-tab popups, custom fixtures, hybrid API seeding, and self-healing heuristics.
- **Multi-language starter & solution code**: Switch seamlessly between Java, Python, JavaScript, and TypeScript.
- Real-time in-browser simulated test runner with validation rules, anti-pattern detection, and execution time measurements.
- Progressive 4-tier hint system that guides learners to independent solutions.

### 2. 🐛 Flake & Failure Diagnostics Lab (`DebuggingLab.tsx`)
- Diagnoses real-world automation bugs:
  - **Bug #1**: Strict Mode Locator Violation (3 elements matched).
  - **Bug #2**: Flaky Animation Race Condition (force-click timing drops).
  - **Bug #3**: Cross-Origin Payment Iframe Context Boundary Failures.
  - **Bug #4**: Parallel Worker Concurrency Collision & Shared Token Leaks.
- Shows real exception stack traces in Java (`PlaywrightException`), Python (`_impl._errors.Error`), and JavaScript/TypeScript.
- Learners repair the code directly in the browser and verify the fix against the diagnostic test runner.
- Unlocks root-cause explanations and architectural prevention strategies upon resolution.

### 3. 🤖 AI Testing & MCP Protocol Simulator (`AITestingLab.tsx`)
- **Interactive MCP Simulator**: Visualizes the bidirectional protocol messages exchanged between Playwright, the MCP Server (Accessibility Tree, Network, DOM, Console), and the LLM.
- **Self-Healing Locator Engine**: Simulate DOM mutations (e.g. `#submit-order-legacy` removed) and watch the self-healing algorithm query the accessibility tree, calculate match confidence, and heal the test without breaking the build.
- **Prompt Engineering Playbook**: Production-tested prompts for test generation, failure root-cause analysis, and visual regression diagnosis.
- **AI Safety & Determinism Guardrails**: Human approval triggers, decision audit logs, and locator mutation thresholds.

### 4. 📐 Enterprise Architecture Visualizer (`ArchitectureVisualizer.tsx`)
- **CDP Engine vs. Selenium vs. Cypress**: Interactive side-by-side architectural comparison illustrating why Playwright delivers sub-10ms context creation and zero-flake auto-waiting.
- **Fixture Dependency Inversion Tree**: Visualizes how Playwright tests declare fixture dependencies without brittle global state.
- **Hybrid Test Data Seeding Matrix**: Demonstrates how combining direct API calls with focused UI checks reduces test runtimes from 8.5 minutes to 45 seconds.
- **Distributed Cloud Grid**: Interactive diagram of a 5,000+ test suite running on 20 parallel sharded workers.

### 5. ☕ Java Compiler & REPL Console (`JavaCompilerConsole.tsx`)
- Dedicated browser-based Java compilation console with pre-loaded Playwright presets.
- Run Playwright Java snippets with instant standard output and error diagnostics.

---

## 💼 Enterprise Projects & Capstones (`EnterpriseProjects.tsx`)

Every learner implements realistic enterprise projects evaluated against professional rubrics:

| Project ID | Project Title | Key Deliverables |
|---|---|---|
| **EP-01** | **Environment Configuration Engine** | Multi-environment configuration manager with type safety, schema validation, and secure secrets masking. |
| **EP-02** | **Zero-Flake E-Commerce Platform Suite** | Production Page Object Model suite covering product search, shopping cart, authenticated checkout, and network stubbing. |
| **EP-03** | **Distributed Cloud Test Pipeline** | GitHub Actions pipeline with Docker containerization, matrix sharding across 4 workers, artifact upload, and Trace Viewer reporting. |
| **EP-04 (Capstone)** | **Autonomous Self-Healing Quality Platform** | Enterprise-scale hybrid test suite with API seeding, custom fixtures, `@axe-core` accessibility audits, and an AI self-healing locator recovery engine. |

---

## 🎯 Technical Interview Preparation Engine (`InterviewEngine.tsx`)

A dedicated career acceleration center designed to prepare learners for SDET, Lead, and Architect roles:

### 1. Five Specialized Career Tracks:
- **Playwright Developer Track**: Core locators, auto-waiting, browser contexts, and assertion fundamentals.
- **SDET Candidate Track**: API testing, custom fixtures, authentication state injection, and flaky test diagnostics.
- **Senior SDET Track**: Framework architecture, CI/CD sharding, Docker isolation, and performance testing.
- **QA Automation Lead Track**: Automation strategy, ROI modeling, code review hygiene, and cross-team quality gates.
- **Automation Architect Track**: Enterprise test grids, AI testing protocols, CDP communication, and distributed quality systems.

### 2. Timed Mock Interview Simulator:
- 45-minute countdown clock simulating real technical interview conditions.
- Progress tracker with instant reveal of model answers, key talking points, and common traps.

### 3. STAR Method Response Builder:
- Interactive builder for behavioral and technical scenario questions (Situation, Task, Action, Result).
- Guides candidates to structure measurable, high-impact stories.

### 4. 160+ Curated Question Bank:
- Filterable by Beginner (49), Intermediate (74), and Advanced (37).
- Track "Mastered" and "Bookmarked" questions in `localStorage`.
- One-click export to Markdown and JSON formats.

---

## 🏆 Learner Dashboard & Gamification (`AcademyDashboard.tsx`)

- **Overall Curriculum Progress Bar**: Dynamically computed across completed lessons, practice exercises, debugging challenges, and enterprise projects.
- **Daily Streak Tracker**: Visual fire counter encouraging continuous daily learning.
- **XP & Level Progression**: Earn XP for lessons (+50), code exercises (+75), debugging challenges (+100), and projects (+200). Levels include *Foundation Learner*, *Automation Engineer*, *Advanced SDET*, *Senior SDET*, and *Automation Architect*.
- **Adaptive Skill Radar Matrix**: Visualizes mastery across 8 competencies (Playwright Core, Language & OOP, Web-First Locators, Fixtures & DI, Hybrid API, AI Testing, CI/CD & Docker, and Flake Diagnostics).
- **Active Track Banner**: Shows active programming language, runner framework, and instant track switching.

---

## 🎓 Verifiable Master Certificate (`CertificateModal.tsx`)

Upon mastering the curriculum, learners unlock the **Professional Institute Master Certificate in Playwright with AI Testing & Next-Gen Automation**:
- Editable learner name with immediate preview.
- Unique Credential Verification ID (`PW-AI-2026-8941`).
- Dynamic **Specialization Track** indicator (e.g. *Playwright with Java (JUnit 5 / TestNG)*).
- Official QR verification seal and verified competency badges.
- One-click browser print and PDF export.

---

## ⚡ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool & Bundler**: Vite 6+
- **Styling & Design System**: Tailwind CSS with dark/light theme support
- **Icons**: Lucide React
- **PWA & Offline**: Vite Plugin PWA with Workbox service worker caching
- **Storage**: Browser `localStorage` for zero-setup, persistent progress tracking
- **Deployment**: GitHub Pages via automated GitHub Actions

---

## 🚀 Local Development & Getting Started

### Prerequisites:
- **Node.js**: v18.0.0 or higher
- **npm** or **bun** / **yarn**

### Steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ankit11191/playwright-master-guide.git
   cd playwright-master-guide
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Verify TypeScript compilation and linting**:
   ```bash
   npm run lint
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```
   Static output will be generated in `dist/` and `docs/`.

---

## 🚢 Continuous Deployment & GitHub Pages

This project is configured for automated deployment to GitHub Pages on every push to the `master` branch via `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [master]
```

To deploy manually or update static docs:
```bash
npm run build
rm -rf docs/* && cp -r dist/* docs/
git add docs/
git commit -m "chore: refresh production docs bundle"
git push origin master
```

---

## 👤 Author & Acknowledgments

**Ankit Mittal**  
*Quality Engineering & Automation Specialist*  
- **LinkedIn**: [https://www.linkedin.com/in/ankitmittal061091/](https://www.linkedin.com/in/ankitmittal061091/)  
- **GitHub**: [https://github.com/Ankit11191](https://github.com/Ankit11191)  
- **Repository**: [https://github.com/Ankit11191/playwright-master-guide](https://github.com/Ankit11191/playwright-master-guide)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute this platform for educational and commercial purposes.

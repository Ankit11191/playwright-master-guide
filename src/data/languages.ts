export type SupportedLanguage = 'java' | 'python' | 'javascript' | 'typescript';

export interface LanguageInfo {
  id: SupportedLanguage;
  name: string;
  shortName: string;
  icon: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  tagColor: string;
  frameworkRunner: string;
  buildTool: string;
  fileExtension: string;
  syntaxHighlight: string;
  description: string;
  assertionLib: string;
  quickInstall: string;
  testCommand: string;
  sampleSnippet: string;
}

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageInfo> = {
  java: {
    id: 'java',
    name: 'Java',
    shortName: 'Java',
    icon: '☕',
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/30',
    badgeText: 'text-amber-500 dark:text-amber-400',
    tagColor: 'text-amber-600 dark:text-amber-400',
    frameworkRunner: 'JUnit 5 / TestNG',
    buildTool: 'Maven / Gradle',
    fileExtension: 'java',
    syntaxHighlight: 'java',
    description: 'Playwright for Java with JUnit 5, Assertions, Maven/Gradle, and Thread-safe execution.',
    assertionLib: 'PlaywrightAssertions.assertThat',
    quickInstall: '<dependency>\n  <groupId>com.microsoft.playwright</groupId>\n  <artifactId>playwright</artifactId>\n  <version>1.49.0</version>\n</dependency>',
    testCommand: 'mvn test -Dtest=EnterpriseSuiteTest',
    sampleSnippet: `import com.microsoft.playwright.*;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class SampleTest {
  @Test
  void testPortal(Page page) {
    page.navigate("https://portal.enterprise.com");
    assertThat(page.getByRole(AriaRole.HEADING)).isVisible();
  }
}`
  },
  python: {
    id: 'python',
    name: 'Python',
    shortName: 'Python',
    icon: '🐍',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/30',
    badgeText: 'text-emerald-500 dark:text-emerald-400',
    tagColor: 'text-emerald-600 dark:text-emerald-400',
    frameworkRunner: 'pytest-playwright',
    buildTool: 'pip / poetry',
    fileExtension: 'py',
    syntaxHighlight: 'python',
    description: 'Playwright for Python with pytest fixtures, synchronous & async APIs, and snake_case methods.',
    assertionLib: 'expect(locator)',
    quickInstall: 'pip install pytest-playwright && playwright install',
    testCommand: 'pytest --headed --browser chromium',
    sampleSnippet: `from playwright.sync_api import Page, expect

def test_portal(page: Page):
    page.goto("https://portal.enterprise.com")
    expect(page.get_by_role("heading")).to_be_visible()`
  },
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    shortName: 'JS',
    icon: '🟨',
    badgeBg: 'bg-yellow-500/10',
    badgeBorder: 'border-yellow-500/30',
    badgeText: 'text-yellow-600 dark:text-yellow-400',
    tagColor: 'text-yellow-600 dark:text-yellow-400',
    frameworkRunner: '@playwright/test runner',
    buildTool: 'npm / yarn',
    fileExtension: 'js',
    syntaxHighlight: 'javascript',
    description: 'Playwright for JavaScript (Node.js ES6/CommonJS) with web-first assertions and async/await.',
    assertionLib: 'expect(locator)',
    quickInstall: 'npm init playwright@latest -- --js',
    testCommand: 'npx playwright test',
    sampleSnippet: `const { test, expect } = require('@playwright/test');

test('test portal', async ({ page }) => {
  await page.goto('https://portal.enterprise.com');
  await expect(page.getByRole('heading')).toBeVisible();
});`
  },
  typescript: {
    id: 'typescript',
    name: 'TypeScript',
    shortName: 'TS',
    icon: '🔷',
    badgeBg: 'bg-cyan-500/10',
    badgeBorder: 'border-cyan-500/30',
    badgeText: 'text-cyan-500 dark:text-cyan-400',
    tagColor: 'text-cyan-600 dark:text-cyan-400',
    frameworkRunner: '@playwright/test with TS',
    buildTool: 'npm / pnpm / tsc',
    fileExtension: 'ts',
    syntaxHighlight: 'typescript',
    description: 'Playwright with strict TypeScript types, custom fixtures, generics, and compile-time contracts.',
    assertionLib: 'expect(locator)',
    quickInstall: 'npm init playwright@latest -- --typescript',
    testCommand: 'npx playwright test --project=chromium',
    sampleSnippet: `import { test, expect } from '@playwright/test';

test('test portal', async ({ page }) => {
  await page.goto('https://portal.enterprise.com');
  await expect(page.getByRole('heading')).toBeVisible();
});`
  }
};

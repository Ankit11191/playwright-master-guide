export interface JavaPreset {
  id: string;
  name: string;
  category: 'Basics' | 'Form Handling' | 'Locators' | 'Assertions' | 'Advanced' | 'Mocking';
  description: string;
  commandSnippet: string;
  fullClassCode: string;
  initialUrl: string;
  expectedOutputHint: string;
}

export const PREDEFINED_IMPORTS = [
  'import com.microsoft.playwright.*;',
  'import com.microsoft.playwright.options.*;',
  'import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;',
  'import java.nio.file.Paths;',
  'import java.util.*;',
  'import java.util.regex.Pattern;',
];

export const PREDEFINED_CLASS_WRAPPER_START = `package com.playwright.practice;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.*;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import java.nio.file.Paths;
import java.util.*;
import java.util.regex.Pattern;

public class PlaywrightPractice {
    public static void main(String[] args) {
        // Pre-configured Playwright Java instance
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(
                new BrowserType.LaunchOptions()
                    .setHeadless(false)
                    .setSlowMo(100)
            );
            BrowserContext context = browser.newContext(
                new Browser.NewContextOptions().setViewportSize(1280, 720)
            );
            Page page = context.newPage();

            // ================= USER COMMANDS START =================
`;

export const PREDEFINED_CLASS_WRAPPER_END = `
            // ================== USER COMMANDS END ==================

            System.out.println(">> Automation scenario executed successfully.");
            browser.close();
        } catch (Exception e) {
            System.err.println("Playwright Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}`;

export const JAVA_PRESETS: JavaPreset[] = [
  {
    id: 'ecommerce-flow',
    name: 'E-Commerce Search & Cart',
    category: 'Basics',
    description: 'Navigate to online store, search for products, verify results, and add item to cart with assertions.',
    initialUrl: 'https://ecommerce-playground.demo',
    expectedOutputHint: 'Prints page title, products count, cart items, and confirms title assertion.',
    commandSnippet: `// 1. Navigate to target web application
page.navigate("https://ecommerce-playground.demo");

System.out.println("Page Title: " + page.title());
System.out.println("Current URL: " + page.url());

// 2. Perform search using modern locator
page.getByPlaceholder("Search products...").fill("Playwright Pro Headphones");
page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Search")).click();

System.out.println("Searching for products...");

// 3. Assert search results are visible
Locator productTitle = page.locator(".product-title");
assertThat(productTitle).isVisible();
System.out.println("Found Product: " + productTitle.textContent());

// 4. Click Add to Cart and verify badge
page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Add to Cart")).click();
System.out.println("Cart Items Count: " + page.locator(".cart-badge").textContent());

// 5. Assert title
assertThat(page).hasTitle("Playwright Tech Store | Quality Audio & Hardware");
System.out.println("✓ All assertions passed successfully!");`,
    fullClassCode: `package com.playwright.practice;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.*;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class PlaywrightPractice {
    public static void main(String[] args) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(false));
            BrowserContext context = browser.newContext();
            Page page = context.newPage();

            page.navigate("https://ecommerce-playground.demo");
            System.out.println("Page Title: " + page.title());

            page.getByPlaceholder("Search products...").fill("Playwright Pro Headphones");
            page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Search")).click();

            Locator productTitle = page.locator(".product-title");
            assertThat(productTitle).isVisible();
            System.out.println("Found Product: " + productTitle.textContent());

            page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Add to Cart")).click();
            System.out.println("Cart Items Count: " + page.locator(".cart-badge").textContent());

            assertThat(page).hasTitle("Playwright Tech Store | Quality Audio & Hardware");
            System.out.println("✓ All assertions passed successfully!");
        }
    }
}`
  },
  {
    id: 'login-validation',
    name: 'Login Form & Validation',
    category: 'Form Handling',
    description: 'Enter credentials, toggle remember checkbox, click login, and assert authentication banner.',
    initialUrl: 'https://login-portal.demo',
    expectedOutputHint: 'Fills email/password, submits form, verifies welcome dashboard text.',
    commandSnippet: `page.navigate("https://login-portal.demo");
System.out.println("Navigated to: " + page.url());

// Fill credentials
page.getByLabel("Email Address").fill("qa.engineer@company.com");
page.getByLabel("Password").fill("SecurePass@2025!");

// Toggle Remember Me checkbox
page.getByRole(AriaRole.CHECKBOX, new Page.GetByRoleOptions().setName("Remember me")).check();
System.out.println("Remember me checked: " + page.getByRole(AriaRole.CHECKBOX, new Page.GetByRoleOptions().setName("Remember me")).isChecked());

// Submit login
page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Sign In")).click();

// Validate logged-in welcome message
Locator welcomeBanner = page.locator(".welcome-user");
assertThat(welcomeBanner).hasText("Welcome back, QA Engineer!");
System.out.println("Status: " + welcomeBanner.textContent());`,
    fullClassCode: `package com.playwright.practice;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.*;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class PlaywrightPractice {
    public static void main(String[] args) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(false));
            Page page = browser.newPage();

            page.navigate("https://login-portal.demo");
            page.getByLabel("Email Address").fill("qa.engineer@company.com");
            page.getByLabel("Password").fill("SecurePass@2025!");
            page.getByRole(AriaRole.CHECKBOX, new Page.GetByRoleOptions().setName("Remember me")).check();
            page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Sign In")).click();

            Locator welcomeBanner = page.locator(".welcome-user");
            assertThat(welcomeBanner).hasText("Welcome back, QA Engineer!");
            System.out.println("Status: " + welcomeBanner.textContent());
        }
    }
}`
  },
  {
    id: 'modern-locators',
    name: 'Modern Locators & Filtering',
    category: 'Locators',
    description: 'Practice getByRole, getByTestId, getByText, and locator.filter() matching user-facing attributes.',
    initialUrl: 'https://ecommerce-playground.demo',
    expectedOutputHint: 'Demonstrates resilient locators and list filtering in Java Playwright.',
    commandSnippet: `page.navigate("https://ecommerce-playground.demo");

// Find elements with semantic accessibility roles
Locator categoryButtons = page.getByRole(AriaRole.BUTTON);
System.out.println("Total buttons on page: " + categoryButtons.count());

// Filter products that contain 'In Stock'
Locator inStockCards = page.locator(".product-card")
    .filter(new Locator.FilterOptions().setHasText("In Stock"));

System.out.println("In Stock items: " + inStockCards.count());

// Inspect first matching product
String firstItemName = inStockCards.first().locator(".product-title").textContent();
System.out.println("First available item: " + firstItemName);

// Click with exact text matching
page.getByText("View Specifications", new Page.GetByTextOptions().setExact(true)).click();
System.out.println("Modal opened: " + page.locator(".spec-modal").isVisible());`,
    fullClassCode: `package com.playwright.practice;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.*;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class PlaywrightPractice {
    public static void main(String[] args) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch();
            Page page = browser.newPage();

            page.navigate("https://ecommerce-playground.demo");

            Locator categoryButtons = page.getByRole(AriaRole.BUTTON);
            System.out.println("Total buttons: " + categoryButtons.count());

            Locator inStockCards = page.locator(".product-card")
                .filter(new Locator.FilterOptions().setHasText("In Stock"));
            System.out.println("In Stock items: " + inStockCards.count());
        }
    }
}`
  },
  {
    id: 'assertions-autowait',
    name: 'Smart Assertions & Auto-Waiting',
    category: 'Assertions',
    description: 'Use PlaywrightAssertions.assertThat with automatic retries for dynamic UI updates.',
    initialUrl: 'https://automation-practice.demo',
    expectedOutputHint: 'Verifies element states: isVisible, isEnabled, hasValue, and hasTitle.',
    commandSnippet: `page.navigate("https://automation-practice.demo");

// Click trigger for dynamic content
page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Load Data Asynchronously")).click();

// Playwright auto-waits up to 30s until condition matches!
Locator successBadge = page.locator(".async-success-message");
assertThat(successBadge).isVisible();
assertThat(successBadge).hasText("Data loaded successfully!");

System.out.println("Success message: " + successBadge.textContent());

// Check form field state
Locator emailInput = page.locator("#userEmail");
assertThat(emailInput).isEnabled();
emailInput.fill("test@playwright.dev");
assertThat(emailInput).hasValue("test@playwright.dev");

System.out.println("✓ Auto-waiting assertions validated seamlessly.");`,
    fullClassCode: `package com.playwright.practice;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.*;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class PlaywrightPractice {
    public static void main(String[] args) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch();
            Page page = browser.newPage();

            page.navigate("https://automation-practice.demo");
            page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Load Data Asynchronously")).click();

            Locator successBadge = page.locator(".async-success-message");
            assertThat(successBadge).isVisible();
            assertThat(successBadge).hasText("Data loaded successfully!");

            System.out.println("Success message: " + successBadge.textContent());
        }
    }
}`
  },
  {
    id: 'dialogs-alerts',
    name: 'Dialogs & JavaScript Popups',
    category: 'Advanced',
    description: 'Register dialog listeners in Java (onceDialog) before clicking alert trigger.',
    initialUrl: 'https://automation-practice.demo',
    expectedOutputHint: 'Captures and accepts JavaScript alert, logs message to console.',
    commandSnippet: `page.navigate("https://automation-practice.demo");

// Register dialog handler BEFORE triggering the event
page.onceDialog(dialog -> {
    System.out.println(">> Intercepted Dialog Type: " + dialog.type());
    System.out.println(">> Dialog Prompt Message: " + dialog.message());
    dialog.accept("Accepted by Playwright Java Test Runner");
});

// Click button that opens alert
page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Trigger Confirmation Dialog")).click();

// Verify dialog response in DOM
Locator dialogResult = page.locator("#dialogResultText");
System.out.println("Action Result: " + dialogResult.textContent());`,
    fullClassCode: `package com.playwright.practice;

import com.microsoft.playwright.*;

public class PlaywrightPractice {
    public static void main(String[] args) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch();
            Page page = browser.newPage();

            page.navigate("https://automation-practice.demo");
            page.onceDialog(dialog -> {
                System.out.println("Dialog message: " + dialog.message());
                dialog.accept();
            });

            page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Trigger Confirmation Dialog")).click();
        }
    }
}`
  },
  {
    id: 'network-mocking',
    name: 'Network Mocking & Route Fulfill',
    category: 'Mocking',
    description: 'Intercept HTTP requests with page.route() and return mock JSON payloads.',
    initialUrl: 'https://ecommerce-playground.demo',
    expectedOutputHint: 'Mocks user profile API with custom role and verifies UI display.',
    commandSnippet: `// Mock backend endpoint before navigation
page.route("**/api/user/profile", route -> {
    System.out.println(">> Intercepting API Request: " + route.request().url());
    String mockJson = "{\\"name\\":\\"Senior QA Architect\\",\\"role\\":\\"Admin\\",\\"credits\\":9999}";
    
    route.fulfill(new Route.FulfillOptions()
        .setStatus(200)
        .setContentType("application/json")
        .setBody(mockJson)
    );
});

page.navigate("https://ecommerce-playground.demo");
System.out.println("Page rendered with mocked API payload.");

Locator userRole = page.locator(".user-role-badge");
System.out.println("Mocked User Role displayed: " + userRole.textContent());`,
    fullClassCode: `package com.playwright.practice;

import com.microsoft.playwright.*;

public class PlaywrightPractice {
    public static void main(String[] args) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch();
            Page page = browser.newPage();

            page.route("**/api/user/profile", route -> {
                route.fulfill(new Route.FulfillOptions()
                    .setStatus(200)
                    .setContentType("application/json")
                    .setBody("{\\"name\\":\\"Senior QA Architect\\",\\"role\\":\\"Admin\\"}"));
            });

            page.navigate("https://ecommerce-playground.demo");
        }
    }
}`
  },
  {
    id: 'screenshots-capture',
    name: 'Screenshots & Full Page Capture',
    category: 'Basics',
    description: 'Capture screenshot of full viewport and specific locators.',
    initialUrl: 'https://ecommerce-playground.demo',
    expectedOutputHint: 'Takes viewport and element screenshots with visual display.',
    commandSnippet: `page.navigate("https://ecommerce-playground.demo");

// Take full page screenshot
page.screenshot(new Page.ScreenshotOptions()
    .setPath(Paths.get("screenshots/homepage-full.png"))
    .setFullPage(true)
);
System.out.println("Captured full-page screenshot -> screenshots/homepage-full.png");

// Take element-specific screenshot
Locator cartWidget = page.locator(".cart-summary-card");
cartWidget.screenshot(new Locator.ScreenshotOptions()
    .setPath(Paths.get("screenshots/cart-widget.png"))
);
System.out.println("Captured locator screenshot -> screenshots/cart-widget.png");`,
    fullClassCode: `package com.playwright.practice;

import com.microsoft.playwright.*;
import java.nio.file.Paths;

public class PlaywrightPractice {
    public static void main(String[] args) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch();
            Page page = browser.newPage();

            page.navigate("https://ecommerce-playground.demo");
            page.screenshot(new Page.ScreenshotOptions().setPath(Paths.get("screenshot.png")));
            System.out.println("Screenshot saved!");
        }
    }
}`
  },
  {
    id: 'blank-scratchpad',
    name: 'Blank Practice Scratchpad',
    category: 'Basics',
    description: 'Start fresh with pre-initialized Playwright, Browser, Context, and Page objects.',
    initialUrl: 'https://ecommerce-playground.demo',
    expectedOutputHint: 'Write any custom Playwright Java code and click Run.',
    commandSnippet: `// Type any Playwright Java commands here!
// Objects ready to use: page, browser, context, playwright
// Assertions: assertThat(...)

page.navigate("https://ecommerce-playground.demo");
System.out.println("Title: " + page.title());
System.out.println("URL: " + page.url());

// Try finding and clicking an element:
// page.locator(".product-title").click();
`,
    fullClassCode: `package com.playwright.practice;

import com.microsoft.playwright.*;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class PlaywrightPractice {
    public static void main(String[] args) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch();
            Page page = browser.newPage();

            page.navigate("https://ecommerce-playground.demo");
            System.out.println("Title: " + page.title());
        }
    }
}`
  }
];

export const QUICK_INSERT_COMMANDS = [
  { label: 'page.navigate(...)', code: 'page.navigate("https://ecommerce-playground.demo");' },
  { label: 'page.title()', code: 'System.out.println("Title: " + page.title());' },
  { label: 'page.url()', code: 'System.out.println("URL: " + page.url());' },
  { label: 'getByRole(BUTTON)', code: 'page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Search")).click();' },
  { label: 'getByPlaceholder()', code: 'page.getByPlaceholder("Search products...").fill("MacBook Pro");' },
  { label: 'page.locator().click()', code: 'page.locator(".btn-primary").click();' },
  { label: 'assertThat(page).hasTitle()', code: 'assertThat(page).hasTitle("Playwright Tech Store | Quality Audio & Hardware");' },
  { label: 'assertThat(locator).isVisible()', code: 'assertThat(page.locator(".product-title")).isVisible();' },
  { label: 'System.out.println()', code: 'System.out.println("Log output: " + page.title());' },
  { label: 'page.screenshot()', code: 'page.screenshot(new Page.ScreenshotOptions().setFullPage(true));' },
];

export const MAVEN_POM_XML = `<!-- Add to your pom.xml for Playwright Java -->
<dependency>
    <groupId>com.microsoft.playwright</groupId>
    <artifactId>playwright</artifactId>
    <version>1.49.0</version>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.2</version>
    <scope>test</scope>
</dependency>`;

export const GRADLE_BUILD = `// Add to build.gradle (Groovy)
testImplementation 'com.microsoft.playwright:playwright:1.49.0'
testImplementation 'org.junit.jupiter:junit-jupiter:5.10.2'`;

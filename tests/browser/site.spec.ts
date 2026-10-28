import { test, expect } from "@playwright/test";
import {
  categories,
  products,
  categoryHref,
  productHref,
} from "../../lib/content";
const pages = [
  "/",
  "/materials",
  "/materials/exterior",
  "/materials/interior",
  "/materials/structural",
  "/materials/bespoke",
  "/project-packages",
  "/procurement",
  "/about",
  "/contact",
  "/request-pricing",
  "/privacy",
  "/terms",
  "/enquiry-terms",
];
test("all public routes render metadata, headings and fit viewport", async ({
  page,
}) => {
  test.setTimeout(90000);
  for (const path of [
    ...pages,
    ...categories.map(categoryHref),
    ...products.map(productHref),
  ]) {
    const r = await page.goto(path);
    expect(r?.status(), path).toBe(200);
    await expect(page.locator("main h1"), path).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(
        path === "/"
          ? "^https://glanheim\\.com/?$"
          : path.replaceAll("/", "\\/"),
      ),
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
      path,
    ).toBe(true);
  }
});
test("catalogue search, empty state and reset", async ({ page }) => {
  await page.goto("/materials");
  await page.getByRole("searchbox").fill("joinery");
  await expect(page.getByRole("status")).toContainText("2 sourcing categories");
  await page.getByRole("searchbox").fill("zzzzzz");
  await expect(page.getByText("No matching categories.")).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.getByRole("status")).toContainText(
    "18 sourcing categories",
  );
  await page
    .getByRole("combobox", { name: "Material", exact: true })
    .selectOption("Metal");
  await expect(page.getByRole("status")).toContainText("3 sourcing categories");
});
test("product selection arrives in enquiry and required validation works", async ({
  page,
}) => {
  await page.goto(productHref(products[0]));
  await page
    .getByRole("link", { name: "Request project pricing", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("heading", { name: "Your details", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByText("Enter your full name")).toBeVisible();
  await page.getByLabel("Full name").fill("Alex Builder");
  await page
    .getByLabel("Company", { exact: false })
    .first()
    .fill("Example Construction");
  await page.getByLabel("Work email").fill("alex@example.com");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByText("Selected profile:", { exact: false }),
  ).toContainText(products[0].name);
});
async function fillForm(page: import("@playwright/test").Page) {
  await page.goto("/request-pricing");
  await page.getByLabel("Full name").fill("Alex Builder");
  await page
    .getByLabel("Company *", { exact: true })
    .fill("Example Construction");
  await page.getByLabel("Work email").fill("alex@example.com");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Joinery", { exact: true }).check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Pricing purpose").selectOption("Tender pricing");
  await page
    .getByLabel("Scope description")
    .fill("Commercial joinery package for the reception and office areas.");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("checkbox", { name: "I am authorised" }).check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("checkbox", { name: "I acknowledge" }).check();
}
test("unconfigured live endpoint fails honestly with email fallback", async ({
  page,
}) => {
  await fillForm(page);
  await expect(
    page.getByRole("heading", { name: "Review & submit" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Submit project for review" }).click();
  await expect(page.locator(".form-alert")).toContainText("not available yet");
  expect(page.url()).toContain("/request-pricing");
  await expect(page.locator(".form-alert").getByRole("link")).toHaveAttribute(
    "href",
    /mailto:info@glanheim.com/,
  );
});
test("success UI follows accepted response only (simulated integration)", async ({
  page,
}) => {
  await page.route("**/api/enquiries", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ reference: "GL-2026-ABCDEF12" }),
    }),
  );
  await fillForm(page);
  await page.getByRole("button", { name: "Submit project for review" }).click();
  await expect(page).toHaveURL(/enquiry-confirmation/);
  await expect(page.getByText("No verified enquiry receipt")).toBeVisible();
});
test("Dropbox fallback and unverified confirmation are honest", async ({
  page,
}) => {
  await page.goto("/project-packages");
  await expect(
    page.getByRole("link", { name: "Request a secure upload link" }),
  ).toHaveAttribute("href", /^mailto:info@glanheim.com/);
  await page.goto("/enquiry-confirmation");
  await expect(page.getByText("No verified enquiry receipt")).toBeVisible();
  const r = await page.goto("/unknown-page");
  expect(r?.status()).toBe(404);
});
test("navigation is usable at each viewport", async ({ page }, testInfo) => {
  await page.goto("/");
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Menu +" }).click();
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Materials", exact: true })
      .click();
    await expect(page.getByRole("button", { name: "Menu +" })).toBeVisible();
  } else
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Materials", exact: true })
      .click();
  await expect(page).toHaveURL(/\/materials$/);
});

test("main pages have no automated WCAG A/AA violations", async ({ page }) => {
  test.setTimeout(90000);
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  for (const path of [
    "/",
    "/materials",
    "/project-packages",
    "/contact",
    "/request-pricing",
  ]) {
    await page.goto(path);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => n.target),
      })),
      path,
    ).toEqual([]);
  }
});

test("API rejects cross-site requests, invalid content and oversized payloads", async ({
  request,
}) => {
  const cross = await request.post("/api/enquiries", {
    headers: { Origin: "https://unrelated.example" },
    data: {},
  });
  expect(cross.status()).toBe(403);
  const invalid = await request.post("/api/enquiries", {
    headers: { Origin: "http://127.0.0.1:3000" },
    data: {},
  });
  expect(invalid.status()).toBe(400);
  const text = await request.post("/api/enquiries", {
    headers: { Origin: "http://127.0.0.1:3000", "Content-Type": "text/plain" },
    data: "hello",
  });
  expect(text.status()).toBe(415);
  const large = await request.post("/api/enquiries", {
    headers: { Origin: "http://127.0.0.1:3000" },
    data: { scope: "x".repeat(25000) },
  });
  expect(large.status()).toBe(413);
});

test("valid signed receipt renders confirmation (local test key, no email delivery)", async ({
  page,
}, testInfo) => {
  const { spawn } = await import("node:child_process");
  const { signReceipt } = await import("../../lib/enquiry-service");
  const port = 3100 + testInfo.workerIndex;
  const base = `http://127.0.0.1:${port}`;
  const salt = "local-browser-template-test-only";
  const server = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--port",
      String(port),
      "--hostname",
      "127.0.0.1",
    ],
    {
      env: {
        ...process.env,
        RATE_LIMIT_SALT: salt,
        ENQUIRIES_ENABLED: "false",
      },
      stdio: "ignore",
    },
  );
  try {
    let ready = false;
    for (let n = 0; n < 50; n++) {
      try {
        const r = await fetch(base);
        if (r.ok) {
          ready = true;
          break;
        }
      } catch {}
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    expect(ready).toBe(true);
    await page.context().addCookies([
      {
        name: "glanheim-receipt",
        value: signReceipt("GL-2026-ABCDEF12", salt),
        url: base + "/enquiry-confirmation",
        httpOnly: true,
        sameSite: "Strict",
      },
    ]);
    await page.goto(base + "/enquiry-confirmation");
    await expect(
      page.getByRole("heading", { name: "Your next chapter starts here." }),
    ).toBeVisible();
    await expect(page.locator(".reference")).toHaveText("GL-2026-ABCDEF12");
  } finally {
    server.kill("SIGTERM");
  }
});

test("public positioning presents an Australian materials business", async ({
  page,
}) => {
  for (const path of [
    "/",
    "/materials",
    "/procurement",
    "/about",
    "/contact",
  ]) {
    await page.goto(path);
    await expect(page.locator("main")).not.toContainText(
      /NCC|Australian compliance|imported|international freight/i,
    );
    await expect(
      page
        .getByRole("navigation", { name: "Primary" })
        .locator('a[href="/compliance"]'),
    ).toHaveCount(0);
  }
  const response = await page.goto("/compliance");
  expect(response?.status()).toBe(404);
});

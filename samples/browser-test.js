// samples/browser-test.js — k6 Browser Module Performance Test
// This sample demonstrates: browser-based performance testing
// using the k6 browser module.
//
// Run with: K6_BROWSER_ENABLED=true k6 run samples/browser-test.js

import { browser } from "k6/browser";
import { check, sleep } from "k6";
import { Trend } from "k6/metrics";

const pageLoadTime = new Trend("page_load_time");

export const options = {
  scenarios: {
    browser_test: {
      executor: "shared-iterations",
      vus: 1,
      iterations: 3,
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
  thresholds: {
    page_load_time: ["p(95)<5000"],
  },
};

export default async function () {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const startTime = Date.now();

    // Navigate to the target page
    await page.goto("https://test.k6.io/");
    pageLoadTime.add(Date.now() - startTime);

    // Check page loaded correctly
    check(page, {
      "page title is correct": (p) => p.title() !== "",
    });

    // Interact with the page
    const links = await page.locator("a").count();
    check(null, {
      "page has links": () => links > 0,
    });

    sleep(1);
  } finally {
    await page.close();
    await context.close();
  }
}


// samples/synthetic-api-monitor.js — Synthetic API Monitoring Test
// Simulates a scheduled single-iteration probe verifying endpoint availability and SLAs.
//
// Run with: k6 run samples/synthetic-api-monitor.js

import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";
import { randomString } from "./lib/helpers.js";

// Custom synthetic metrics
const syntheticSlaPass = new Rate("synthetic_sla_pass");
const transactionDuration = new Trend("synthetic_transaction_duration");

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    // 0% tolerance for failed requests during synthetic checks
    http_req_failed: ["rate==0"],
    // 95% of requests must complete under 500ms
    http_req_duration: ["p(95)<500"],
    // 100% of functional SLA assertions must pass
    synthetic_sla_pass: ["rate==1.0"],
  },
};

const BASE_URL = "https://quickpizza.grafana.com";

export default function () {
  // Generate transient session token per run (no hardcoded credentials)
  const token = randomString(16);
  const authHeaders = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };

  // Step 1: Public endpoint availability probe
  const quotesRes = http.get(`${BASE_URL}/api/quotes`);
  const quotesPass = check(quotesRes, {
    "quotes: status is 200": (r) => r.status === 200,
    "quotes: has items": (r) => Array.isArray(r.json("quotes")) && r.json("quotes").length > 0,
    "quotes: latency < 500ms": (r) => r.timings.duration < 500,
  });
  syntheticSlaPass.add(quotesPass);

  sleep(0.5);

  // Step 2: Authenticated tools configuration probe
  const toolsRes = http.get(`${BASE_URL}/api/tools`, authHeaders);
  const toolsPass = check(toolsRes, {
    "tools: status is 200": (r) => r.status === 200,
    "tools: returns tools list": (r) => Array.isArray(r.json("tools")) && r.json("tools").length > 0,
  });
  syntheticSlaPass.add(toolsPass);

  sleep(0.5);

  // Step 3: Transactional recommendation flow probe
  const payload = JSON.stringify({
    maxCaloriesPerSlice: 1000,
    mustBeVegetarian: false,
    excludedIngredients: [],
    excludedTools: [],
    maxNumberOfToppings: 4,
    minNumberOfToppings: 2,
    customName: "Synthetic Monitor Pizza",
  });

  const pizzaRes = http.post(`${BASE_URL}/api/pizza`, payload, authHeaders);
  transactionDuration.add(pizzaRes.timings.duration);

  const pizzaPass = check(pizzaRes, {
    "pizza: status is 200": (r) => r.status === 200,
    "pizza: valid id generated": (r) => typeof r.json("pizza.id") === "number",
    "pizza: ingredients returned": (r) => Array.isArray(r.json("pizza.ingredients")),
    "pizza: latency < 500ms": (r) => r.timings.duration < 500,
  });
  syntheticSlaPass.add(pizzaPass);
}

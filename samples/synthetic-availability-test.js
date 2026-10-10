// samples/synthetic-availability-test.js — Synthetic Availability Monitoring
// Scheduled single-iteration probe that checks endpoints are up and meeting SLAs.
//
// Run with: k6 run samples/synthetic-availability-test.js
// Override target: BASE_URL=https://quickpizza.grafana.com k6 run samples/synthetic-availability-test.js

import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";
import { authHeaders } from "./lib/helpers.js";

const syntheticSlaPass = new Rate("synthetic_sla_pass");
const transactionDuration = new Trend("synthetic_transaction_duration");

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    http_req_failed: ["rate==0"],
    http_req_duration: ["p(95)<500"],
    synthetic_sla_pass: ["rate==1.0"],
  },
};

const BASE_URL = __ENV.BASE_URL || "https://quickpizza.grafana.com";

export function setup() {
  const token = __ENV.API_TOKEN || "synthetic-probe-token";
  return { token };
}

export default function (data) {
  const headers = authHeaders(data.token);

  const quotesRes = http.get(`${BASE_URL}/api/quotes`);
  const quotesPass = check(quotesRes, {
    "quotes: status is 200": (r) => r.status === 200,
    "quotes: has items": (r) => Array.isArray(r.json("quotes")) && r.json("quotes").length > 0,
    "quotes: latency < 500ms": (r) => r.timings.duration < 500,
  });
  syntheticSlaPass.add(quotesPass);

  sleep(0.5);

  const pizzaRes = http.post(
    `${BASE_URL}/api/pizza`,
    JSON.stringify({
      maxCaloriesPerSlice: 1000,
      mustBeVegetarian: false,
      excludedIngredients: [],
      excludedTools: [],
      maxNumberOfToppings: 4,
      minNumberOfToppings: 2,
      customName: "Synthetic Monitor Pizza",
    }),
    headers
  );
  transactionDuration.add(pizzaRes.timings.duration);

  const pizzaPass = check(pizzaRes, {
    "pizza: status is 200": (r) => r.status === 200,
    "pizza: valid id generated": (r) => typeof r.json("pizza.id") === "number",
    "pizza: ingredients returned": (r) => Array.isArray(r.json("pizza.ingredients")),
    "pizza: latency < 500ms": (r) => r.timings.duration < 500,
  });
  syntheticSlaPass.add(pizzaPass);
}

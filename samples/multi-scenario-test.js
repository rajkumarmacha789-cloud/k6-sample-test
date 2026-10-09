// samples/multi-scenario-test.js — Parallel Executor Configurations
// This sample demonstrates: running multiple scenarios in parallel
// with different executor types.
//
// Run with: k6 run samples/multi-scenario-test.js

import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = "https://test-api.k6.io/public/crocodiles/";

export const options = {
  scenarios: {
    // Scenario 1: Constant load — fixed number of VUs for a duration
    constant_load: {
      executor: "constant-vus",
      vus: 5,
      duration: "20s",
      exec: "browseAPI",
    },
    // Scenario 2: Ramping load — VUs ramp up and down over stages
    ramp_load: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "10s", target: 10 },
        { duration: "10s", target: 0 },
      ],
      exec: "browseAPI",
    },
    // Scenario 3: Per-VU iterations — each VU runs exactly N iterations
    fixed_iterations: {
      executor: "per-vu-iterations",
      vus: 3,
      iterations: 5,
      exec: "browseAPI",
    },
    // Scenario 4: Shared iterations — N iterations shared across VUs
    shared_pool: {
      executor: "shared-iterations",
      vus: 5,
      iterations: 20,
      exec: "browseAPI",
    },
  },
};

export function browseAPI() {
  const res = http.get(BASE_URL);
  check(res, {
    "status is 200": (r) => r.status === 200,
    "body is not empty": (r) => r.body.length > 0,
  });
  sleep(1);
}


// samples/threshold-test.js — Thresholds and Custom Metrics
// This sample demonstrates: p95 thresholds, error rate, custom metric thresholds.
//
// Run with: k6 run samples/threshold-test.js

import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend, Counter, Gauge } from "k6/metrics";

// Custom metrics
const errorRate = new Rate("custom_error_rate");
const latencyTrend = new Trend("custom_latency");
const requestCount = new Counter("custom_request_count");
const activeVUs = new Gauge("custom_active_vus");

export const options = {
  vus: 10,
  duration: "30s",
  thresholds: {
    // Built-in metric thresholds
    http_req_duration: [
      "p(95)<500",   // 95th percentile under 500ms
      "p(99)<1000",  // 99th percentile under 1000ms
      "avg<300",     // Average under 300ms
    ],
    http_req_failed: ["rate<0.01"],  // Less than 1% failed requests
    http_reqs: ["rate>5"],           // At least 5 requests per second

    // Custom metric thresholds
    custom_error_rate: ["rate<0.05"],     // Custom error rate under 5%
    custom_latency: ["p(95)<400"],        // Custom latency p95 under 400ms
    custom_request_count: ["count>100"],  // At least 100 total requests
  },
};

export default function () {
  const res = http.get("https://test-api.k6.io/public/crocodiles/");

  // Record custom metrics
  errorRate.add(res.status !== 200);
  latencyTrend.add(res.timings.duration);
  requestCount.add(1);
  activeVUs.add(__VU);

  check(res, {
    "status is 200": (r) => r.status === 200,
    "duration < 500ms": (r) => r.timings.duration < 500,
  });

  sleep(0.5);
}


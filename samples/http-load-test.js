// samples/http-load-test.js — HTTP Load Test with Staged Ramp-Up/Down
// This sample demonstrates: GET requests, checks, custom metrics, and stages.
//
// Run with: k6 run samples/http-load-test.js

import http from "k6/http";
import { check, sleep } from "k6";
import { Trend, Rate } from "k6/metrics";

// Custom metrics: track response time and error rate separately
const responseTrend = new Trend("custom_response_time");
const errorRate = new Rate("custom_errors");

// Options: staged ramp-up, hold, and ramp-down
export const options = {
  stages: [
    { duration: "10s", target: 5 },   // Ramp up to 5 VUs over 10s
    { duration: "20s", target: 5 },   // Hold at 5 VUs for 20s
    { duration: "10s", target: 0 },   // Ramp down to 0 VUs over 10s
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95th percentile under 500ms
    custom_errors: ["rate<0.1"],      // Error rate under 10%
  },
};

export default function () {
  // Send a GET request to the k6 test API
  const res = http.get("https://test-api.k6.io/public/crocodiles/");

  // Record custom metrics
  responseTrend.add(res.timings.duration);
  errorRate.add(res.status !== 200);

  // Checks: validate response status and body
  check(res, {
    "status is 200": (r) => r.status === 200,
    "body is not empty": (r) => r.body.length > 0,
    "response time < 500ms": (r) => r.timings.duration < 500,
  });

  // Pacing: wait 1 second between iterations
  sleep(1);
}


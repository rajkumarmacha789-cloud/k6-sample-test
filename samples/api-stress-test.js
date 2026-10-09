// samples/api-stress-test.js — API Stress Test with POST, Auth, and Validation
// This sample demonstrates: POST with JSON, auth headers, response validation.
//
// Run with: k6 run samples/api-stress-test.js

import http from "k6/http";
import { check, sleep } from "k6";

// Stress test: rapidly increase VUs to find breaking point
export const options = {
  stages: [
    { duration: "10s", target: 10 },  // Ramp to 10 VUs
    { duration: "20s", target: 50 },  // Spike to 50 VUs
    { duration: "10s", target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"],   // Less than 5% errors
    http_req_duration: ["p(95)<1000"],
  },
};

export default function () {
  // Authenticate: POST with JSON payload and headers
  const loginPayload = JSON.stringify({
    username: "testuser",
    password: "testpassword",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const loginRes = http.post(
    "https://test-api.k6.io/auth/basic/login/",
    loginPayload,
    params
  );

  // Validate login response
  check(loginRes, {
    "login status is 200": (r) => r.status === 200,
    "login response has body": (r) => r.body.length > 0,
  });

  // Use auth cookie for subsequent requests
  const authParams = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Create a resource with POST
  const createPayload = JSON.stringify({
    name: "Test Croc " + __VU,
    sex: "M",
    date_of_birth: "2020-01-01",
  });

  const createRes = http.post(
    "https://test-api.k6.io/my/crocodiles/",
    createPayload,
    authParams
  );

  check(createRes, {
    "create status is 200 or 201": (r) => r.status === 200 || r.status === 201,
  });

  sleep(1);
}


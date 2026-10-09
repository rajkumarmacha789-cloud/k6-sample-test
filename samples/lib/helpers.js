// samples/lib/helpers.js — Shared Utility Module
// This module provides reusable functions for k6 test scripts.
// Import with: import { generateUser, commonChecks } from "../lib/helpers.js";

import { check } from "k6";

// Generate a random user object for authentication tests
export function generateUser() {
  const id = Math.floor(Math.random() * 100000);
  return {
    username: "user_" + id,
    email: "user_" + id + "@example.com",
    password: "pass_" + id,
  };
}

// Generate random string of given length
export function randomString(length) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Common response checks reusable across tests
export function commonChecks(res, name) {
  const prefix = name ? name + " " : "";
  return check(res, {
    [prefix + "status is 200"]: (r) => r.status === 200,
    [prefix + "body is not empty"]: (r) => r.body && r.body.length > 0,
    [prefix + "response time < 1s"]: (r) => r.timings.duration < 1000,
  });
}

// Build auth headers with a bearer token
export function authHeaders(token) {
  return {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  };
}

// Build JSON POST parameters
export function jsonParams() {
  return {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
}


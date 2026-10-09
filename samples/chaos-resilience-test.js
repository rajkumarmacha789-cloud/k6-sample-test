// samples/chaos-resilience-test.js — Resilience & Chaos Load Test
// Demonstrates: How system performance degrades under failure conditions
// Watch the Grafana dashboard to see the "aha moment" in real-time
//
// Phase 1: Normal traffic (baseline)
// Phase 2: Degraded service (injected latency)
// Phase 3: Service errors (500s)
// Phase 4: Recovery (back to normal)

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics for each phase
const normalDuration = new Trend('normal_duration');
const degradedDuration = new Trend('degraded_duration');
const errorDuration = new Trend('error_duration');
const recoveryDuration = new Trend('recovery_duration');
const errorCount = new Counter('chaos_errors');
const errorRate = new Rate('chaos_error_rate');

export const options = {
  scenarios: {
    // Phase 1: Normal traffic (0-30s)
    normal_traffic: {
      executor: 'constant-vus',
      vus: 20,
      duration: '30s',
      startTime: '0s',
      tags: { phase: 'normal' },
      env: { PHASE: 'normal' },
    },
    // Phase 2: Degraded service — 2s injected latency (30-60s)
    degraded_service: {
      executor: 'constant-vus',
      vus: 20,
      duration: '30s',
      startTime: '30s',
      tags: { phase: 'degraded' },
      env: { PHASE: 'degraded' },
    },
    // Phase 3: Service errors — 50% 500s (60-90s)
    service_errors: {
      executor: 'constant-vus',
      vus: 20,
      duration: '30s',
      startTime: '60s',
      tags: { phase: 'errors' },
      env: { PHASE: 'errors' },
    },
    // Phase 4: Recovery — back to normal (90-120s)
    recovery: {
      executor: 'constant-vus',
      vus: 20,
      duration: '30s',
      startTime: '90s',
      tags: { phase: 'recovery' },
      env: { PHASE: 'recovery' },
    },
  },
  thresholds: {
    'normal_duration': ['p95<500'],
    'degraded_duration': ['p95<5000'],
    'chaos_error_rate': ['rate<0.6'],
  },
};

export default function () {
  const phase = __ENV.PHASE || 'normal';
  let url, res;

  switch (phase) {
    case 'normal':
      // Fast endpoint — baseline performance
      url = 'https://httpbin.org/get';
      res = http.get(url, { timeout: '10s' });
      normalDuration.add(res.timings.duration);
      break;

    case 'degraded':
      // Slow endpoint — simulates database/service latency
      url = 'https://httpbin.org/delay/2';
      res = http.get(url, { timeout: '10s' });
      degradedDuration.add(res.timings.duration);
      break;

    case 'errors':
      // Error endpoint — simulates service failures
      url = 'https://httpbin.org/status/500';
      res = http.get(url, { timeout: '10s' });
      errorDuration.add(res.timings.duration);
      if (res.status >= 500) {
        errorCount.add(1);
        errorRate.add(true);
      } else {
        errorRate.add(false);
      }
      break;

    case 'recovery':
      // Back to normal — system recovers
      url = 'https://httpbin.org/get';
      res = http.get(url, { timeout: '10s' });
      recoveryDuration.add(res.timings.duration);
      break;
  }

  check(res, {
    'status is not 5xx': (r) => r.status < 500,
  });

  sleep(1);
}

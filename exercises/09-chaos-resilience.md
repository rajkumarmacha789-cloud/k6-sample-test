# Exercise : Resilience & Chaos Load Testing

- Understand how system performance degrades under failure conditions
- Compare normal vs degraded response times in real-time
- Learn why resilience patterns (circuit breakers, timeouts, retries) matter

Normal load testing answers: "Can my system handle 100 users?"
Chaos load testing answers: "Can my system handle 100 users when a downstream service is slow or failing?"

```bash
k6-grafana
```

```bash
k6-grafana-run samples/chaos-resilience-test.js
```

Open the Grafana URL shown in the terminal. You will see:

- **Phase 1 (0-30s):** Normal traffic — response times ~200ms, 0% errors
- **Phase 2 (30-60s):** Degraded service — response times spike to 2-3s
- **Phase 3 (60-90s):** Service errors — 50% of requests fail with 500s
- **Phase 4 (90-120s):** Recovery — back to normal, response times drop

```bash
k6-html-report samples/chaos-resilience-test.js
```

Compare metrics across scenarios:

- What was the p95 response time during normal vs degraded?
- What was the error rate during the error injection phase?
- How quickly did the system recover?

Modify the test to add:

- **Timeout:** Abort requests that take > 3s
- **Circuit breaker:** Stop sending requests if error rate > 50%
- **Retry logic:** Retry failed requests once

```javascript
// Example: timeout
const res = http.get(url, { timeout: \"3s\" });

// Example: circuit breaker pattern
if (errorRate > 0.5) {
  console.log(\"Circuit breaker OPEN — skipping request\");
  sleep(5);
  return;
}
```

- You see the "aha moment" — performance degrades dramatically under failure
- You understand why resilience patterns are critical for production systems
- You can design load tests that simulate real-world failure scenarios

- Database goes slow during peak hours
- Third-party API starts returning 500s
- Network latency spikes between microservices
- DNS resolution becomes slow
- Connection pool exhaustion under load

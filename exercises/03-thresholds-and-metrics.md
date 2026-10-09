# Exercise 03: Thresholds and Custom Metrics

- Configure pass/fail thresholds for built-in metrics
- Create custom metrics: Rate, Trend, Counter, Gauge
- Understand `http_req_duration`, `http_reqs`, `http_req_failed`


Create `threshold-exercise.js`:
```javascript
import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 5,
  duration: "20s",
  thresholds: {
    http_req_duration: ["p(95)<500", "avg<300"],
    http_req_failed: ["rate<0.01"],
    http_reqs: ["rate>5"],
  },
};

export default function () {
  http.get("https://test-api.k6.io/public/crocodiles/");
  sleep(0.5);
}
```

```bash
k6 run threshold-exercise.js
```
Look for ✓ (pass) or ✗ (fail) next to each threshold in the output.

```javascript
import { Rate, Trend, Counter, Gauge } from "k6/metrics";

const errorRate = new Rate("custom_errors");     // Percentage
const latency = new Trend("custom_latency");     // Distribution
const reqCount = new Counter("custom_requests"); // Running total
const vuGauge = new Gauge("custom_vus");         // Current value
```
Record values in your default function:
```javascript
errorRate.add(res.status !== 200);
latency.add(res.timings.duration);
reqCount.add(1);
vuGauge.add(__VU);
```

```javascript
thresholds: {
  custom_errors: ["rate<0.05"],
  custom_latency: ["p(95)<400"],
  custom_requests: ["count>50"],
}
```

- Threshold results showing pass/fail for each metric
- Custom metrics appearing in the k6 summary output

- You can set pass/fail criteria with thresholds
- You understand the four custom metric types (Rate, Trend, Counter, Gauge)
- You can combine built-in and custom metric thresholds


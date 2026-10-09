# Exercise 04: Advanced Scenarios and Executors

- Use k6 scenarios to run multiple workloads in parallel
- Understand executor types: constant-vus, ramping-vus, per-vu-iterations, shared-iterations


Create `scenarios-test.js`:
```javascript
import http from "k6/http";
import { sleep } from "k6";

export const options = {
  scenarios: {
    constant_load: {
      executor: "constant-vus",
      vus: 5,
      duration: "20s",
      exec: "browseAPI",
    },
    ramp_load: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "10s", target: 10 },
        { duration: "10s", target: 0 },
      ],
      exec: "browseAPI",
    },
  },
};

export function browseAPI() {
  http.get("https://test-api.k6.io/public/crocodiles/");
  sleep(1);
}
```

```bash
k6 run scenarios-test.js
```

Add these scenarios to your options:
```javascript
fixed_iterations: {
  executor: "per-vu-iterations",
  vus: 3,
  iterations: 5,       // Each VU runs exactly 5 iterations
  exec: "browseAPI",
},
shared_pool: {
  executor: "shared-iterations",
  vus: 5,
  iterations: 20,      // 20 iterations shared across 5 VUs
  exec: "browseAPI",
},
```

Run the test and compare how each executor distributes work differently.

- Each scenario runs independently with its own metrics
- k6 summary shows per-scenario breakdown

- You can define multiple scenarios in a single test
- You understand when to use each executor type
- You can model complex real-world traffic patterns


# Exercise 02: Stages and Ramping Patterns

- Define load profiles with stages
- Implement ramp-up and ramp-down patterns
- Understand spike, soak, and stress testing scenarios


Create `stages-test.js`:
```javascript
import http from "k6/http";
import { sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 5 },   // Ramp up
    { duration: "20s", target: 5 },   // Hold steady
    { duration: "10s", target: 0 },   // Ramp down
  ],
};

export default function () {
  http.get("https://test-api.k6.io/public/crocodiles/");
  sleep(1);
}
```

```bash
k6 run stages-test.js
```

Modify stages to simulate a sudden traffic spike:
```javascript
stages: [
  { duration: "5s", target: 5 },    // Normal load
  { duration: "5s", target: 50 },   // Spike!
  { duration: "10s", target: 50 },  // Hold spike
  { duration: "5s", target: 5 },    // Recover
  { duration: "5s", target: 0 },    // Ramp down
]
```

Design a long-running test to find memory leaks or degradation:
```javascript
stages: [
  { duration: "10s", target: 10 },   // Ramp up
  { duration: "2m", target: 10 },    // Sustained load
  { duration: "10s", target: 0 },    // Ramp down
]
```

- VU count changes over time matching your stage definitions
- Different response time patterns for each test type

- You can design load profiles with stages
- You understand the difference between spike, soak, and stress tests
- You can control VU ramp-up and ramp-down patterns


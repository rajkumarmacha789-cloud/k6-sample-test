# Exercise 01: Basic HTTP Testing with k6

- Run your first k6 load test
- Understand Virtual Users (VUs) and iterations
- Use `check()` to validate HTTP responses
- Use `sleep()` for pacing between requests

- k6 installed (verify with `k6 version`)


Create a file called `basic-test.js`:
```javascript
import http from "k6/http";
import { check, sleep } from "k6";

export default function () {
  const res = http.get("https://test-api.k6.io/public/crocodiles/");
  check(res, {
    "status is 200": (r) => r.status === 200,
  });
  sleep(1);
}
```

```bash
k6 run basic-test.js
```

```bash
k6 run --vus 5 --duration 10s basic-test.js
```

Modify your script to add checks for response body and timing:
```javascript
check(res, {
  "status is 200": (r) => r.status === 200,
  "body contains data": (r) => r.body.length > 2,
  "response time < 500ms": (r) => r.timings.duration < 500,
});
```

You should see k6 summary output showing:
- Number of VUs and iterations completed
- HTTP request metrics (duration, waiting, sending, receiving)
- Check pass/fail counts

- You can create and run a basic k6 test script
- You understand how VUs simulate concurrent users
- You can validate responses with `check()`
- You understand `sleep()` controls pacing between iterations


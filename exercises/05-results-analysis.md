# Exercise 05: Results Analysis

- Export k6 results to JSON format
- Parse JSON output with jq
- Generate an HTML report from test results
- Interpret k6 summary statistics


```bash
mkdir -p results
k6 run --out json=results/output.json samples/http-load-test.js
```

Extract HTTP request durations:
```bash
cat results/output.json | jq -r "select(.type==\"Point\" and .metric==\"http_req_duration\") | .data.value" | head -20
```

Count total data points:
```bash
cat results/output.json | jq -s "length"
```

Get unique metric names:
```bash
cat results/output.json | jq -r ".metric // empty" | sort -u
```

Use the `k6-report` helper command:
```bash
k6-report results/output.json
```
This creates an HTML file in the `results/` directory.

Key metrics to analyze:
- **http_req_duration**: avg, min, med, max, p(90), p(95)
- **http_reqs**: total count and rate (requests/second)
- **http_req_failed**: percentage of failed requests
- **iterations**: total completed iterations
- **vus_max**: peak concurrent virtual users

Run the same test twice with different VU counts and compare:
```bash
k6 run --vus 5 --duration 10s --out json=results/run1.json samples/http-load-test.js
k6 run --vus 20 --duration 10s --out json=results/run2.json samples/http-load-test.js
```

- JSON file with detailed per-request metrics
- jq queries returning filtered metric data
- HTML report file in the results directory

- You can export and parse k6 JSON output
- You can use jq to extract specific metrics
- You can generate reports for sharing results
- You can interpret k6 summary statistics for performance analysis


# k6 + Grafana Performance Testing — Learning Path

A hands-on, step-by-step path to mastering load testing with **k6** and
real-time monitoring with **Grafana + InfluxDB**.

---

## Prerequisites

| Tool | Version | Purpose |
| :--- | :--- | :--- |
| k6 | Latest | Load & performance testing |
| Grafana | Latest | Real-time dashboards |
| InfluxDB | 1.8 | Time-series metrics storage |
| Docker | Latest | Run the Grafana + InfluxDB stack |

---

## Learning Path (Full Onboarding)

Work through the exercises in order. Each builds on the previous one.

| # | Exercise | What you learn |
| :--- | :--- | :--- |
| 01 | [Basic HTTP Testing](exercises/01-basic-http-testing.md) | VUs, iterations, `check()`, `sleep()` |
| 02 | [Stages & Ramping](exercises/02-stages-and-ramping.md) | Ramp-up/hold/ramp-down load profiles |
| 03 | [Thresholds & Metrics](exercises/03-thresholds-and-metrics.md) | Pass/fail criteria, custom metrics |
| 04 | [Advanced Scenarios](exercises/04-advanced-scenarios.md) | Parallel executors, multi-scenario tests |
| 05 | [Results Analysis](exercises/05-results-analysis.md) | JSON output, HTML/Allure reports |
| 06 | [Multi-Protocol Testing](exercises/06-multi-protocol-testing.md) | WebSocket, gRPC |
| 07 | [CI/CD Integration](exercises/07-ci-cd-integration.md) | GitHub Actions, Jenkins, Azure Pipelines |
| 08 | [Grafana Dashboards](exercises/08-grafana-dashboards.md) | Real-time metrics visualization |
| 09 | [Chaos & Resilience](exercises/09-chaos-resilience.md) | Failure injection & recovery |

---

## Quick Start

```bash
# 1. Run a simple load test
k6 run samples/http-load-test.js

# 2. Start the Grafana + InfluxDB stack
docker compose -f grafana/docker-compose.yml up -d

# 3. Stream metrics to InfluxDB and watch them live in Grafana
k6 run --out influxdb=http://localhost:8086/k6 samples/http-load-test.js
```

Open Grafana at http://localhost:3000 (admin / admin) → **k6 Load Testing Dashboard**.

---

## Repository Layout

```
k6-test-sample/
├── exercises/          # 09 step-by-step tutorials (the learning path)
├── samples/            # Ready-to-run k6 scripts
│   └── lib/            # Shared helpers
├── configs/            # Environment configs (dev/staging/production)
├── grafana/            # Monitoring stack
│   ├── docker-compose.yml
│   ├── provisioning/   # Auto-provisioned datasource + dashboard
│   └── dashboards/     # k6 Load Testing Dashboard JSON
├── .github/workflows/  # CI/CD pipeline (k6.yml)
└── Mastery.md          # Engineering standards & AI assistant rules
```

---

## Run Tests

```bash
# Default (script options apply)
k6 run samples/http-load-test.js

# Override load via CLI
k6 run --vus 50 --duration 60s samples/api-stress-test.js

# Environment-specific run
k6 run -e BASE_URL=https://staging.example.com samples/api-stress-test.js

# Validate a script without running
k6 inspect samples/http-load-test.js
```

---

## The k6 → InfluxDB → Grafana Pipeline

```
k6 (load generator)
  └─ --out influxdb=http://localhost:8086/k6
      └─ InfluxDB (time-series store)
          └─ Grafana (query & visualize)
```

---

Read `Mastery.md` for engineering standards and the lab mastery checklist.

---

## Contributing

1. Create a branch for your changes.
2. Run `k6 inspect` to validate any script you edit.
3. Commit and push your changes for review.

*Happy Testing, Future Performance Engineer!*

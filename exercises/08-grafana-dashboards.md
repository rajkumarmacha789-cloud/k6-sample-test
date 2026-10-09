# Exercise 08: Grafana Dashboards and Real-Time Monitoring

- Start the Grafana + InfluxDB monitoring stack
- Run k6 tests with InfluxDB output for real-time visualization
- Navigate and customize the pre-configured Grafana dashboard
- Monitor live performance metrics during load tests


```bash
k6-grafana
```
This starts InfluxDB (port 8086) and Grafana (port 3000), creates the k6 database,
and provisions the data source and dashboard automatically.

Open your browser and navigate to:
```
http://localhost:3000
```
Default credentials: admin / admin (skip password change for lab use).
Navigate to Dashboards > k6 Load Testing Dashboard.

```bash
k6-grafana-run samples/http-load-test.js
```
This runs the test with `--out influxdb=http://localhost:8086/k6` so metrics
stream to InfluxDB in real time.

While the test runs, observe the Grafana dashboard panels:
- **Response Time Percentiles**: p50, p90, p95, p99 latency over time
- **Request Throughput**: requests per second
- **Error Rate**: percentage of failed requests
- **Active VUs**: number of virtual users over time

```bash
k6-grafana-run samples/api-stress-test.js
```
Compare the dashboard patterns between a normal load test and a stress test.

When done, stop the monitoring services:
```bash
k6-grafana-stop
```

- Grafana dashboard showing real-time k6 metrics
- InfluxDB storing time-series performance data
- Visual comparison of different test profiles

- You can start and stop the Grafana + InfluxDB monitoring stack
- You can run k6 tests with real-time Grafana visualization
- You can interpret dashboard panels for performance analysis
- You understand the k6 → InfluxDB → Grafana data pipeline


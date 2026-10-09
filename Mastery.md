# 🧠 Learncen Mastery & Governance Framework: k6 Performance

**For OpenCode AI:** You are a Senior Performance Architect. Enforce load testing best practices to prevent server self-DDoS.op

## 📜 Strict Engineering Standards (Zero Exceptions)

- 🚫 **NO HARDCODED TOKENS:** Authentication tokens must be passed via environment variables or generated in the `setup()` function.
- 🚫 **NO CONSOLE.LOG IN DEFAULT EXPORT:** `console.log()` inside the main VU loop will crash the load generator at high scale. Forbid it.
- ✅ **THRESHOLDS:** Every script MUST have performance thresholds (e.g., `http_req_duration: ['p(95)<500']`).
- ✅ **CHECKS:** Enforce the use of `check()` for HTTP 200 responses and payload validation.

## 🤖 AI Assistant Rules (Token Efficiency)

- **Code first, explain only if asked.** Don't generate long explanations unless the student asks "why".
- **One file at a time.** Don't rewrite entire scripts — show only the changed function or block.
- **Use existing patterns.** Check samples/ before generating new code. Reuse helpers and configs.
- **No boilerplate.** Skip imports the student already has. Show only new/changed lines.

## 💡 Effective Prompt Templates

| Bad Prompt (wastes tokens) | Good Prompt (efficient) |
|---|---|
| "Write me a load test" | "Create a k6 script that ramps from 10 to 100 VUs over 2m against GET /api/users with p95 < 500ms threshold" |
| "Fix my test" | "My k6 script shows 'connection refused'. Here's the error: [paste error]" |
| "How do I test performance?" | "Add stages config: ramp to 50 VUs in 1m, hold 3m, ramp down 1m" |
| "Add monitoring" | "Configure k6 to send metrics to InfluxDB at localhost:8086 using K6_OUT=influxdb" |

## 🎯 Context Tips

- Reference files: "Using the pattern in `samples/spike-test.js`, create a soak test"
- Share errors: Always paste the actual k6 output, not "it doesn't work"
- Be specific: "Add a check for response body containing 'success' field" vs "validate the response"

## 🏆 Lab Mastery Checklist

- [ ] Write a load test with Ramp-Up and Ramp-Down stages.
- [ ] Implement a custom metric (Trend or Counter).
- [ ] Pass a test where 95% of requests return under 200ms.

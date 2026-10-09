# Exercise 07: CI/CD Integration

- Integrate k6 tests into GitHub Actions pipelines
- Integrate k6 tests into Jenkins declarative pipelines
- Integrate k6 tests into Azure DevOps pipelines
- Use threshold-based pass/fail for CI gates


Explore the pre-built CI/CD configuration samples:
```bash
ls samples/ci-configs/
cat samples/ci-configs/github-actions.yml
cat samples/ci-configs/Jenkinsfile
cat samples/ci-configs/azure-pipelines.yml
```

Copy the GitHub Actions workflow to your project:
```bash
mkdir -p .github/workflows
cp samples/ci-configs/github-actions.yml .github/workflows/k6-tests.yml
```
Key features:
- Installs k6 from the official APT repository
- Runs tests with JSON output capture
- Uploads results as build artifacts

Copy the Jenkinsfile to your project root:
```bash
cp samples/ci-configs/Jenkinsfile ./Jenkinsfile
```
Key features:
- Declarative pipeline syntax
- Threshold-based pass/fail (k6 exits non-zero on threshold failure)
- HTML report archiving

Copy the Azure Pipelines config:
```bash
cp samples/ci-configs/azure-pipelines.yml ./azure-pipelines.yml
```
Key features:
- Ubuntu latest agent pool
- Test results publishing
- Artifact upload for results

Create a test with strict thresholds for CI:
```javascript
export const options = {
  thresholds: {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.01"],
  },
};
```
k6 exits with code 99 when thresholds fail, which CI systems detect as a failure.

- CI/CD config files ready for your repository
- Understanding of threshold-based quality gates

- You can integrate k6 into GitHub Actions, Jenkins, and Azure DevOps
- You understand threshold-based CI/CD quality gates
- You can capture and archive k6 test results in CI pipelines


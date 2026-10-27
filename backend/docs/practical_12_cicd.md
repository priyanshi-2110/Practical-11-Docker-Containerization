# Practical 12: CI/CD Pipeline with GitHub Actions

## Course Objectives & Mapping
- **Practical:** 12
- **CO / PO:** CO5 / PO3, PO5
- **Objective:** Automate testing and deployment of the application using a Continuous Integration (CI) pipeline powered by GitHub Actions.

---

## Architecture Flow

```
                      git push / pull_request
                                 │
                                 ▼
                     GitHub Actions Trigger
                                 │
                                 ▼
         ┌────────────────────────────────────────────────┐
         │              CI Pipeline Workflow               │
         │          (.github/workflows/ci.yml)            │
         └───────────────────────┬────────────────────────┘
                                 │
                                 ▼
         ┌────────────────────────────────────────────────┐
         │            Job 1: Code Quality (Lint)          │
         │  - Environment: ubuntu-latest                  │
         │  - Checkout repository                         │
         │  - Setup Node.js 18                            │
         │  - npm install (frontend)                      │
         │  - npm run lint (ESLint)                       │
         └───────────────────────┬────────────────────────┘
                                 │
                                 │ (needs: [lint])
                                 ▼
         ┌────────────────────────────────────────────────┐
         │         Job 2: Build & Automated Tests         │
         │  - Environment: ubuntu-latest                  │
         │  - Checkout repository                         │
         │  - Setup Node.js 18                            │
         │  - npm install (backend)                       │
         │  - npm test (Jest & Supertest)                 │
         └───────────────────────┬────────────────────────┘
                                 │
                ┌────────────────┴────────────────┐
                ▼                                 ▼
        Pass (Exit Code 0)               Fail (Exit Code != 0)
        ┌───────────────┐                 ┌───────────────┐
        │  ✅ Green      │                 │   ❌ Red      │
        │   Checkmark   │                 │    Cross      │
        └───────────────┘                 └───────────────┘
```

---

## Theory & Key Analysis Questions

### 1. What is the difference between Continuous Integration and Continuous Deployment, and which one does this practical demonstrate?
- **Continuous Integration (CI):** The practice of automating the integration of code changes from multiple contributors into a single software project. Every push or pull request automatically triggers build and automated test suites (e.g., syntax checking, linting, unit tests, integration tests) to ensure that new code does not break existing functionality.
- **Continuous Deployment (CD):** The next phase after CI where every code change that passes all production-grade automated tests is automatically released into a staging or live production environment without manual human intervention.
- **Which one this practical demonstrates:** This practical primarily demonstrates **Continuous Integration (CI)**. It automates linting, dependency installation, and test suite execution on every commit/PR to validate software health and catch regressions before release.

### 2. Why does running tests automatically on every push catch problems earlier than testing manually before a release?
1. **Immediate Feedback Loop:** Developers receive actionable failure reports within minutes of pushing code while the changes and context are fresh in their minds.
2. **Granular Fault Localization:** Because tests run per commit, if a build fails, the fault is isolated to the few lines changed in that specific commit rather than hundreds of commits accumulated before a release.
3. **Eliminates Human Error:** Automated CI runs deterministically in a clean, reproducible runner environment (e.g. `ubuntu-latest`), eliminating "works on my machine" issues and missed manual test scenarios.
4. **Reduced Cost of Bug Fixes:** Catching a regression during the commit stage is orders of magnitude faster and cheaper than finding it in QA or after customer deployment.

### 3. What would happen to the pipeline if the test file path were incorrect? Would the workflow fail at the same step as a genuine test failure?
- **No, it would fail differently depending on configuration:**
  - If the test runner command is pointed to a non-existent file (e.g., `jest tests/wrong_name.js`), Jest will terminate immediately with a **Test Discovery Error** / **Pattern Match Failure** (`No tests found...`).
  - If Jest runs in default discovery mode without finding any tests, it exits with error code 1 (`Jest did not exit one or more tests` or `PASS/FAIL with no tests`), failing during discovery rather than assertion.
  - A genuine test failure occurs after the test file is successfully discovered and executed, but an assertion (e.g., `expect(res.statusCode).toBe(200)`) evaluates to false, producing a clear diff showing expected vs. received values.

---

## Implementation Details

### 1. Test Suite Configuration
Installed testing dependencies in `backend`:
```bash
npm install --save-dev jest supertest
```

Configured `package.json` test script:
```json
"scripts": {
  "start": "node server.js",
  "dev": "node server.js",
  "test": "jest --detectOpenHandles --forceExit"
}
```

### 2. Automated Test Suite (`backend/tests/task.test.js`)
Tests cover endpoint status, response structure, and error handling:
```javascript
const request = require("supertest");
const app = require("../server");

describe("CI/CD Pipeline Automated Tests - Practical 12", () => {
  test("GET /api/health returns 200 and health status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
  });

  test("GET /tasks returns 200", async () => {
    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/tasks returns 200", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.statusCode).toBe(200);
  });

  test("GET /unknown-route returns 404", async () => {
    const res = await request(app).get("/unknown-route");
    expect(res.statusCode).toBe(404);
  });
});
```

### 3. GitHub Actions Workflow (`.github/workflows/ci.yml`)
Includes multi-job architecture solving Supplementary Problems:
- **Job 1 (`lint`):** Runs ESLint on frontend code.
- **Job 2 (`build-and-test`):** Depends on `lint` (`needs: [lint]`), installs backend dependencies, and executes Jest test suites.
- **Triggers:** Push to `main` and Pull Requests targeting `main`.

---

## Lab Demonstration: Pass vs. Fail Cycle

### Demonstration Step 1: Deliberate Test Failure (Red ❌)
1. In `backend/tests/task.test.js`, alter the expected status code:
   ```javascript
   test("GET /tasks returns 200", async () => {
     const res = await request(app).get("/tasks");
     expect(res.statusCode).toBe(500); // Intentionally broken expectation
   });
   ```
2. Commit and push:
   ```bash
   git add backend/tests/task.test.js
   git commit -m "test: demonstrate failing CI pipeline"
   git push origin main
   ```
3. **Observed Output on GitHub Actions:**
   - The `lint` job passes.
   - The `build-and-test` job fails with:
     ```
     ● CI/CD Pipeline Automated Tests › GET /tasks returns 200
       Expected: 500
       Received: 200
     ```
   - Pipeline badge displays: **failing** (Red ❌).

### Demonstration Step 2: Fixing the Test (Green ✅)
1. Restore the assertion to `200`:
   ```javascript
   expect(res.statusCode).toBe(200);
   ```
2. Commit and push:
   ```bash
   git add backend/tests/task.test.js
   git commit -m "fix: correct status assertion to restore passing pipeline"
   git push origin main
   ```
3. **Observed Output on GitHub Actions:**
   - Both `lint` and `build-and-test` complete with exit code 0.
   - Pipeline badge displays: **passing** (Green ✅).

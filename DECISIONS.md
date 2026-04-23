# Decision Record (MVC First)

## Tech Stack

- **Node.js + Express + EJS**: Fastest way to deliver a complete form flow and dashboard (mobile‑friendly pages without a frontend build chain).
- **SQLite (better‑sqlite3)**: Zero external dependencies, simple queries, perfect for a local take‑home assignment.
- **Chart.js (CDN)**: Quickly implement a line chart for “sign‑ups over time” without extra bundling.

## Project Structure (MVC)

- **`js/src/models/`**: Database connection and schema (`db.js`).
- **`js/src/models/orm/`**: Internal **Repository** layer (`better‑sqlite3`) – called by Fluent Models; routes/controllers do not use `repos` directly.
- **`js/src/models/fluent/fluentModels.js`**: All Fluent Models implemented in a single file; `index.js` only re‑exports `createFluentModels`.
- **`js/src/controllers/`**:  
  - `onboardingController.js` (registration + vehicle)  
  - `analyticsController.js` (dashboard + `/api/campaigns`)  
  - `staticController.js` (root redirect, thank‑you page)
- **`js/src/lib/dateQuery.js`**: Parses date ranges from `req.query`, reused by dashboard and API.
- **`js/src/routes/webRoutes.js`**: Single routing table; `createApp` only injects `fluent` into routes (does not expose `repos`).
- **`js/src/views/`**: EJS templates (View layer).
- **`js/src/app.js`**: Assembles Express (middleware, static files, template engine) and applies routes; it is the entry point for `createApp` in tests.
- **`js/src/server.js`**: Local startup entry – only calls `listen` (does not listen in test environment).

## Data Models & Metrics

- **campaign**: The `id` directly uses the value from `?ref=` (unknown refs are auto‑upserted, so the tracking link never fails due to a missing campaign entry).
- **total sign‑ups**: Counted when the driver submits the registration form (`drivers` table).
- **completed sign‑ups**: A driver is considered “completed” if they have at least one vehicle **and** that vehicle’s insurance is **not expired** (`insurance_expiry_date >= today`).
- **date range**: Filtering is based on the driver’s `created_at` (UTC ISO string, aggregated by day using `YYYY-MM-DD`).

## Trade‑offs

- No complex authentication / authorisation – the assignment focuses on onboarding and analytics MVC.
- No separate vehicle list page – the system still allows the same driver to submit `/vehicle` multiple times to register multiple vehicles (UI can be extended in future iterations).
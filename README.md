# Email Job Scheduler

A production-style batch email scheduler. Schedule thousands of emails to go out at a future time, spaced out per-sender, capped per hour, and completely resilient to server restarts. Includes a live queue dashboard, Elasticsearch search, and Google login.

## 📺 Demo Video
[**Link to Demo Video Here**] *(Upload your 5-minute Loom/YouTube video and place the link here)*

---

## 🛠️ How to Run the Backend (Express, Redis, Postgres, BullMQ Worker)

### Prerequisites
- Node.js 20+
- Docker Desktop

### 1. Start Infrastructure Services
Start Redis, Postgres, and Elasticsearch using Docker:
```bash
docker compose up -d
docker compose ps   # Wait until all three containers show healthy
```

### 2. Setup the Express API & Worker
In your first terminal, set up the database and start the API:
```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev        # Starts the Express API on port 4000
```

In a **second terminal**, start the BullMQ background worker (which processes the scheduled emails):
```bash
cd backend
npm run worker
```

---

## 💻 How to Run the Frontend (Next.js, Tailwind CSS)

In a **third terminal**, set up the frontend:
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev         # Starts the Next.js app on port 3000
```
Visit http://localhost:3000 in your browser to access the dashboard.

---

## 📧 Setting up Ethereal Email & Environment Variables

### Ethereal Email (Auto-configured)
The application uses **Ethereal Email** to sandbox all sent emails so you don't spam real inboxes during testing. 
The first time the backend or worker boots, it will **automatically generate** an Ethereal test account and cache it locally in `backend/.ethereal-account.json`. You do not need to sign up.

Watch your terminal console for a line like:
`[mailer] Created Ethereal account: xxxx@ethereal.email`

You can log in at https://ethereal.email/login with the cached credentials to view all "sent" emails, or simply click the preview URL printed in the terminal for every `sendMail` event.

### Environment Variables (.env)
If you want to pin a specific Ethereal account, you can manually set `ETHEREAL_USER` and `ETHEREAL_PASS` in your `backend/.env` file. 
Other required variables like `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (for OAuth login) must be filled in the `backend/.env` file.

---

## 🏛️ Architecture Overview

### How Scheduling Works (Zero Cron)
- `POST /emails/schedule` writes one `EmailBatch` row and one `Email` row per recipient to Postgres (with `status: scheduled`). The `scheduledTime` for each recipient is staggered based on the requested per-email delay.
- For each `Email` row, a **BullMQ delayed job** is added to the Redis queue with a deterministic job ID (`email-<email.id>`).
- The worker processes jobs purely via event-driven triggers when their Redis delay expires. There are **no polling cron jobs**.

### How Persistence on Restart is Handled
- BullMQ delayed jobs live in Redis and survive API/worker restarts automatically.
- To handle edge cases where the server crashes before a job is written to Redis, the worker runs a `reconcileScheduledEmails()` check on boot. It scans Postgres for `scheduled` emails and ensures a matching BullMQ job exists. Missing jobs are re-added.
- Because BullMQ enforces deterministic job IDs (`email-<db id>`), this reconciliation is highly idempotent. Duplicate additions are silently ignored.

### How Rate Limiting & Concurrency are Implemented
- **Concurrency**: Governed by the `WORKER_CONCURRENCY` env var, which limits parallel job processing.
- **Per-Sender Minimum Delay**: Enforced via a Redis `SET key NX PX <delay>` reservation. If a job for a sender fires too soon, it is rescheduled (`DelayedError`) without failing the job.
- **Hourly Limits**: Enforced using an atomic Redis Lua script (`INCR` + conditional `EXPIRE`). When an hourly limit is hit, the job is not dropped; it is automatically pushed to the start of the next hour block.

---

## 🚀 Features Implemented

### Backend
- **Scheduler**: BullMQ integration for delayed jobs (no polling).
- **Persistence**: Postgres DB for tracking email statuses (`scheduled`, `sent`, `failed`) with startup reconciliation.
- **Rate Limiting**: Atomic hourly limits (Redis Lua script) and per-sender delay spacing.
- **Concurrency**: Tunable `WORKER_CONCURRENCY` and retry logic (exponential backoff).
- **Search**: Elasticsearch indexing for fast multi-match queries across email contents.
- **Alerts**: Optional Slack OAuth integration for rate-limit warnings.

### Frontend
- **Login**: Google OAuth integration with secure HttpOnly JWT session cookies.
- **Dashboard**: Live tabs for `Scheduled` vs `Sent` emails with pagination and status badges.
- **Compose**: Advanced modal allowing copy-pasting emails or uploading a raw `.csv`.
- **UI/UX**: Premium modern dark mode redesign with glassmorphism aesthetics and animated transitions.
- **Queue Admin**: Integrated Bull Board at `/admin/queues` for live job monitoring.

---

## ⚖️ Assumptions, Shortcuts, & Trade-offs

1. **Shared Ethereal Sandbox**: The "Sender" is tied to the logged-in user's Google email, but all outbound mail routes through a single shared Ethereal test account. However, rate limits and delays are still correctly grouped by the user's Google email, making the multi-tenant logic fully valid and testable.
2. **Process-Global BullMQ Limiter**: True per-key (per-sender) rate limiting is a paid BullMQ Pro feature. To work around this using OSS BullMQ, the global `limiter` option is used as a baseline, and true per-sender spacing is enforced manually inside the worker using Redis locks and `DelayedError` reschedules.
3. **Client-Side CSV Parsing**: CSV parsing happens in the browser to provide immediate feedback on the recipient count before submission. The backend also supports raw CSV parsing as a fallback.
4. **Elasticsearch Security**: Elasticsearch runs with `xpack.security.enabled=false` purely for local development simplicity. This would require proper authentication in a production environment.

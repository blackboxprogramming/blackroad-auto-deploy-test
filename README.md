# BlackRoad Auto-Deploy

Production deployment pipeline for BlackRoad OS, Inc.

**Proprietary Software** — Copyright (c) 2024-2026 BlackRoad OS, Inc. All Rights Reserved.
See [LICENSE](LICENSE) for terms. This software is NOT open source.

---

## Architecture

```
GitHub (push to main/master)
  |
  v
Auto Deploy workflow
  ├── Build & Test (Next.js)
  ├── Deploy to Cloudflare Pages
  ├── Deploy Cloudflare Worker (health-monitor)
  ├── Deploy to Railway (optional)
  └── Health Check (POST-deploy verification)
```

## Workflows

| Workflow | Trigger | Purpose |
|---|---|---|
| **Auto Deploy** | Push to `main`/`master`, manual | Build, deploy to Cloudflare Pages + Worker, health check |
| **Security Scan** | Push, PR, weekly schedule | CodeQL analysis, dependency audit |
| **Self-Healing** | Every 30 min, post-deploy | Health monitoring, auto-rollback, issue creation |
| **Automerge** | Dependabot PRs | Auto-approve and merge patch/minor updates |

All GitHub Actions are pinned to specific commit hashes for supply-chain security.

## Cloudflare Worker

The `workers/health-monitor.ts` worker runs on a cron schedule (every 5 minutes) and provides:

- `GET /health` — Worker health status
- `GET /check` — Runs health check against the deployed application
- Scheduled monitoring with alert webhook support

## Setup

### Required Secrets

| Secret | Description |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Pages + Workers permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| `DEPLOY_URL` | Production URL for health checks (e.g., `https://app.example.com`) |
| `RAILWAY_TOKEN` | Railway deploy token (optional, if using Railway) |

### Required Repository Variables

| Variable | Description |
|---|---|
| `DEPLOY_TARGET` | Set to `railway` to enable Railway deployment (optional) |

### Local Development

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

## API Endpoints

- `GET /api/health` — Returns JSON health status with service info and commit SHA

```json
{
  "status": "healthy",
  "service": "blackroad-auto-deploy-test",
  "timestamp": "2026-03-05T00:00:00.000Z",
  "version": "<commit-sha>"
}
```

## Dependencies (Pinned)

- `next` — 14.2.29
- `react` — 18.3.1
- `react-dom` — 18.3.1
- `typescript` — 5.7.3

## Security

- All GitHub Actions pinned to commit hashes
- npm dependencies pinned to exact versions
- CodeQL analysis on every push and PR
- Dependency review on pull requests
- Weekly scheduled security scans
- Security headers configured via `next.config.mjs`
- Dependabot enabled for npm and GitHub Actions

## License

Proprietary — BlackRoad OS, Inc. All Rights Reserved.
Unauthorized use, copying, modification, or distribution is strictly prohibited.

/**
 * BlackRoad OS — Cloudflare Worker: Health Monitor
 * Handles long-running health checks, scheduled monitoring, and API routing.
 *
 * Copyright (c) 2024-2026 BlackRoad OS, Inc. All Rights Reserved.
 * Proprietary and Confidential.
 */

export interface Env {
  DEPLOY_URL: string
  ALERT_WEBHOOK_URL?: string
}

interface HealthResult {
  status: 'healthy' | 'degraded' | 'unhealthy'
  endpoint: string
  statusCode: number
  latencyMs: number
  timestamp: string
}

async function checkHealth(url: string): Promise<HealthResult> {
  const start = Date.now()
  try {
    const response = await fetch(`${url}/api/health`, {
      method: 'GET',
      headers: { 'User-Agent': 'BlackRoad-HealthMonitor/1.0' },
      signal: AbortSignal.timeout(10000),
    })
    const latencyMs = Date.now() - start
    let status: HealthResult['status'] = 'unhealthy'
    if (response.ok) {
      status = latencyMs < 2000 ? 'healthy' : 'degraded'
    }
    return {
      status,
      endpoint: url,
      statusCode: response.status,
      latencyMs,
      timestamp: new Date().toISOString(),
    }
  } catch {
    return {
      status: 'unhealthy',
      endpoint: url,
      statusCode: 0,
      latencyMs: Date.now() - start,
      timestamp: new Date().toISOString(),
    }
  }
}

async function sendAlert(env: Env, result: HealthResult): Promise<void> {
  if (!env.ALERT_WEBHOOK_URL) return
  await fetch(env.ALERT_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `[BlackRoad Health Alert] ${result.status.toUpperCase()}: ${result.endpoint} — HTTP ${result.statusCode} (${result.latencyMs}ms)`,
      result,
    }),
  }).catch(() => {})
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/health') {
      return Response.json({ status: 'healthy', worker: 'health-monitor', timestamp: new Date().toISOString() })
    }

    if (url.pathname === '/check' && env.DEPLOY_URL) {
      const result = await checkHealth(env.DEPLOY_URL)
      if (result.status !== 'healthy') {
        await sendAlert(env, result)
      }
      return Response.json(result, { status: result.status === 'healthy' ? 200 : 503 })
    }

    return Response.json({ error: 'Not found' }, { status: 404 })
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    if (!env.DEPLOY_URL) return
    const result = await checkHealth(env.DEPLOY_URL)
    if (result.status !== 'healthy') {
      ctx.waitUntil(sendAlert(env, result))
    }
  },
}

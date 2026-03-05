import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      service: 'blackroad-auto-deploy-test',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_COMMIT_SHA ?? 'unknown',
    },
    { status: 200 }
  )
}

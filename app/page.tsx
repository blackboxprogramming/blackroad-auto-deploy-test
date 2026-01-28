export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>🛣️ BlackRoad Auto-Deploy Test</h1>
      <p>Deployed: {new Date().toISOString()}</p>
      <p>✅ GitHub → Cloudflare pipeline working!</p>
    </main>
  )
}
// Test auto-push

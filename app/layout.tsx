import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BlackRoad OS',
  description: 'BlackRoad OS, Inc. — Production Deployment Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

'use client'

import { NotFoundPage } from '@/components/ui/404-page-not-found'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <NotFoundPage />
      </body>
    </html>
  )
} 
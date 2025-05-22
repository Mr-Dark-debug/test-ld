'use client'

import { useEffect } from 'react'
import { NotFoundPage } from '@/components/ui/404-page-not-found'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  // Use the 404 page for all errors to keep a consistent UI
  return <NotFoundPage />
} 
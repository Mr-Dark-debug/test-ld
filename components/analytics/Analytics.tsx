'use client'

import GoogleAnalytics from './GoogleAnalytics'
import MetaPixel from './MetaPixel'

export default function Analytics() {
  return (
    <>
      <GoogleAnalytics />
      <MetaPixel />
    </>
  )
}

// Re-export tracking functions for easy access
export { trackEvent, trackPageView } from './GoogleAnalytics'
export { 
  trackMetaEvent, 
  trackMetaConversion, 
  trackLead, 
  trackContact, 
  trackViewContent, 
  trackSearch 
} from './MetaPixel'

'use client'

import { useCallback } from 'react'
import { trackEvent, trackPageView } from '@/components/analytics/GoogleAnalytics'
import { 
  trackMetaEvent, 
  trackLead, 
  trackContact, 
  trackViewContent, 
  trackSearch 
} from '@/components/analytics/MetaPixel'

export const useAnalytics = () => {
  // Google Analytics tracking
  const trackGAEvent = useCallback((action: string, category: string, label?: string, value?: number) => {
    trackEvent(action, category, label, value)
  }, [])

  const trackGAPageView = useCallback((url: string) => {
    trackPageView(url)
  }, [])

  // Meta Pixel tracking
  const trackMetaCustomEvent = useCallback((eventName: string, parameters?: Record<string, any>) => {
    trackMetaEvent(eventName, parameters)
  }, [])

  // Combined tracking functions for common actions
  const trackProjectView = useCallback((projectName: string, projectType: string) => {
    // Track in both platforms
    trackGAEvent('view_project', 'engagement', projectName)
    trackViewContent(projectName, projectType)
  }, [trackGAEvent])

  const trackContactForm = useCallback((formType: string) => {
    // Track in both platforms
    trackGAEvent('contact_form_submit', 'lead_generation', formType)
    trackContact()
  }, [trackGAEvent])

  const trackBrochureDownload = useCallback((projectName: string) => {
    // Track in both platforms
    trackGAEvent('download_brochure', 'engagement', projectName)
    trackMetaCustomEvent('Download', { content_name: projectName, content_type: 'brochure' })
  }, [trackGAEvent, trackMetaCustomEvent])

  const trackPhoneCall = useCallback((source: string) => {
    // Track in both platforms
    trackGAEvent('phone_call', 'lead_generation', source)
    trackLead()
  }, [trackGAEvent])

  const trackSearchQuery = useCallback((query: string, resultsCount: number) => {
    // Track in both platforms
    trackGAEvent('search', 'engagement', query, resultsCount)
    trackSearch(query)
  }, [trackGAEvent])

  const trackPageVisit = useCallback((pageName: string, pageCategory?: string) => {
    // Track in both platforms
    trackGAEvent('page_view', 'navigation', pageName)
    trackViewContent(pageName, pageCategory)
  }, [trackGAEvent])

  const trackButtonClick = useCallback((buttonName: string, location: string) => {
    // Track in both platforms
    trackGAEvent('button_click', 'interaction', `${buttonName}_${location}`)
    trackMetaCustomEvent('ButtonClick', { button_name: buttonName, location })
  }, [trackGAEvent, trackMetaCustomEvent])

  return {
    // Google Analytics
    trackGAEvent,
    trackGAPageView,
    
    // Meta Pixel
    trackMetaCustomEvent,
    trackLead,
    trackContact,
    trackViewContent,
    trackSearch,
    
    // Combined tracking
    trackProjectView,
    trackContactForm,
    trackBrochureDownload,
    trackPhoneCall,
    trackSearchQuery,
    trackPageVisit,
    trackButtonClick,
  }
}

export default useAnalytics

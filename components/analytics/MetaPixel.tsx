'use client'

import Script from 'next/script'

const PIXEL_ID = '1438366387329732'

export default function MetaPixel() {
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img 
          height="1" 
          width="1" 
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}

// Helper function to track custom events
export const trackMetaEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters)
  }
}

// Helper function to track custom conversions
export const trackMetaConversion = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, parameters)
  }
}

// Common event tracking functions
export const trackLead = (value?: number, currency = 'INR') => {
  trackMetaEvent('Lead', { value, currency })
}

export const trackContact = () => {
  trackMetaEvent('Contact')
}

export const trackViewContent = (contentName: string, contentCategory?: string) => {
  trackMetaEvent('ViewContent', {
    content_name: contentName,
    content_category: contentCategory
  })
}

export const trackSearch = (searchTerm: string) => {
  trackMetaEvent('Search', {
    search_string: searchTerm
  })
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    fbq: (...args: any[]) => void
  }
}

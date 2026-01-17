/**
 * Analytics tracking utilities
 * Logs events to console in development, sends to analytics service in production
 */

export enum AnalyticsEvent {
  // Hero CTAs
  HERO_CTA_CLICK = "hero_cta_click",
  HERO_SECONDARY_CTA_CLICK = "hero_secondary_cta_click",

  // Consent
  AUTOAPPLY_CONSENT_GRANTED = "autoapply_consent_granted",
  AUTOAPPLY_CONSENT_DECLINED = "autoapply_consent_declined",

  // Demo interactions
  DEMO_SWIPE_LEFT = "demo_swipe_left",
  DEMO_SWIPE_RIGHT = "demo_swipe_right",
  ATS_SCORE_SEEN = "ats_score_seen",

  // Navigation
  NAV_FEATURES_CLICK = "nav_features_click",
  NAV_HOW_IT_WORKS_CLICK = "nav_how_it_works_click",
  NAV_PRICING_CLICK = "nav_pricing_click",
  NAV_SIGNIN_CLICK = "nav_signin_click",
  NAV_GET_STARTED_CLICK = "nav_get_started_click",

  // Footer
  FOOTER_CTA_CLICK = "footer_cta_click",

  // Page views
  PAGE_VIEW = "page_view",
}

export interface AnalyticsPayload {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Track an analytics event
 * In development, logs to console
 * In production, would send to analytics service
 */
export function trackEvent(event: AnalyticsEvent, payload?: AnalyticsPayload): void {
  const timestamp = new Date().toISOString();
  const eventData = {
    event,
    payload: payload || {},
    timestamp,
    url: typeof window !== "undefined" ? window.location.href : "",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
  };

  // Development logging
  if (process.env.NODE_ENV === "development") {
    console.log(`%c[Analytics] ${event}`, "color: #4f46e5; font-weight: bold;", eventData);
  }

  // Production: Send to analytics service
  // This would typically be Google Analytics, Mixpanel, Amplitude, etc.
  if (process.env.NODE_ENV === "production") {
    // Example: Google Analytics 4
    if (typeof window !== "undefined" && "gtag" in window) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", event, {
        ...payload,
        timestamp,
      });
    }

    // Example: Send to custom endpoint
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(eventData),
    // }).catch(() => {});
  }

  // Store in sessionStorage for debugging
  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem("analytics_events") || "[]";
      const events = JSON.parse(stored) as unknown[];
      events.push(eventData);
      // Keep only last 100 events
      if (events.length > 100) events.shift();
      sessionStorage.setItem("analytics_events", JSON.stringify(events));
    } catch {
      // Ignore storage errors
    }
  }
}

/**
 * Track page view
 */
export function trackPageView(page: string, locale?: string): void {
  trackEvent(AnalyticsEvent.PAGE_VIEW, {
    page,
    locale,
  });
}

/**
 * Get all tracked events from session (for debugging)
 */
export function getTrackedEvents(): unknown[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = sessionStorage.getItem("analytics_events") || "[]";
    return JSON.parse(stored) as unknown[];
  } catch {
    return [];
  }
}

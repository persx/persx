"use client";

import { useEffect, useState } from "react";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import CookieConsent from "./CookieConsent";
import GoogleTagManager from "./GoogleTagManager";

const GTM_ID = "GTM-MXBTBTTT";

export default function ConditionalAnalytics() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem("cookie-consent");
    if (consent === "all") {
      setAnalyticsEnabled(true);
    }
    setConsentChecked(true);
  }, []);

  const handleAccept = () => {
    setAnalyticsEnabled(true);
    // Push consent event to GTM dataLayer
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'cookie_consent_granted',
        consent_analytics: true
      });
    }
  };

  const handleReject = () => {
    setAnalyticsEnabled(false);
    // Push rejection event to GTM dataLayer
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'cookie_consent_denied',
        consent_analytics: false
      });
    }
  };

  return (
    <>
      {consentChecked && analyticsEnabled && (
        <>
          <GoogleTagManager gtmId={GTM_ID} />
          <Analytics />
          <SpeedInsights />
        </>
      )}
      <CookieConsent onAccept={handleAccept} onReject={handleReject} />
    </>
  );
}

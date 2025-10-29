"use client";

import { useEffect, useState } from "react";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import CookieConsent from "./CookieConsent";

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
  };

  const handleReject = () => {
    setAnalyticsEnabled(false);
  };

  return (
    <>
      {consentChecked && analyticsEnabled && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
      <CookieConsent onAccept={handleAccept} onReject={handleReject} />
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CookieConsentProps {
  onAccept: () => void;
  onReject: () => void;
}

export default function CookieConsent({ onAccept, onReject }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookie-consent", "all");
    setShowBanner(false);
    onAccept();
  };

  const handleRejectAll = () => {
    localStorage.setItem("cookie-consent", "necessary");
    setShowBanner(false);
    onReject();
  };

  const handleSavePreferences = (analytics: boolean) => {
    const consent = analytics ? "all" : "necessary";
    localStorage.setItem("cookie-consent", consent);
    setShowBanner(false);
    setShowPreferences(false);
    if (analytics) {
      onAccept();
    } else {
      onReject();
    }
  };

  if (!showBanner) return null;

  if (showPreferences) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Cookie Preferences
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We use cookies to enhance your browsing experience and analyze our traffic.
            Choose which cookies you want to allow.
          </p>

          <div className="space-y-4 mb-6">
            {/* Necessary Cookies */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Necessary Cookies
                </h3>
                <span className="px-3 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                  Always Active
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Essential for the website to function properly. These cannot be disabled.
              </p>
            </div>

            {/* Analytics Cookies */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Analytics Cookies
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="analytics-toggle"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Help us understand how visitors interact with our website by collecting and
                reporting information anonymously. Includes Google Tag Manager, Vercel Analytics,
                and Speed Insights.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                const analyticsEnabled = (document.getElementById("analytics-toggle") as HTMLInputElement)?.checked;
                handleSavePreferences(analyticsEnabled);
              }}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Save Preferences
            </button>
            <button
              onClick={() => setShowPreferences(false)}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-2xl">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
              🍪 We Value Your Privacy
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We use cookies to enhance your browsing experience, analyze site traffic, and
              personalize content. By clicking "Accept All", you consent to our use of cookies.
              Read our{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              {" "}for more information.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={handleRejectAll}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center"
            >
              Reject All
            </button>
            <button
              onClick={() => setShowPreferences(true)}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center"
            >
              Customize
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

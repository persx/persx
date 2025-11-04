"use client";

import type { ContactFormBlock as ContactFormBlockType } from "@/types/content-blocks";
import { useState, useEffect, FormEvent } from "react";

interface ContactFormBlockProps {
  block: ContactFormBlockType;
}

export default function ContactFormBlock({ block }: ContactFormBlockProps) {
  const { heading, subheading, reasons, personalization, formConfig } = block.data;
  const [userIndustry, setUserIndustry] = useState<string>("");
  const [displayContent, setDisplayContent] = useState({ headline: subheading || "", reasons });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    if (personalization?.enabled && personalization.industryVariants) {
      // Get industry from sessionStorage
      if (typeof window !== 'undefined') {
        const industry = sessionStorage.getItem('userIndustry') || "";
        setUserIndustry(industry);

        // Use industry-specific content if available
        if (industry && personalization.industryVariants[industry]) {
          setDisplayContent(personalization.industryVariants[industry]);
        } else {
          setDisplayContent({ headline: subheading || "", reasons });
        }
      }
    }
  }, [personalization, subheading, reasons]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      industry: userIndustry || "Not specified",
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {heading}
      </h1>
      {displayContent.headline && (
        <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          {displayContent.headline}
        </h2>
      )}

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Reasons To Contact Us */}
        <div className="space-y-6">
          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Reasons To Contact Us
            </h2>
            <ul className="space-y-6 !list-none !p-0 !m-0">
              {displayContent.reasons.map((reason, index) => (
                <li key={index} className="!list-none">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-base flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <div className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                      {typeof reason === 'string' ? reason : reason.title}
                    </div>
                  </div>
                  {typeof reason === 'object' && reason.description && (
                    <div className="ml-11 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {reason.description}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          {submitStatus === "success" && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-200 text-sm">
                {formConfig.successMessage}
              </p>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200 text-sm">
                {formConfig.errorMessage}
              </p>
            </div>
          )}

          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Send Us a Message
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {formConfig.nameField && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>
            )}

            {formConfig.emailField && (
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your.email@example.com"
                />
              </div>
            )}

            {formConfig.messageField && (
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your message..."
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : formConfig.submitText}
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Your privacy is important to us and we do not spam
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

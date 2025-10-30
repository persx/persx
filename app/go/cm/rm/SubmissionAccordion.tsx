"use client";

import { useState } from "react";
import type { RoadmapSubmission } from "@/lib/supabase";

interface SubmissionAccordionProps {
  submission: RoadmapSubmission;
}

export default function SubmissionAccordion({ submission }: SubmissionAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEnvironmentBadge = (env: string | null) => {
    if (env === "production") {
      return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
    }
    return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
  };

  const location = [submission.city, submission.region, submission.country]
    .filter(Boolean)
    .join(", ") || "Unknown";

  return (
    <div>
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center space-x-4 flex-1 text-left">
          {/* Chevron Icon */}
          <svg
            className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
              isOpen ? "transform rotate-90" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>

          {/* Date */}
          <div className="min-w-[140px]">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {formatDate(submission.created_at || "")}
            </p>
          </div>

          {/* Industry */}
          <div className="min-w-[150px]">
            <p className="text-sm text-gray-900 dark:text-white">
              {submission.industry}
              {submission.industry_other && (
                <span className="text-gray-500 dark:text-gray-400">
                  {" "}({submission.industry_other})
                </span>
              )}
            </p>
          </div>

          {/* Location */}
          <div className="min-w-[200px] hidden md:block">
            <p className="text-sm text-gray-600 dark:text-gray-400">{location}</p>
          </div>

          {/* Environment Badge */}
          <div>
            <span
              className={`inline-block px-2 py-1 text-xs rounded-full ${getEnvironmentBadge(
                submission.environment
              )}`}
            >
              {submission.environment || "unknown"}
            </span>
          </div>

          {/* Email Indicator */}
          {submission.email && (
            <div className="hidden lg:block">
              <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                ✉️ Contact
              </span>
            </div>
          )}
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="px-6 py-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Industry Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                  Industry
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {submission.industry}
                  {submission.industry_other && (
                    <span className="text-gray-500 dark:text-gray-400">
                      {" "}— {submission.industry_other}
                    </span>
                  )}
                </p>
              </div>

              {/* Goals Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                  Goals
                </h3>
                <ul className="space-y-1">
                  {submission.goals?.map((goal, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-700 dark:text-gray-300 flex items-start"
                    >
                      <span className="text-blue-500 mr-2">•</span>
                      {goal}
                    </li>
                  ))}
                  {submission.goal_other && (
                    <li className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {submission.goal_other}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        (Other)
                      </span>
                    </li>
                  )}
                </ul>
              </div>

              {/* MarTech Stack Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                  MarTech Stack
                </h3>
                <ul className="space-y-1">
                  {submission.martech_stack?.map((tech, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-700 dark:text-gray-300 flex items-start"
                    >
                      <span className="text-purple-500 mr-2">•</span>
                      {tech}
                      {submission.martech_tool_names?.[tech] && (
                        <span className="text-gray-500 dark:text-gray-400 ml-1">
                          — {submission.martech_tool_names[tech]}
                        </span>
                      )}
                    </li>
                  ))}
                  {submission.martech_other && (
                    <li className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      {submission.martech_other}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        (Other)
                      </span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Additional Details */}
              {submission.additional_details && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                    Additional Details
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {submission.additional_details}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {submission.email || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Full Roadmap Requested
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {submission.request_full_roadmap ? (
                        <span className="text-green-600 dark:text-green-400">✓ Yes</span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">✗ No</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Technical Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                  Technical Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Environment</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${getEnvironmentBadge(
                        submission.environment
                      )}`}
                    >
                      {submission.environment || "unknown"}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">IP Address</p>
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                      {submission.ip_address || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Submitted At</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(submission.created_at || "")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

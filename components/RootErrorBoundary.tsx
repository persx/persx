"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ReactNode } from "react";

/**
 * Root Error Boundary Wrapper
 * Client component that wraps the entire app in an error boundary
 */
export default function RootErrorBoundary({ children }: { children: ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}

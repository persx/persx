'use client'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Dark mode is now the default in CSS, no JavaScript needed
  return <>{children}</>
}

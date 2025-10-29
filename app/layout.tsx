import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "persx.ai - AI-Powered Solutions",
  description: "Discover the future of artificial intelligence with persx.ai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t py-6 md:py-8">
          <div className="container mx-auto px-4 md:px-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} persx.ai. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { signOut } from "next-auth/react";
import AdminNav from "./components/AdminNav";

export const metadata = {
  title: "Admin Panel - PersX.ai",
  description: "Content Management System",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/go");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/go/cm" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PersX.ai Admin
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {session.user?.email}
              </span>
              <Link
                href="/"
                target="_blank"
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                View Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <AdminNav />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

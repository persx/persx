import { createClient } from "@/lib/supabase-server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const supabase = createClient();

  // Extract first name from email
  const userEmail = session?.user?.email || "";
  const userName = userEmail.split("@")[0] || "User";

  // Get content counts
  const { count: roadmapCount } = await supabase
    .from("roadmap_submissions")
    .select("*", { count: "exact", head: true });

  // Get recent content
  const { data: recentContent } = await supabase
    .from("knowledge_base_content")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { label: "Roadmap Submissions", value: roadmapCount || 0, icon: "🗺️", color: "pink", link: "/go/cm/rm" },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      pink: "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
    };
    return colors[color] || colors.pink;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hello, {userName}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome to the PersX.ai Content Management System
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/go/cm/content/new?type=news"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-all flex items-center gap-2 font-medium"
          >
            <span>⚡</span>
            <span>Quick Add News</span>
          </Link>
          <Link
            href="/go/cm/content"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-all flex items-center gap-2 font-medium"
          >
            <span>+</span>
            <span>New Content</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => {
          if (stat.link) {
            return (
              <Link
                key={stat.label}
                href={stat.link}
                className="block"
              >
              <Card className="card-elevated hover:border-primary/50 transition-all hover:shadow-md cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`text-4xl p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
              </Link>
            );
          }

          return (
            <div key={stat.label} className="block">
              <Card className="card-elevated hover:border-primary/50 transition-all hover:shadow-md cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`text-4xl p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Recent Content */}
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Content</CardTitle>
              <CardDescription>Your latest published and draft content</CardDescription>
            </div>
            <Link
              href="/go/cm/content"
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              View All →
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {!recentContent || recentContent.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No content yet. Create your first piece of content to get started!
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentContent.map((content) => (
                <Link
                  key={content.id}
                  href={`/cm/content/${content.id}`}
                  className="block p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">
                        {content.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {content.excerpt || content.content.substring(0, 150)}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground ml-4 flex flex-col items-end gap-2">
                      <div>{formatDate(content.created_at)}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{content.content_type}</Badge>
                        <Badge variant={content.status === "published" ? "default" : "outline"}>
                          {content.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "From Data to Personas: How PersX.ai Turns Clickstreams into Actionable Segments",
      date: "Coming Soon",
      excerpt: "Explain the process of inferring personas from behavioral data and why behavior‑led segmentation drives more effective personalization than demographics alone.",
      category: "Personalization",
    },
    {
      id: 2,
      title: "Designing Cross‑Channel Journeys: Best Practices for Web, Mobile, and Email",
      date: "Coming Soon",
      excerpt: "Outline how PersX.ai creates cohesive journeys across multiple channels and the KPIs marketers should use to measure each stage of the funnel.",
      category: "Strategy",
    },
    {
      id: 3,
      title: "Experimentation at Scale: Building an 8‑Week Roadmap with PersX.ai",
      date: "Coming Soon",
      excerpt: "Walk readers through structuring a test plan, including hypothesis development, prioritization (P1 vs. P3), and how PersX.ai recommends experiments tailored to their business.",
      category: "Experimentation",
    },
    {
      id: 4,
      title: "Integrating PersX.ai with Your Tech Stack: When to Use an ODP vs. Direct CRM Connections",
      date: "Coming Soon",
      excerpt: "Compare integration options with case‑based recommendations, highlighting ease of implementation, data centralization, and scalability.",
      category: "Integration",
    },
    {
      id: 5,
      title: "Learning Loops: How to Turn Insights into Continuous Growth with PersX.ai",
      date: "Coming Soon",
      excerpt: "Describe the LEARN phase, focusing on measuring outcomes, iterating on findings, and ensuring long‑term improvements in conversion, AOV, or other key metrics.",
      category: "Growth",
    },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Blog
        </h1>
        <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Insights, tutorials, and updates from the PersX.ai team
        </h2>

        <div className="space-y-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  {post.category}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {post.date}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                {post.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {post.excerpt}
              </p>
              <span className="text-gray-500 dark:text-gray-500 font-semibold">
                Coming Soon
              </span>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

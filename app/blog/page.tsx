export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "Understanding AI in Modern Applications",
      date: "October 28, 2025",
      excerpt: "Explore how artificial intelligence is transforming the way we build and interact with modern applications.",
      category: "AI",
    },
    {
      id: 2,
      title: "The Future of Machine Learning",
      date: "October 25, 2025",
      excerpt: "Dive deep into the emerging trends and technologies shaping the future of machine learning and data science.",
      category: "Machine Learning",
    },
    {
      id: 3,
      title: "Building Scalable AI Systems",
      date: "October 22, 2025",
      excerpt: "Learn best practices for designing and implementing scalable AI systems that can handle enterprise workloads.",
      category: "Engineering",
    },
    {
      id: 4,
      title: "Ethics in Artificial Intelligence",
      date: "October 20, 2025",
      excerpt: "An important discussion on ethical considerations and responsible AI development practices.",
      category: "Ethics",
    },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Insights, tutorials, and updates from the persx.ai team
        </p>

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
              <button className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Read More →
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

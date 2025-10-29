export default function News() {
  const newsItems = [
    {
      id: 1,
      title: "persx.ai Raises $50M in Series B Funding",
      date: "October 29, 2025",
      content: "We're excited to announce our Series B funding round led by top venture capital firms, enabling us to expand our AI capabilities and reach more customers worldwide.",
    },
    {
      id: 2,
      title: "New AI Model Release: persx-GPT v2.0",
      date: "October 26, 2025",
      content: "Today we're launching persx-GPT v2.0, our most powerful language model yet, featuring improved accuracy, faster response times, and enhanced multilingual support.",
    },
    {
      id: 3,
      title: "Partnership with Leading Tech Companies",
      date: "October 23, 2025",
      content: "persx.ai announces strategic partnerships with Fortune 500 companies to integrate AI solutions into their enterprise workflows.",
    },
    {
      id: 4,
      title: "Opening New Research Lab in San Francisco",
      date: "October 18, 2025",
      content: "We're expanding our presence with a new state-of-the-art research facility focused on advancing AI safety and capability research.",
    },
    {
      id: 5,
      title: "persx.ai Wins 'Best AI Platform' Award",
      date: "October 15, 2025",
      content: "We're honored to receive the 'Best AI Platform' award at the Global Tech Innovation Summit 2025, recognizing our commitment to excellence.",
    },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          News
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Latest announcements and updates from persx.ai
        </p>

        <div className="space-y-6">
          {newsItems.map((item, index) => (
            <div
              key={item.id}
              className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 dark:text-gray-500 mb-2">
                    {item.date}
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-200">
            Stay Updated
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Subscribe to our newsletter to receive the latest news and updates directly in your inbox.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

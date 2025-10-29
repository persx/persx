export default function Home() {
  return (
    <div className="container mx-auto px-4 md:px-6">
      {/* Hero Section */}
      <section className="py-20 md:py-32 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome to persx.ai
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
          Revolutionizing the future with cutting-edge artificial intelligence solutions
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Get Started
          </button>
          <button className="px-8 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Learn More
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Choose persx.ai?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Experience unparalleled speed and performance with our optimized AI algorithms
            </p>
          </div>
          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Precision Accuracy</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Achieve exceptional results with our state-of-the-art machine learning models
            </p>
          </div>
          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your data is protected with enterprise-grade security and privacy measures
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto p-8 md:p-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Join thousands of companies already using persx.ai to power their AI initiatives
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Free Trial
          </button>
        </div>
      </section>
    </div>
  );
}

export default function Contact() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Contact Us
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Get in touch with our team - we'd love to hear from you
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                Get In Touch
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="text-2xl">📧</div>
                  <div>
                    <h3 className="font-semibold mb-1 text-gray-900 dark:text-gray-100">
                      Email
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      hello@persx.ai
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="text-2xl">📱</div>
                  <div>
                    <h3 className="font-semibold mb-1 text-gray-900 dark:text-gray-100">
                      Phone
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="text-2xl">📍</div>
                  <div>
                    <h3 className="font-semibold mb-1 text-gray-900 dark:text-gray-100">
                      Office
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      123 AI Boulevard<br />
                      San Francisco, CA 94105<br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="text-2xl">⏰</div>
                  <div>
                    <h3 className="font-semibold mb-1 text-gray-900 dark:text-gray-100">
                      Business Hours
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Monday - Friday: 9:00 AM - 6:00 PM PST<br />
                      Weekend: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Send Us a Message
            </h2>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Additional Info */}
        <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-200">
            Need Immediate Assistance?
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            For urgent inquiries or technical support, please reach out to our support team
            at support@persx.ai or call our 24/7 hotline at +1 (555) 999-0000
          </p>
        </div>
      </div>
    </div>
  );
}

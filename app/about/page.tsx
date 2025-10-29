export default function About() {
  const teamMembers = [
    { name: "Dr. Sarah Chen", role: "CEO & Co-Founder", emoji: "👩‍💼" },
    { name: "Michael Rodriguez", role: "CTO & Co-Founder", emoji: "👨‍💻" },
    { name: "Emily Watson", role: "Head of AI Research", emoji: "👩‍🔬" },
    { name: "James Park", role: "VP of Engineering", emoji: "👨‍🔧" },
  ];

  const values = [
    {
      title: "Innovation",
      description: "We constantly push the boundaries of what's possible with AI technology",
      icon: "💡",
    },
    {
      title: "Excellence",
      description: "We maintain the highest standards in everything we build and deliver",
      icon: "⭐",
    },
    {
      title: "Integrity",
      description: "We operate with transparency and ethical responsibility at our core",
      icon: "🤝",
    },
    {
      title: "Impact",
      description: "We focus on creating meaningful solutions that make a real difference",
      icon: "🎯",
    },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          About persx.ai
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Building the future of artificial intelligence
        </p>

        {/* Mission Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            At persx.ai, we're on a mission to democratize artificial intelligence and make
            cutting-edge AI technology accessible to organizations of all sizes. We believe
            that AI should empower people, not replace them, and our tools are designed to
            augment human capabilities and drive innovation.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Founded in 2023, we've grown from a small team of passionate AI researchers to
            a global company serving thousands of customers worldwide. Our commitment to
            excellence, ethical AI development, and customer success drives everything we do.
          </p>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-3">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
            Leadership Team
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow text-center"
              >
                <div className="text-6xl mb-4">{member.emoji}</div>
                <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-gray-100">
                  {member.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="p-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
          <p className="text-lg mb-6 opacity-90">
            We're always looking for talented individuals to join our team
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            View Open Positions
          </button>
        </section>
      </div>
    </div>
  );
}

import React from 'react';

const FeaturesSection: React.FC = () => {
  const features = [
    { title: 'AI-Powered Insights', description: 'Leverage cognitive neuroscience and data science to personalize learning.' },
    { title: 'Gamified Learning', description: 'Boost engagement with points, rewards, and interactive challenges.' },
    { title: 'Analytics Dashboard', description: 'Track progress and outcomes with real-time analytics.' },
    { title: 'Seamless Integration', description: 'Connect with existing educational tools and platforms effortlessly.' },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f, idx) => (
            <div key={idx} className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
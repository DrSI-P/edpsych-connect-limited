import React from 'react';
import Link from 'next/link';

const CtaSection: React.FC = () => {
  return (
    <section className="py-20 bg-indigo-600 text-white text-center">
      <h2 className="text-3xl font-bold mb-4">Ready to Transform Education?</h2>
      <p className="text-lg mb-8">
        Join schools and institutions worldwide using EdPsych Connect to revolutionize learning.
      </p>
      <Link
        href="/book-demo"
        className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
      >
        Get Started
      </Link>
    </section>
  );
};

export default CtaSection;
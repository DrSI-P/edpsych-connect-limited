import React from 'react';

const testimonials = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Director of Research, Stanford University',
    quote:
      'EdPsych Connect transformed our entire research workflow. What used to take weeks now happens in hours.',
  },
  {
    name: 'Prof. Michael Rodriguez',
    role: 'Department Chair, MIT',
    quote:
      'The AI agents are like having a team of expert research assistants available 24/7.',
  },
  {
    name: 'Dr. Emily Watson',
    role: 'VP of Academic Innovation, University of Toronto',
    quote:
      'Our student engagement metrics improved by 340% after implementing the Battle Royale system.',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-8">
          What Our Partners Say
        </h2>
        <p className="text-lg text-slate-600 mb-12">
          Real results from real institutions transforming education
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 hover:shadow-xl transition-all duration-300"
            >
              <p className="text-slate-700 italic mb-6">“{t.quote}”</p>
              <div className="font-semibold text-slate-900">{t.name}</div>
              <div className="text-slate-500 text-sm">{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
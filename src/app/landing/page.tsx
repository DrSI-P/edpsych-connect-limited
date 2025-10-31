// Transformed Landing Page - EdPsych Connect World
// Built by Dr Scott Hemingway, DEdPsych, CPsychol (HCPC Registered)
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FaChartLine, 
  FaUsers, 
  FaClock, 
  FaCheckCircle, 
  FaBrain,
  FaGamepad,
  FaChartBar,
  FaGraduationCap,
  FaAward,
  FaTrophy,
  FaArrowRight
} from 'react-icons/fa';

export default function EdPsychLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <FaBrain className="text-3xl text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">EdPsych Connect World</h1>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition">Features</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition">Pricing</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition">About</a>
              <Link href="/book-demo" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Book Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-6">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-blue-800">Built by a DEdPsych, CPsychol (HCPC Registered)</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                From 20 Days of EP Support to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  365 Days
                </span>
                {' '}of Intelligent SEND Solutions
              </h1>
              
              <p className="text-xl text-gray-600 mb-4">
                Comprehensive special educational needs support powered by 15+ years of educational psychology practice and 535+ researched capabilities.
              </p>
              
              <p className="text-lg text-gray-700 mb-8 font-medium">
                Designed for UK schools, built on evidence-based practice.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link 
                  href="/book-demo"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 text-center flex items-center justify-center"
                >
                  Book Your Demo
                  <FaArrowRight className="ml-2" />
                </Link>
                <a 
                  href="#roi-calculator"
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 text-center"
                >
                  Calculate Your Savings
                </a>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-black text-blue-600">535+</div>
                  <div className="text-sm text-gray-600">Researched Capabilities</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-purple-600">6</div>
                  <div className="text-sm text-gray-600">AI Agents</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-indigo-600">15+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
              </div>
            </div>

            {/* ROI Calculator Widget */}
            <div id="roi-calculator" className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FaChartLine className="mr-3 text-green-600" />
                ROI Calculator
              </h3>
              
              <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-3">Traditional EP Support</h4>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between">
                      <span>20 days @ £399/day</span>
                      <span className="font-bold">£7,980</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      • Limited to scheduled sessions<br/>
                      • Reactive intervention only<br/>
                      • Long waiting times
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-3">EdPsych Connect World</h4>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between">
                      <span>Annual subscription</span>
                      <span className="font-bold text-green-600">£4,500</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      • 365-day access for entire school<br/>
                      • Proactive + predictive support<br/>
                      • Instant insights & interventions
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 text-center">
                  <div className="text-sm font-medium mb-1">You Save</div>
                  <div className="text-4xl font-black mb-1">£3,480</div>
                  <div className="text-sm opacity-90">44% cost reduction + unlimited access</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Battle Royale Showcase */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <FaGamepad className="text-6xl mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Battle Royale Gamification</h2>
            <p className="text-xl opacity-90">The UK's first SEND-specific gamified learning system</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <FaTrophy className="text-4xl mb-4 text-yellow-300" />
              <h3 className="text-xl font-bold mb-2">Engaging for Students</h3>
              <p className="opacity-90">Points, badges, and leaderboards that make learning fun while tracking real progress</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <FaChartBar className="text-4xl mb-4 text-green-300" />
              <h3 className="text-xl font-bold mb-2">Powerful for Teachers</h3>
              <p className="opacity-90">Real-time differentiation and automatic EHCNA-aligned progress tracking</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <FaAward className="text-4xl mb-4 text-blue-300" />
              <h3 className="text-xl font-bold mb-2">Measurable for Leadership</h3>
              <p className="opacity-90">Evidence-based outcomes and intervention effectiveness metrics</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/book-demo"
              className="inline-block bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300"
            >
              See Battle Royale in Action
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Intelligence */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Platform Intelligence</h2>
            <p className="text-xl text-gray-600">Six specialized AI agents working seamlessly in the background</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Learning Path Optimizer',
                description: 'Continuously analyzes student data to adapt and personalize learning pathways in real-time',
                icon: FaBrain
              },
              {
                title: 'Intervention Designer',
                description: 'Creates evidence-based intervention strategies aligned with EHCNA requirements',
                icon: FaGraduationCap
              },
              {
                title: 'Progress Tracker',
                description: 'Monitors and predicts student outcomes using 535+ research-validated metrics',
                icon: FaChartLine
              },
              {
                title: 'Curriculum Differentiator',
                description: 'Automatically adjusts lesson content and difficulty for individual student needs',
                icon: FaUsers
              },
              {
                title: 'Assessment Generator',
                description: 'Produces personalized assessments that match student ability and learning goals',
                icon: FaCheckCircle
              },
              {
                title: 'Time Saver',
                description: 'Automates administrative tasks, saving teachers 47+ hours per month',
                icon: FaClock
              }
            ].map((agent, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                <agent.icon className="text-4xl text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{agent.title}</h3>
                <p className="text-gray-600">{agent.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your school's needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* School Tier - Small */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Small School</h3>
              <div className="text-sm text-gray-600 mb-4">Up to 500 students</div>
              <div className="text-5xl font-black text-blue-600 mb-6">
                £2,500
                <span className="text-lg font-normal text-gray-600">/year</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>535+ researched capabilities</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>6 AI agents</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Battle Royale gamification</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>EHCNA progress tracking</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Email support</span>
                </li>
              </ul>
              <Link 
                href="/book-demo"
                className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </div>

            {/* School Tier - Medium (FEATURED) */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl border-4 border-blue-600 transform scale-105">
              <div className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold inline-block mb-4">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Medium School</h3>
              <div className="text-sm text-white/80 mb-4">500-1,000 students</div>
              <div className="text-5xl font-black text-white mb-6">
                £4,500
                <span className="text-lg font-normal text-white/80">/year</span>
              </div>
              <ul className="space-y-3 mb-8 text-white">
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-300 mr-2 mt-1 flex-shrink-0" />
                  <span>Everything in Small School</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-300 mr-2 mt-1 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-300 mr-2 mt-1 flex-shrink-0" />
                  <span>Custom training sessions</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-300 mr-2 mt-1 flex-shrink-0" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-300 mr-2 mt-1 flex-shrink-0" />
                  <span>Quarterly reviews</span>
                </li>
              </ul>
              <Link 
                href="/book-demo"
                className="block w-full text-center bg-white text-blue-600 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                Get Started
              </Link>
            </div>

            {/* School Tier - Large */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Large School</h3>
              <div className="text-sm text-gray-600 mb-4">1,000+ students</div>
              <div className="text-5xl font-black text-purple-600 mb-6">
                £7,500
                <span className="text-lg font-normal text-gray-600">/year</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Everything in Medium School</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>On-site training</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>SLA guarantee</span>
                </li>
              </ul>
              <Link 
                href="/book-demo"
                className="block w-full text-center bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Additional Tiers */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Institutional Tier</h3>
              <p className="text-gray-700 mb-4">For MATs and Local Authorities with 10+ schools</p>
              <ul className="space-y-2 mb-6 text-gray-700">
                <li>• Volume discounts</li>
                <li>• Centralized management</li>
                <li>• Custom support packages</li>
              </ul>
              <Link 
                href="/contact"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
              >
                Contact Sales
              </Link>
            </div>

            <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Tier</h3>
              <p className="text-gray-700 mb-4">For individual EPs and SENCOs</p>
              <div className="text-3xl font-bold text-blue-600 mb-4">£299/year</div>
              <ul className="space-y-2 mb-6 text-gray-700">
                <li>• CPD tracking</li>
                <li>• Research library access</li>
                <li>• Professional networking</li>
              </ul>
              <Link 
                href="/book-demo"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">From the Founder</h2>
            <p className="text-xl text-gray-600">Built on 15+ years of frontline educational psychology practice</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-xl font-semibold text-gray-900 mb-4">
                I'm Dr Scott, a DEdPsych, CPsychol, and HCPC-registered Educational Psychologist with over 15 years of experience across multiple UK local authorities.
              </p>
              
              <p className="mb-4">
                Throughout my career, I witnessed the same challenges repeatedly: brilliant teachers overwhelmed by administrative burden, students with potential lost in one-size-fits-all systems, and schools struggling to provide the individualized support every child deserves.
              </p>
              
              <p className="mb-4">
                The traditional model was clear: schools pay £7,980+ for 20 days of EP support per year. That's reactive, limited, and often comes too late. What if we could make expert SEND support available 365 days a year, proactively identifying needs before they become crises?
              </p>
              
              <p className="mb-4">
                That question led to EdPsych Connect World—a platform that embodies everything I learned from 15 years in the field, enhanced by modern technology. Every one of our 535+ capabilities is grounded in research. Our Battle Royale gamification isn't just engaging—it's designed using cognitive neuroscience principles.
              </p>
              
              <p className="font-semibold text-gray-900">
                This isn't AI replacing human expertise. It's human expertise, refined over decades, made accessible to every school, every day.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-blue-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">Dr Scott Hemingway</div>
                  <div className="text-gray-600">DEdPsych, CPsychol (HCPC Registered)</div>
                  <div className="text-gray-600">Founder, EdPsych Connect World</div>
                </div>
                <div className="mt-4 md:mt-0">
                  <Link 
                    href="/book-demo"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                  >
                    Let's Talk
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your School's SEND Support?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join forward-thinking schools using EdPsych Connect World to provide better support for every student.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/book-demo"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300"
            >
              Book Your Demo
            </Link>
            <Link 
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">EdPsych Connect World</h3>
              <p className="text-sm">Transforming UK education through evidence-based SEND support.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><Link href="/book-demo" className="hover:text-white">Book Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-white">About</a></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} EdPsych Connect Limited. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Award,
  ArrowRight,
  Shield,
  Zap,
  Target,
  BookOpen,
  Heart,
  MessageCircle,
} from 'lucide-react';
import Navigation from './Navigation';
import HeroSection from './HeroSection';
import BattleRoyalePreview from '@/components/battle-royale/BattleRoyalePreview';
import FeaturesSection from './FeaturesSection';
import PricingSection from './PricingSection';
import TestimonialsSection from './TestimonialsSection';
import CtaSection from './CtaSection';
import Footer from './Footer';

/**
 * EdPsych Connect World - Market-Ready Landing Page
 * 
 * Authentic positioning: Human expertise refined over 15+ years,
 * made accessible to every UK school through intelligent technology.
 * 
 * Key messaging:
 * - NOT "AI replacing professionals"
 * - YES "Proven EP expertise, available daily"
 * - Invisible AI strategy (no AI mentions in UI)
 * - Battle Royale gamification as flagship differentiator
 */
export default function LandingPage() {
  const [showBattleRoyaleDemo, setShowBattleRoyaleDemo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection onTryBattleRoyale={() => setShowBattleRoyaleDemo(true)} />

      {/* Trust Indicators - Immediate credibility */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-slate-900">15+</div>
              <div className="text-sm text-slate-600">Years EP Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">535+</div>
              <div className="text-sm text-slate-600">Evidence-Based Tools</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">100%</div>
              <div className="text-sm text-slate-600">UK Curriculum Aligned</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">DEdPsych</div>
              <div className="text-sm text-slate-600">HCPC Registered</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem: Current State of SEND Support */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              UK Schools Face an Impossible Challenge
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Rising SEND needs, declining budgets, and exhausted staff. 
              Traditional Educational Psychology support costs £550-700 per day, 
              with weeks-long waiting lists.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-slate-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                SEND Needs Rising
              </h3>
              <p className="text-slate-600">
                25%+ of pupils now have identified SEND. Every teacher needs 
                specialist knowledge they don't have time to develop.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                EP Services Oversubscribed
              </h3>
              <p className="text-slate-600">
                £12,990-25,980 annual spend per school. Long wait times. 
                Limited capacity for preventative support.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Teacher Burnout Epidemic
              </h3>
              <p className="text-slate-600">
                SENCOs juggling impossible caseloads. Teachers improvising 
                interventions without specialist guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Battle Royale Showcase - Flagship Feature */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              World's First Educational Battle Royale
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Compete with Fortnite. Win Students Back to Learning.
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              AAA-game quality engagement meets differentiated learning. 
              Every student learns at their level while competing for glory.
            </p>
          </div>

          {/* Battle Royale Interactive Preview */}
          {showBattleRoyaleDemo ? (
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <BattleRoyalePreview />
            </div>
          ) : (
            <div 
              className="relative bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl shadow-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-300"
              onClick={() => setShowBattleRoyaleDemo(true)}
            >
              <div className="absolute inset-0 bg-[url('/battle-royale-preview.jpg')] bg-cover bg-center opacity-20"></div>
              <div className="relative z-10 p-12 text-center">
                <div className="text-6xl mb-6">🎮</div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  Click to Experience Battle Royale
                </h3>
                <p className="text-lg text-purple-200 mb-8 max-w-2xl mx-auto">
                  7 learning zones. Infinite differentiation. One winner. 
                  Watch engagement soar as students compete with curriculum-aligned challenges.
                </p>
                <button className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition-colors inline-flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Try Interactive Demo
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Battle Royale Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-xl border border-purple-200">
              <Target className="w-8 h-8 text-purple-600 mb-3" />
              <h4 className="font-semibold text-slate-900 mb-2">Adaptive Difficulty</h4>
              <p className="text-sm text-slate-600">
                Every student faces challenges at their perfect learning edge. 
                No more "too easy" or "too hard."
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-purple-200">
              <Award className="w-8 h-8 text-purple-600 mb-3" />
              <h4 className="font-semibold text-slate-900 mb-2">Real Stakes</h4>
              <p className="text-sm text-slate-600">
                Leaderboards, achievements, exclusive rewards. 
                Students actually want to practice their times tables.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-purple-200">
              <BookOpen className="w-8 h-8 text-purple-600 mb-3" />
              <h4 className="font-semibold text-slate-900 mb-2">Curriculum Aligned</h4>
              <p className="text-sm text-slate-600">
                100% UK National Curriculum coverage across all subjects and key stages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Story - Authentic Credibility */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Shield className="w-4 h-4" />
                Founded by Educational Psychologist
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Human Expertise, Refined Over Decades
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                Dr Scott Ighavongbe-Patrick (DEdPsych, CPsychol) spent 15+ years 
                as an educational psychologist across multiple UK local authorities. 
                Every recommendation in this platform is grounded in evidence-based 
                practice, refined through thousands of real-world interventions.
              </p>
              <p className="text-lg text-slate-600 mb-6">
                "I watched talented teachers burn out trying to meet impossible 
                demands. I saw brilliant students failed by one-size-fits-all 
                approaches. This platform delivers the specialist knowledge every 
                teacher needs—available instantly, adapted perfectly, without the 
                impossible wait times."
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div>✓ HCPC Registered</div>
                <div>✓ DEdPsych, Southampton</div>
                <div>✓ 15+ Years LA Experience</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">
                      535+ Evidence-Based Capabilities
                    </h4>
                    <p className="text-sm text-slate-600">
                      Every tool, intervention, and recommendation backed by 
                      peer-reviewed research and real-world effectiveness.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">
                      Designed for Real Schools
                    </h4>
                    <p className="text-sm text-slate-600">
                      Built by someone who understands the daily reality of UK 
                      classrooms, not Silicon Valley tech assumptions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">
                      Professional Standards
                    </h4>
                    <p className="text-sm text-slate-600">
                      HCPC Code of Conduct compliant. GDPR secure. 
                      Designed to support, never replace, human professionals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* ROI Calculator - Quantifiable Value */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              The Economics Are Compelling
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Traditional EP support: £550-700 per day. Schools spend £12,990-25,980 
              annually for limited access. EdPsych Connect World transforms that investment.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="text-center p-6 bg-red-50 rounded-xl">
                <div className="text-sm font-medium text-red-600 mb-2">Traditional EP Support</div>
                <div className="text-4xl font-bold text-slate-900 mb-2">£19,000</div>
                <div className="text-sm text-slate-600">Annual average (30 days @ £650/day)</div>
                <div className="mt-4 text-left text-sm text-slate-600 space-y-1">
                  <div>• Long waiting lists</div>
                  <div>• Limited preventative support</div>
                  <div>• Reactive interventions only</div>
                </div>
              </div>

              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="text-sm font-medium text-green-600 mb-2">EdPsych Connect World</div>
                <div className="text-4xl font-bold text-slate-900 mb-2">£5,000</div>
                <div className="text-sm text-slate-600">School Premium - Unlimited access</div>
                <div className="mt-4 text-left text-sm text-slate-600 space-y-1">
                  <div>• Instant specialist guidance</div>
                  <div>• Daily preventative support</div>
                  <div>• Every teacher empowered</div>
                </div>
              </div>
            </div>

            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                Save £14,000+ Annually
              </div>
              <p className="text-slate-600">
                Plus immeasurable value: teacher wellbeing, student outcomes, 
                proactive intervention, and daily specialist support for every SEND need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CtaSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Users, BookOpen, TrendingUp, ChevronRight, 
  CheckCircle2, Shield, Clock, Star, ArrowRight,
  Sparkles, Target, Award, Zap, Heart, MessageSquare
} from 'lucide-react';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [problemInput, setProblemInput] = useState('');

  // Real beta testing testimonials based on actual experience
  const testimonials = [
    {
      text: "During early testing, teachers reported spending 40% less time on SEND paperwork while providing more comprehensive support.",
      author: "Beta Testing Results",
      role: "Platform Validation Study",
      metric: "40% Time Saved"
    },
    {
      text: "Initial trials showed educators could generate differentiated lesson plans in under 3 minutes - work that previously took over an hour.",
      author: "Pilot Programme Feedback",
      role: "Teaching Efficiency Analysis",
      metric: "95% Faster"
    },
    {
      text: "Early adopters noted the platform's intelligent suggestions helped identify support strategies they hadn't previously considered.",
      author: "Development Testing Phase",
      role: "User Experience Research",
      metric: "Enhanced Discovery"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Thank you! We\'ll be in touch soon.');
    setEmail('');
    setTimeout(() => setMessage(''), 3000);
  };

  const capabilities = [
    { icon: Brain, title: "535+ Research-Based Capabilities", desc: "Evidence-based strategies from peer-reviewed educational psychology" },
    { icon: Users, title: "Comprehensive SEND Support", desc: "Tools for teachers, students, parents, and professionals" },
    { icon: BookOpen, title: "Instant Differentiation", desc: "Adaptive lesson plans and materials in minutes" },
    { icon: TrendingUp, title: "Real-Time Insights", desc: "Track progress and adapt support dynamically" }
  ];

  const features = [
    {
      icon: Target,
      title: "AI Problem Solver",
      description: "Get instant, evidence-based solutions for any SEND challenge",
      benefit: "Answers in seconds, not weeks"
    },
    {
      icon: BookOpen,
      title: "Lesson Differentiation",
      description: "Automatically adapt any lesson for diverse learning needs",
      benefit: "Every student engaged"
    },
    {
      icon: Award,
      title: "EHCNA Support",
      description: "Comprehensive tools for Education, Health & Care Needs Assessments",
      benefit: "Quality assurance built-in"
    },
    {
      icon: Zap,
      title: "Battle Royale Learning",
      description: "Gamified engagement that makes SEND support exciting",
      benefit: "85% increase in participation"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                EdPsych Connect
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors">Features</a>
              <a href="#pricing" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors">Pricing</a>
              <a href="#founder" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors">About</a>
              <a href="#waitlist" className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium">
                Join Waitlist
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Save £1-2M Annually • Multiply EP Effectiveness 4-5x
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Expert SEND Support{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  For Every School, Every Day
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Designed for Local Authorities facing impossible demands. Transform £2-8M annual EP spending into proactive, preventative support that reaches every school, every day—without the wait times.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a href="#la-roi" className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200 group">
                  See LA ROI Calculator
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#waitlist" className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold border-2 border-indigo-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200">
                  Book LA Demo
                </a>
              </div>
              
              <div className="flex items-center space-x-8 pt-4 border-t border-slate-200">
                <div>
                  <div className="text-3xl font-bold text-slate-900">78%</div>
                  <div className="text-sm text-slate-600">LAs Have EP Vacancies</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">4-5x</div>
                  <div className="text-sm text-slate-600">EP Effectiveness</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">£1.3M+</div>
                  <div className="text-sm text-slate-600">Average LA Savings</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 shadow-2xl border border-indigo-100">
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  Beta Access Available
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center">
                    <Target className="w-5 h-5 text-indigo-600 mr-2" />
                    Try the Problem Solver
                  </h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Describe your SEND challenge..."
                      value={problemInput}
                      onChange={(e) => setProblemInput(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-slate-900 placeholder-slate-400"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-lg hover:shadow-md transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Example: "How can I support a Year 7 student with ADHD during group work?"
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    "Evidence-based interventions",
                    "Differentiated strategies",
                    "Progress monitoring tools"
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="flex items-center space-x-3 bg-white rounded-xl p-3 shadow-sm"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* LA ROI Calculator Section */}
      <section id="la-roi" className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-white border border-green-200 rounded-full px-4 py-2 mb-4">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-900">
                For Local Authorities
              </span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              The Economics Are Compelling for LAs
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Traditional EP services cost £550-700 per day. Medium LAs spend £2-4M annually for reactive, crisis-driven support with 3-4 month waiting lists.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-5xl mx-auto border-2 border-green-100">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="text-center p-8 bg-red-50 rounded-2xl border-2 border-red-200">
                <div className="text-sm font-bold text-red-700 mb-3 uppercase tracking-wide">Current LA Model</div>
                <div className="text-5xl font-bold text-slate-900 mb-3">£2.25M</div>
                <div className="text-sm text-slate-600 mb-6">Annual spend (150 schools)</div>
                <div className="text-left space-y-2 text-sm text-slate-700">
                  <div className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>3-4 month waiting lists for assessments</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>78% chance of unfilled EP positions</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>Reactive crisis intervention only</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>Limited preventative support capacity</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>£550-850/day locum costs for vacancies</span>
                  </div>
                </div>
              </div>

              <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-300">
                <div className="text-sm font-bold text-green-700 mb-3 uppercase tracking-wide">EdPsych Connect Model</div>
                <div className="text-5xl font-bold text-slate-900 mb-3">£225K</div>
                <div className="text-sm text-slate-600 mb-6">Platform license (100-200 schools)</div>
                <div className="text-left space-y-2 text-sm text-slate-700">
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Instant specialist guidance 24/7</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Multiply existing EP effectiveness 4-5x</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Proactive early intervention for ALL schools</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>40% reduction in crisis assessments</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Frees EP time for complex statutory work</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center p-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white">
              <div className="text-3xl font-bold mb-3">
                Annual Savings: £2.025M+ (90% Cost Reduction)
              </div>
              <p className="text-lg opacity-95 mb-4">
                Plus immeasurable value: reduced crisis escalations, improved early intervention, 
                enhanced teacher wellbeing, and daily specialist support reaching every school
              </p>
              <div className="grid grid-cols-3 gap-4 mt-6 max-w-2xl mx-auto">
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">589%</div>
                  <div className="text-sm opacity-90">Year 1 ROI</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">40%</div>
                  <div className="text-sm opacity-90">Fewer Crises</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">4-5x</div>
                  <div className="text-sm opacity-90">EP Capacity</div>
                </div>
              </div>
            </div>
          </div>

          {/* LA Pricing Tiers */}
          <div className="mt-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">
              Local Authority Pricing Tiers
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-indigo-300 transition-all">
                <div className="text-sm font-semibold text-indigo-600 mb-2">TIER 1</div>
                <div className="text-3xl font-bold text-slate-900 mb-2">£125K</div>
                <div className="text-sm text-slate-600 mb-4">50-100 schools</div>
                <div className="text-sm text-slate-700">
                  Perfect for smaller LAs looking to transform their EP service delivery model
                </div>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-indigo-300">
                <div className="inline-block bg-amber-400 text-slate-900 px-3 py-1 rounded-full text-xs font-bold mb-2">
                  Most Popular
                </div>
                <div className="text-sm font-semibold text-indigo-600 mb-2">TIER 2</div>
                <div className="text-3xl font-bold text-slate-900 mb-2">£225K</div>
                <div className="text-sm text-slate-600 mb-4">100-200 schools</div>
                <div className="text-sm text-slate-700">
                  Ideal for medium LAs—complete transformation of SEND support delivery
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-indigo-300 transition-all">
                <div className="text-sm font-semibold text-indigo-600 mb-2">TIER 3</div>
                <div className="text-3xl font-bold text-slate-900 mb-2">£375K</div>
                <div className="text-sm text-slate-600 mb-4">200+ schools</div>
                <div className="text-sm text-slate-700">
                  Comprehensive solution for large LAs with extensive school networks
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything You Need for Exceptional SEND Support
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive tools backed by research and refined through real-world practice
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((capability, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-slate-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <capability.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{capability.title}</h3>
                <p className="text-slate-600 leading-relaxed">{capability.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Powerful Features, Seamlessly Integrated
            </h2>
            <p className="text-xl text-slate-600">
              Technology that enhances human connection, not replaces it
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-8 bg-white rounded-2xl shadow-lg border-2 border-slate-100 hover:border-indigo-300 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600 mb-3">{feature.description}</p>
                    <div className="inline-flex items-center text-sm font-semibold text-indigo-600">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      {feature.benefit}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section id="founder" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-full px-4 py-2">
                <Heart className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-900">
                  From Frontline Practice to Platform Innovation
                </span>
              </div>

              <h2 className="text-4xl font-bold text-slate-900">
                Built by an Educational Psychologist Who Understands
              </h2>

              <div className="prose prose-lg text-slate-600 space-y-4">
                <p className="leading-relaxed">
                  <strong className="text-slate-900">Dr Scott Ighavongbe-Patrick</strong> (DEdPsych, CPsychol, HCPC PYL042340) spent over a decade as an educational psychologist across multiple UK local authorities.
                </p>
                
                <p className="leading-relaxed italic text-indigo-900 font-medium">
                  "I watched talented teachers burn out trying to meet impossible demands. I saw brilliant students failed by one-size-fits-all approaches. This platform delivers the specialist knowledge every teacher needs—available instantly, adapted perfectly, without the impossible wait times."
                </p>

                <p className="leading-relaxed">
                  Every recommendation in this platform is grounded in evidence-based practice, refined through thousands of real-world interventions.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                  <div className="text-2xl font-bold text-indigo-900 mb-1">15+</div>
                  <div className="text-sm text-slate-600">Years in Practice</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                  <div className="text-2xl font-bold text-indigo-900 mb-1">1000s</div>
                  <div className="text-sm text-slate-600">Real Interventions</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-3xl shadow-xl border-2 border-slate-100"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Professional Background</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-semibold text-indigo-600 mb-2">Qualifications</div>
                  <div className="text-slate-700 leading-relaxed">
                    EdPsych BSc MBPsS | DEdPsych | CPsychol<br />
                    HCPC Registered Educational Psychologist (PYL042340)
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-indigo-600 mb-2">Current Role</div>
                  <div className="text-slate-700 leading-relaxed">
                    Managing Director, EdPsych Connect Limited<br />
                    Founder, EdPsych Connect Platform
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-indigo-600 mb-2">Experience</div>
                  <div className="text-slate-700 leading-relaxed">
                    Worked across multiple local authorities including Buckinghamshire Council and Achieving for Children, conducting comprehensive EHC Needs Assessments and developing evidence-based interventions for vulnerable learners.
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-indigo-600 mb-2">Research Focus</div>
                  <div className="text-slate-700 leading-relaxed">
                    Doctoral research on school exclusion and children's voices, examining how relationship breakdowns drive exclusion and how children desperately want to be heard and valued—directly informing the platform's design philosophy.
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-indigo-600 mb-2">Specializations</div>
                  <div className="space-y-1 text-slate-700">
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Comprehensive Needs Assessments with child voice at the centre</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Quality assurance of psychological advice</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Bespoke training programmes for educators</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Systemic consultation with SENCOs and school leadership</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Beta Testing Results */}
      <section className="py-20 bg-gradient-to-b from-indigo-50 to-purple-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Early Results from Development Testing
            </h2>
            <p className="text-xl text-slate-600">
              Real feedback from our platform validation studies
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonialIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-10 shadow-2xl border-2 border-indigo-100 relative"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  {testimonials[currentTestimonialIndex].metric}
                </div>
              </div>

              <MessageSquare className="w-12 h-12 text-indigo-300 mb-6" />
              
              <p className="text-xl text-slate-700 leading-relaxed mb-8">
                "{testimonials[currentTestimonialIndex].text}"
              </p>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">
                    {testimonials[currentTestimonialIndex].author}
                  </div>
                  <div className="text-sm text-slate-600">
                    {testimonials[currentTestimonialIndex].role}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentTestimonialIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentTestimonialIndex 
                          ? 'bg-indigo-600 w-8' 
                          : 'bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Pricing for Schools & MATs
            </h2>
            <p className="text-xl text-slate-600">
              Individual school licenses available—or ask your LA about authority-wide access
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Small School Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all"
            >
              <div className="text-sm font-semibold text-indigo-600 mb-2">SMALL SCHOOL</div>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                £4,500
                <span className="text-lg font-normal text-slate-600">/year</span>
              </div>
              <p className="text-slate-600 mb-6">Up to 500 students</p>
              
              <ul className="space-y-3 mb-8">
                {[
                  "535+ Evidence-Based Tools",
                  "EHCNA Support",
                  "Battle Royale Gamification",
                  "Progress Monitoring",
                  "Priority Email Support"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="text-xs text-slate-500 mb-4 p-3 bg-slate-50 rounded-lg">
                Replaces £13K-26K annual EP spend
              </div>
              
              <a href="#waitlist" className="block w-full py-3 text-center bg-slate-100 text-slate-900 rounded-xl font-semibold hover:bg-slate-200 transition-colors">
                Join Waitlist
              </a>
            </motion.div>

            {/* Medium School Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white relative shadow-2xl scale-105"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 px-4 py-1 rounded-full text-sm font-bold">
                Most Popular
              </div>
              
              <div className="text-sm font-semibold mb-2 opacity-90">MEDIUM SCHOOL</div>
              <div className="text-4xl font-bold mb-2">
                £7,500
                <span className="text-lg font-normal opacity-90">/year</span>
              </div>
              <p className="opacity-90 mb-6">500-1000 students</p>
              
              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Small School",
                  "Advanced Analytics Dashboard",
                  "Custom Training Modules",
                  "Dedicated Account Support",
                  "API Integration Access"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0 text-amber-300" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="text-xs mb-4 p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                Save £5.5K-18.5K vs traditional EP services
              </div>
              
              <a href="#waitlist" className="block w-full py-3 text-center bg-white text-indigo-600 rounded-xl font-semibold hover:shadow-lg transition-all">
                Join Waitlist
              </a>
            </motion.div>

            {/* Large School/MAT Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all"
            >
              <div className="text-sm font-semibold text-indigo-600 mb-2">LARGE SCHOOL / MAT</div>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                £12,500+
              </div>
              <p className="text-slate-600 mb-6">1000+ students / Multi-academy trusts</p>
              
              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Medium School",
                  "Unlimited User Seats",
                  "White-Label Options",
                  "Dedicated Success Manager",
                  "Custom Feature Development"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="text-xs text-slate-500 mb-4 p-3 bg-slate-50 rounded-lg">
                MAT pricing: £90K (10-20 schools) to £375K (50+ schools)
              </div>
              
              <a href="mailto:scott.ipatrick@edpsychconnect.com" className="block w-full py-3 text-center bg-slate-100 text-slate-900 rounded-xl font-semibold hover:bg-slate-200 transition-colors">
                Contact Sales
              </a>
            </motion.div>
          </div>

          {/* LA Info Banner */}
          <div className="mt-12 max-w-4xl mx-auto bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Are You a Local Authority?
            </h3>
            <p className="text-slate-700 mb-6">
              Get authority-wide access for 50-300 schools at £125K-£375K/year. 
              Save £1-2M annually while multiplying EP effectiveness.
            </p>
            <a href="#la-roi" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
              View LA Pricing & ROI Calculator
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="waitlist" className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join the Waitlist for Beta Access
            </h2>
            <p className="text-xl text-indigo-100 mb-10">
              Be among the first to experience the future of SEND support
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-6 py-4 rounded-xl border-2 border-transparent focus:border-white focus:ring-4 focus:ring-white/20 outline-none text-slate-900 placeholder-slate-400 shadow-lg"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:shadow-2xl transition-all duration-200 whitespace-nowrap"
                >
                  Join Waitlist
                </button>
              </div>
              
              <AnimatePresence>
                {message && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 text-white font-semibold bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30 shadow-lg"
                  >
                    {message}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>

            <div className="mt-12 flex items-center justify-center space-x-8 text-white/90">
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                <span className="text-sm">UK GDPR Compliant</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span className="text-sm">Launch Q1 2025</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-8 h-8 text-indigo-400" />
                <span className="text-xl font-bold">EdPsych Connect</span>
              </div>
              <p className="text-slate-400 text-sm">
                Transforming SEND support through evidence-based technology
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#demo" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#founder" className="hover:text-white transition-colors">About</a></li>
                <li><a href="mailto:scott.ipatrick@edpsychconnect.com" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            <p>© 2025 EdPsych Connect Limited. All rights reserved.</p>
            <p className="mt-2">Company Registration: [Number] | HCPC Registration: PYL042340</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
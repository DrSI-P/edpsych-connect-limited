import React from 'react';
import Navigation from './Navigation';
import HeroSection from './HeroSection';
import DemoSection from './DemoSection';
import FeaturesSection from './FeaturesSection';
import GamificationSection from './GamificationSection';
import TestimonialsSection from './TestimonialsSection';
import PricingSection from './PricingSection';
import CtaSection from './CtaSection';
import Footer from './Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-container">
      <Navigation />
      <HeroSection />
      <DemoSection />
      <FeaturesSection />
      <GamificationSection />
      <TestimonialsSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export { default as EnterpriseLanding } from './EnterpriseLanding';
export default LandingPage;
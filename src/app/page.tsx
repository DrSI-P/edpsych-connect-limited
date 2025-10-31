// Root landing page - imports the comprehensive landing page component
// This ensures clean routing: edpsych-connect-limited.vercel.app/ shows the full landing experience

import { Metadata } from 'next';
import LandingPage from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: 'EdPsych Connect World | Transform UK SEND Support',
  description: 'Proven educational psychology expertise, refined over 15+ years, now accessible to every UK school. Battle Royale gamification meets evidence-based SEND interventions.',
  keywords: [
    'UK SEND support',
    'educational psychology',
    'SENCO tools',
    'Battle Royale education',
    'EHC needs assessment',
    'CPD for teachers',
    'UK schools',
    'special educational needs',
    'inclusive education',
    'EdPsych services',
  ],
  openGraph: {
    title: 'EdPsych Connect World | Transform UK SEND Support',
    description: 'Human expertise, refined over decades, made accessible to every school, every day.',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EdPsych Connect World',
    description: 'Transform UK SEND support with proven educational psychology expertise.',
  },
};

export default function Home() {
  return <LandingPage />;
}
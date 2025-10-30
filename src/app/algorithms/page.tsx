'use client';
import React from 'react';
import RecommendationDashboard from '@/components/recommendations/RecommendationDashboard.tsx';

export default function AlgorithmsPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Algorithm Marketplace</h1>
      <RecommendationDashboard />
    </main>
  );
}
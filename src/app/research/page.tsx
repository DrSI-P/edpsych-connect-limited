'use client';
import React from 'react';
import ClinicalValidationShowcase from '@/components/research/ClinicalValidationShowcase';

export default function ResearchPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Research Foundation</h1>
      <ClinicalValidationShowcase />
    </main>
  );
}
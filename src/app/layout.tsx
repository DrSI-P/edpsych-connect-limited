'use client';
import React from 'react';
import Link from 'next/link';
import './globals.css';
import { AuthProvider } from '@/lib/auth/hooks';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#2a5298" />
      
      <meta
        name="content-security-policy"
        content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.vercel-insights.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self' https://vercel.live https://*.vercel.app https://*.edpsychconnect.com https://*.edpsychconnect.app;"
      /></head>
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <AuthProvider>
          <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">EdPsych Connect World</h1>
            <nav className="space-x-4">
              <Link href="/ai-agents">AI Agents</Link>
              <Link href="/gamification">Gamification</Link>
              <Link href="/institutional-management">Institutions</Link>
              <Link href="/analytics">Analytics</Link>
              <Link href="/research">Research</Link>
              <Link href="/algorithms">Algorithms</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/networking">Networking</Link>
              <Link href="/admin">Admin</Link>
              <Link href="/training">Training</Link>
              <Link href="/diagnostic">Diagnostic</Link>
            </nav>
          </header>
          <main className="p-6">{children}</main>
          <footer className="bg-gray-100 text-center py-4 mt-10 text-sm text-gray-600">
            © {new Date().getFullYear()} EdPsych Connect World. All rights reserved.
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
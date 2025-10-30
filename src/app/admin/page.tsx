'use client';
'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const AdminInterface = dynamic(() => import('@/components/admin/AdminInterface.component'), { ssr: false });

export default function AdminPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Administrative Dashboard</h1>
      <AdminInterface />
    </main>
  );
}
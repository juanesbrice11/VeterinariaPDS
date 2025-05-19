'use client';

import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Users"
          value="Loading..."
          icon={<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">👥</div>}
        />
        <DashboardCard
          title="Total Pets"
          value="Loading..."
          icon={<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-500">🐾</div>}
        />
        <DashboardCard
          title="Appointments Today"
          value="Loading..."
          icon={<div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-500">📅</div>}
        />
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function DashboardCard({ title, value, icon }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
} 
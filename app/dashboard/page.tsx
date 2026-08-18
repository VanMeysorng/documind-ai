'use client';

import { FileText, Scan, Star, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { name: 'Total Documents', value: '0', icon: FileText, color: 'bg-blue-500' },
  { name: 'Scanned Today', value: '0', icon: Scan, color: 'bg-green-500' },
  { name: 'Starred', value: '0', icon: Star, color: 'bg-yellow-500' },
  { name: 'AI Processed', value: '0', icon: TrendingUp, color: 'bg-purple-500' },
];

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your document overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <p className="text-sm text-gray-600">{stat.name}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/scanner"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <Scan className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900">Scan Document</h3>
            <p className="text-sm text-gray-600 mt-1">Scan a new document with your camera</p>
          </Link>

          <Link
            href="/upload"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <FileText className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-gray-900">Upload Files</h3>
            <p className="text-sm text-gray-600 mt-1">Upload PDF, images, or documents</p>
          </Link>

          <Link
            href="/ai-tools"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <TrendingUp className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-gray-900">AI Tools</h3>
            <p className="text-sm text-gray-600 mt-1">Use AI to analyze and organize</p>
          </Link>
        </div>
      </div>

      {/* Recent Documents */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Documents</h2>
          <Link href="/documents" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View all
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-8 text-center text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No documents yet</p>
            <p className="text-sm mt-1">Start by scanning or uploading your first document</p>
          </div>
        </div>
      </div>
    </div>
  );
}

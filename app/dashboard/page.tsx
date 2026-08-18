'use client';
import Link from 'next/link';
import { FileText, Scan, Star, TrendingUp, Upload } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome to your document overview</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { name: 'Total Documents', value: '0', icon: FileText, color: 'bg-blue-500' },
          { name: 'Scanned Today', value: '0', icon: Scan, color: 'bg-green-500' },
          { name: 'Starred', value: '0', icon: Star, color: 'bg-yellow-500' },
          { name: 'AI Processed', value: '0', icon: TrendingUp, color: 'bg-purple-500' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <p className="text-sm text-gray-700 font-medium">{stat.name}</p>
            </div>
          );
        })}
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/scanner" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <Scan className="w-7 h-7 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">Scan Document</h3>
          <p className="text-sm text-gray-600 mt-1">Scan with camera or upload</p>
        </Link>
        <Link href="/upload" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <Upload className="w-7 h-7 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">Upload Files</h3>
          <p className="text-sm text-gray-600 mt-1">Upload PDF or images</p>
        </Link>
        <Link href="/ai-tools" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp className="w-7 h-7 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">AI Tools</h3>
          <p className="text-sm text-gray-600 mt-1">Analyze with AI</p>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Documents</h2>
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-700 font-medium">No documents yet</p>
          <p className="text-sm text-gray-500 mt-1">Upload your first document to get started</p>
        </div>
      </div>
    </div>
  );
}

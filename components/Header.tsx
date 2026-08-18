'use client';

import { Bell, Search, Upload, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-10">
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => router.push('/scanner')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Scan</span>
        </button>

        <button
          onClick={() => router.push('/upload')}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Upload className="w-5 h-5" />
          <span>Upload</span>
        </button>

        <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}

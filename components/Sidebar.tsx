'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Scan, 
  FileText, 
  FolderOpen, 
  Share2, 
  PenTool, 
  Settings,
  Sparkles
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: Home, href: '/dashboard' },
  { name: 'Scanner', icon: Scan, href: '/scanner' },
  { name: 'Documents', icon: FileText, href: '/documents' },
  { name: 'AI Tools', icon: Sparkles, href: '/ai-tools' },
  { name: 'Folders', icon: FolderOpen, href: '/folders' },
  { name: 'Shared', icon: Share2, href: '/shared' },
  { name: 'Signatures', icon: PenTool, href: '/signatures' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">DocuMind AI</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-600">MV</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">MeysorngVan</p>
            <p className="text-xs text-gray-500">Free Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Home, Scan, FileText, FolderOpen, Share2, PenTool, Settings,
  TrendingUp, LogIn, UserPlus, LogOut, Upload
} from 'lucide-react';

const mainMenu = [
  { name: 'Dashboard', icon: Home, href: '/dashboard' },
  { name: 'Scanner', icon: Scan, href: '/scanner' },
  { name: 'Upload', icon: Upload, href: '/upload' },
  { name: 'Documents', icon: FileText, href: '/documents' },
  { name: 'AI Tools', icon: TrendingUp, href: '/ai-tools' },
];

const libraryMenu = [
  { name: 'Folders', icon: FolderOpen, href: '/folders' },
  { name: 'Shared', icon: Share2, href: '/shared' },
  { name: 'Signatures', icon: PenTool, href: '/signatures' },
];

const otherMenu = [
  { name: 'Settings', icon: Settings, href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col z-40">
      <div className="p-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">DocuMind AI</span>
        </Link>
      </div>

      <nav className="flex-1 py-6 overflow-y-auto">
        <p className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Main</p>
        <ul className="space-y-1 px-3 mb-8">
          {mainMenu.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link href={item.href} className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Library</p>
        <ul className="space-y-1 px-3 mb-8">
          {libraryMenu.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link href={item.href} className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Other</p>
        <ul className="space-y-1 px-3">
          {otherMenu.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link href={item.href} className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-100">
        {user ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link href="/register" className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              <UserPlus className="w-4 h-4" />
              <span className="font-medium">Create Account</span>
            </Link>
            <Link href="/login" className="flex items-center justify-center space-x-2 px-4 py-2.5 border border-gray-300 text-gray-800 rounded-xl hover:bg-gray-50 transition-colors">
              <LogIn className="w-4 h-4" />
              <span className="font-medium">Login</span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}

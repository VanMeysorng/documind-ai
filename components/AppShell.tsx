'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import OpenCvLoader from './OpenCvLoader';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = pathname !== '/login' && pathname !== '/register' && pathname !== '/';

  return (
    <>
      <OpenCvLoader />
      <div className="flex min-h-screen w-full bg-gray-50">
        {showSidebar && <Sidebar />}
        <main className={`flex-1 ${showSidebar ? 'ml-64' : ''}`}>
          {children}
        </main>
      </div>
    </>
  );
}

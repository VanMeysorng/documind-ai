import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'DocuMind AI - Document Scanner & Editor',
  description: 'AI-powered document scanner and editor',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

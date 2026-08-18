import Link from 'next/link';
import { FileText, Scan, Sparkles, PenTool, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 w-full">
      {/* Navbar - Centered container */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">DocuMind AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors">
              Login
            </Link>
            <Link href="/register" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero - Centered container with proper padding */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Smart Document
          <br />
          <span className="text-blue-600">Scanner & Editor</span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Transform physical documents into intelligent digital assets with AI
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
          <Link 
            href="/register" 
            className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors shadow-xl text-center"
          >
            Start Free Trial
          </Link>
          <Link 
            href="/dashboard" 
            className="w-full sm:w-auto px-10 py-4 bg-white text-gray-700 rounded-xl text-lg font-semibold border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors text-center"
          >
            View Dashboard
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { icon: Scan, title: 'Smart Scanning', desc: 'Auto-capture with edge detection', color: 'bg-blue-600 text-white' },
            { icon: Sparkles, title: 'AI-Powered OCR', desc: 'Extract text in 120+ languages', color: 'bg-purple-600 text-white' },
            { icon: PenTool, title: 'Digital Signatures', desc: 'Legally binding e-signatures', color: 'bg-green-600 text-white' },
            { icon: Shield, title: 'Secure Storage', desc: 'End-to-end encryption', color: 'bg-red-600 text-white' },
            { icon: Zap, title: 'Fast Processing', desc: 'Lightning-fast AI automation', color: 'bg-yellow-600 text-white' },
            { icon: FileText, title: 'Document Management', desc: 'Organize and search easily', color: 'bg-indigo-600 text-white' },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`${feature.color} p-3 rounded-xl w-fit mb-4 shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">{feature.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

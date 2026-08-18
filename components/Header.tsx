'use client';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">DocuMind AI</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Welcome back!</span>
          <button className="text-sm text-gray-600 hover:text-gray-900">Logout</button>
        </div>
      </div>
    </header>
  );
}

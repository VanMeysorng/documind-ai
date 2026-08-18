import { PenTool } from 'lucide-react';
export default function SignaturesPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Signatures</h1>
      <p className="text-gray-600 mb-8">Manage digital signatures</p>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
        <PenTool className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-700 font-medium">No signatures created</p>
      </div>
    </div>
  );
}

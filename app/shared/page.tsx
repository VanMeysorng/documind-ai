import { Share2 } from 'lucide-react';
export default function SharedPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Shared Documents</h1>
      <p className="text-gray-600 mb-8">Documents shared with you</p>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
        <Share2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-700 font-medium">No shared documents</p>
      </div>
    </div>
  );
}

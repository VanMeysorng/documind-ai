'use client';
import { useEffect, useState } from 'react';
import { FileText, Search, Trash2, Download } from 'lucide-react';
import Link from 'next/link';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchDocs = async () => {
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      setDocuments(Array.isArray(data) ? data : []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document?')) return;
    await fetch(`/api/documents/${id}`, { method: 'DELETE' });
    fetchDocs();
  };

  const filtered = documents.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents</h1>
          <p className="text-gray-600">Manage all your documents</p>
        </div>
        <Link href="/upload" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium">Upload New</Link>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">No documents</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filtered.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{doc.title}</p>
                    <p className="text-sm text-gray-500">{doc.type}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <a href={doc.fileUrl} download className="p-2 text-gray-400 hover:text-blue-600"><Download className="w-5 h-5" /></a>
                  <button onClick={() => handleDelete(doc.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

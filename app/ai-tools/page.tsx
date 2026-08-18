'use client';
import { useState } from 'react';
import { Sparkles, ScanText, Languages, Tags, FileSearch } from 'lucide-react';

export default function AIToolsPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const processAI = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/ocr', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      setResult(data.result || 'No result');
    } catch { alert('AI failed'); } finally { setLoading(false); }
  };

  const tools = [
    { title: 'OCR Text Extraction', desc: 'Extract text from scans', icon: ScanText, color: 'bg-blue-100 text-blue-600' },
    { title: 'Document Classification', desc: 'Auto-categorize docs', icon: FileSearch, color: 'bg-green-100 text-green-600' },
    { title: 'Translation', desc: '100+ languages', icon: Languages, color: 'bg-purple-100 text-purple-600' },
    { title: 'Smart Tagging', desc: 'AI tag suggestions', icon: Tags, color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Tools</h1>
      <p className="text-gray-600 mb-8">Use AI to analyze documents</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {tools.map(tool => {
          const Icon = tool.icon;
          return (
            <div key={tool.title} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className={`${tool.color} p-3 rounded-xl w-fit mb-4`}><Icon className="w-6 h-6" /></div>
              <h3 className="font-semibold text-gray-900">{tool.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{tool.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Document Analysis</h2>
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste text..."
          className="w-full h-40 p-4 border border-gray-300 rounded-xl text-gray-900 mb-4" />
        <button onClick={processAI} disabled={loading || !input}
          className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 font-medium">
          {loading ? 'Processing...' : 'Analyze'}
        </button>
        {result && <div className="mt-6 p-6 bg-gray-50 rounded-xl"><p className="text-gray-700 whitespace-pre-wrap">{result}</p></div>}
      </div>
    </div>
  );
}

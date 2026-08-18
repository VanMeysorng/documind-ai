'use client';
import { useState, useRef, useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    setUploading(true);
    setFileName(file.name);
    setFileSize((file.size / 1024 / 1024).toFixed(2));
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user.id || 'guest');

    try {
      const res = await fetch('/api/documents', { method: 'POST', body: formData });
      if (res.ok) {
        setUploaded(true);
        setTimeout(() => window.location.href = '/documents', 2000);
      } else {
        alert('Upload failed');
        setUploading(false);
      }
    } catch {
      alert('Error uploading');
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Document</h1>
      <p className="text-gray-600 mb-8">Upload PDF or image files</p>

      {/* Drop Zone */}
      <div
        className={`rounded-2xl border-4 border-dashed transition-all mb-6 ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : uploaded
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 bg-white hover:border-blue-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && !uploaded && fileInputRef.current?.click()}
        style={{
          minHeight: '350px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: uploading || uploaded ? 'default' : 'pointer',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
        />

        {uploading ? (
          <div className="text-center">
            <div className="animate-spin w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-800 font-semibold text-lg mb-1">Uploading...</p>
            <p className="text-gray-600 text-sm">{fileName} ({fileSize} MB)</p>
          </div>
        ) : uploaded ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-gray-800 font-semibold text-lg mb-1">Upload Complete!</p>
            <p className="text-gray-600 text-sm">{fileName}</p>
          </div>
        ) : (
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-600' : 'text-gray-500'}`} />
            </div>
            <p className="text-gray-800 font-semibold text-lg mb-1">
              {isDragging ? 'Drop it here!' : 'Drag & Drop Your File'}
            </p>
            <p className="text-gray-500 text-sm mb-4">or</p>
            <button
              type="button"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium text-sm"
            >
              Browse Files
            </button>
            <p className="text-gray-400 text-xs mt-4">PDF, PNG, JPG up to 10MB</p>
          </div>
        )}
      </div>

      {/* Supported File Types */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
          <FileText className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-xs font-medium text-gray-700">PDF</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
          <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-xs font-medium text-gray-700">DOC</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
          <FileText className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-xs font-medium text-gray-700">PNG</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
          <FileText className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="text-xs font-medium text-gray-700">JPG</p>
        </div>
      </div>
    </div>
  );
}

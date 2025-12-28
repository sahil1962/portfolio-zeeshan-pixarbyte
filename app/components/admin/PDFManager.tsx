// app/components/admin/PDFManager.tsx
'use client';

import { useState, useEffect, useRef } from 'react';

interface PDF {
  key: string;
  name: string;
  size: number;
  uploadedAt: string;
  url: string;
}

export default function PDFManager() {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  const fetchPDFs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pdfs/list');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setPdfs(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch PDFs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Prevent duplicate fetches in React Strict Mode (development)
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    fetchPDFs();
  }, []);

  const handleDelete = async (key: string) => {
    if (!confirm('Are you sure you want to delete this PDF?')) {
      return;
    }

    setDeleting(key);
    try {
      const response = await fetch(`/api/pdfs/delete?key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Refresh the list
        fetchPDFs();
      } else {
        alert('Failed to delete PDF');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete PDF');
    } finally {
      setDeleting(null);
    }
  };

  const handleDownload = async (key: string) => {
    try {
      const response = await fetch(`/api/pdfs/download?key=${encodeURIComponent(key)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Open the presigned URL in a new tab
        window.open(result.data.downloadUrl, '_blank');
      } else {
        alert('Failed to generate download URL');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download PDF');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Manage PDFs</h3>
        <button
          onClick={fetchPDFs}
          className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          Refresh
        </button>
      </div>

      {pdfs.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">No PDFs</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Upload your first PDF to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pdfs.map((pdf) => (
            <div
              key={pdf.key}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:shadow-md transition-shadow"
            >
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {pdf.name}
                </h4>
                <div className="mt-1 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span>{formatBytes(pdf.size)}</span>
                  <span>•</span>
                  <span>{formatDate(pdf.uploadedAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleDownload(pdf.key)}
                  className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(pdf.url)}
                  className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
                  title="Copy URL"
                >
                  Copy URL
                </button>
                <button
                  onClick={() => handleDelete(pdf.key)}
                  disabled={deleting === pdf.key}
                  className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deleting === pdf.key ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import PDFUpload from '@/app/components/admin/PDFUpload';
import PDFManager from '@/app/components/admin/PDFManager';

export default function AdminPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    // Trigger refresh of PDF manager by changing key
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/50 to-indigo-100/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Admin Panel
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Upload and manage your PDF publications
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div>
            <PDFUpload onUploadSuccess={handleUploadSuccess} />
          </div>

          {/* Manager Section */}
          <div>
            <PDFManager key={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
}

// app/admin/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PDFUpload from '@/app/components/admin/PDFUpload';
import PDFManager from '@/app/components/admin/PDFManager';
import { useAuth } from '@/app/hooks/useAuth';

export default function AdminPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { authenticated, loading, email, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authenticated) {
      router.push('/admin/login');
    }
  }, [authenticated, loading, router]);

  const handleUploadSuccess = () => {
    // Trigger refresh of PDF manager by changing key
    setRefreshKey(prev => prev + 1);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-orange-50/50 to-amber-100/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 dark:border-amber-400 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-orange-50/50 to-amber-100/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Admin Panel
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Upload and manage your PDF publications
            </p>
            {email && (
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                Logged in as: {email}
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Logout
          </button>
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

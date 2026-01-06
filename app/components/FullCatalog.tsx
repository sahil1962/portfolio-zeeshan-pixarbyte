// app/components/FullCatalog.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import NotesGrid from './NotesGrid';
import { Note } from './NotesMarketplace';

export default function FullCatalog() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate fetches in React Strict Mode (development)
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    fetchNotesFromR2();
  }, []);

  const fetchNotesFromR2 = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pdfs/list');
      const data = await response.json();

      if (data.success && data.data) {
        // Transform R2 data to Note format
        const transformedNotes: Note[] = data.data.map((pdf: {
          key: string;
          name: string;
          size: number;
          uploadedAt: string;
          url: string;
          title?: string;
          description?: string;
          price?: string;
          pages?: string;
          topics?: string;
        }) => ({
          id: pdf.key,
          title: pdf.title || pdf.name.replace('.pdf', ''),
          description: pdf.description || 'Premium study notes and educational material',
          topics: pdf.topics ? pdf.topics.split(',').map(t => t.trim()) : [],
          pages: parseInt(pdf.pages || '0'),
          price: parseFloat(pdf.price || '0'),
          preview: pdf.url,
          rating: 0,
          reviews: 0,
          // Keep R2 fields
          key: pdf.key,
          name: pdf.name,
          size: pdf.size,
          uploadedAt: pdf.uploadedAt,
          url: pdf.url
        }));
        setNotes(transformedNotes);
      } else {
        setError(data.error || 'Failed to load notes');
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to load notes from marketplace');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="relative py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-slate-200 dark:border-slate-700 border-t-orange-600 dark:border-t-orange-500"></div>
            <p className="mt-6 text-lg font-medium text-slate-600 dark:text-slate-400">Loading all resources...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <svg className="h-10 w-10 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
            <button
              onClick={fetchNotesFromR2}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-orange-600/20 hover:shadow-xl hover:shadow-orange-600/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 text-center">
            All Available Resources
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 text-center max-w-2xl mx-auto">
            Browse our complete collection of study materials and resources
          </p>
        </div>

        <NotesGrid notes={notes} />
      </div>
    </section>
  );
}

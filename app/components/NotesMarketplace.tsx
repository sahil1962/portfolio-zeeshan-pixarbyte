// app/components/NotesMarketplace.tsx

'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export interface Note {
  id: string;
  title: string;
  description: string;
  topics: string[];
  pages: number;
  price: number;
  preview: string;
  rating: number;
  reviews: number;
  // R2 specific fields
  key?: string;
  name?: string;
  size?: number;
  uploadedAt?: string;
  url?: string;
}

export default function NotesMarketplace() {
  // const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { addToCart, isInCart } = useCart();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

  // const categories = [
  //   { id: 'all', name: 'All Notes' },
  //   { id: 'topology', name: 'Topology' },
  //   { id: 'algebra', name: 'Algebra' },
  //   { id: 'geometry', name: 'Geometry' },
  //   { id: 'category', name: 'Category Theory' }
  // ];


  if (loading) {
    return (
      <section id="notes" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading marketplace...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="notes" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-600 dark:text-red-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-slate-600 dark:text-slate-400">{error}</p>
            <button
              onClick={fetchNotesFromR2}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="notes" className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Mathematical Notes
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Premium lecture notes and study materials crafted from years of teaching and research.
            Each set includes detailed explanations, examples, and exercises.
          </p>
        </div>

        {/* <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div> */}

        {notes.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No notes available yet</h3>
            <p className="text-slate-600 dark:text-slate-400">Check back soon for new study materials!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow"
              >
                <div className="p-6 space-y-4">
                  {/* PDF Icon */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {note.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {note.description}
                    </p>
                  </div>

                  {note.topics && note.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {note.topics.slice(0, 3).map((topic, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Pages Info */}
                  {note.pages > 0 && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{note.pages} pages</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        ${note.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {note.key && (
                        <a
                          href={`/api/pdfs/preview?key=${encodeURIComponent(note.key)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-2 text-center text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-sm font-medium"
                        >
                          Preview
                        </a>
                      )}
                      <button
                        onClick={() => addToCart(note)}
                        disabled={isInCart(note.id)}
                        className={`flex-1 px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-lg ${
                          isInCart(note.id)
                            ? 'bg-green-600 text-white cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
                        }`}
                      >
                        {isInCart(note.id) ? (
                          <span className="flex items-center justify-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            In Cart
                          </span>
                        ) : (
                          'Add to Cart'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* <div className="mt-16 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">Bundle & Save</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Purchase all notes together and save 30%. Perfect for comprehensive exam preparation
            or building a complete mathematical foundation.
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="text-left">
              <p className="text-sm text-blue-100">Complete Bundle</p>
              <p className="text-3xl font-bold">$149.99 <span className="text-lg line-through text-blue-200">$214.99</span></p>
            </div>
            <button
              onClick={() => alert('Processing bundle purchase')}
              className="px-8 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
            >
              Buy Complete Bundle
            </button>
          </div>
        </div> */}
      </div>
    </section>
  );
}

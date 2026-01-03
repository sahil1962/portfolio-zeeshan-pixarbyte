// app/components/NotesGrid.tsx

'use client';

import { useCart } from '../context/CartContext';
import { Note } from './NotesMarketplace';

interface NotesGridProps {
  notes: Note[];
}

export default function NotesGrid({ notes }: NotesGridProps) {
  const { addToCart, isInCart } = useCart();

  if (notes.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
          <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No notes available yet</h3>
        <p className="text-slate-600 dark:text-slate-400">Check back soon for new study materials!</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {notes.map((note) => (
        <div
          key={note.id}
          className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
        >
          <div className="p-6 space-y-4">
            {/* PDF Icon */}
            <div className="flex items-center justify-start mb-4">
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
                    className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full"
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
                  className={`flex-1 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-semibold ${isInCart(note.id)
                      ? 'bg-green-600 text-white cursor-not-allowed shadow-lg shadow-green-600/20'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 hover:scale-105'
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
  );
}

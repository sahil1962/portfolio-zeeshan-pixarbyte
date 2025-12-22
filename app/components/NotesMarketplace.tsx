'use client';

import { useState } from 'react';

interface Note {
  id: string;
  title: string;
  description: string;
  topics: string[];
  pages: number;
  price: number;
  preview: string;
  rating: number;
  reviews: number;
}

export default function NotesMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const notes: Note[] = [
    {
      id: '1',
      title: 'Introduction to Algebraic Topology',
      description: 'Comprehensive notes covering fundamental groups, covering spaces, homology theory, and cohomology. Includes solved examples and exercises.',
      topics: ['Fundamental Groups', 'Covering Spaces', 'Homology', 'Cohomology'],
      pages: 156,
      price: 29.99,
      preview: '#',
      rating: 4.9,
      reviews: 127
    },
    {
      id: '2',
      title: 'Abstract Algebra: Groups and Rings',
      description: 'In-depth study of group theory, ring theory, and field extensions. Perfect for graduate students and researchers.',
      topics: ['Group Theory', 'Ring Theory', 'Field Extensions', 'Galois Theory'],
      pages: 203,
      price: 34.99,
      preview: '#',
      rating: 4.8,
      reviews: 95
    },
    {
      id: '3',
      title: 'Category Theory Foundations',
      description: 'From basic definitions to advanced topics including functors, natural transformations, limits, and adjunctions.',
      topics: ['Categories', 'Functors', 'Natural Transformations', 'Adjunctions'],
      pages: 178,
      price: 32.99,
      preview: '#',
      rating: 4.9,
      reviews: 112
    },
    {
      id: '4',
      title: 'Differential Geometry of Manifolds',
      description: 'Complete notes on smooth manifolds, tangent bundles, differential forms, and Riemannian geometry.',
      topics: ['Manifolds', 'Differential Forms', 'Riemannian Geometry', 'Connections'],
      pages: 189,
      price: 36.99,
      preview: '#',
      rating: 4.7,
      reviews: 83
    },
    {
      id: '5',
      title: 'Homological Algebra',
      description: 'Advanced treatment of chain complexes, derived functors, spectral sequences, and applications.',
      topics: ['Chain Complexes', 'Derived Functors', 'Ext and Tor', 'Spectral Sequences'],
      pages: 167,
      price: 31.99,
      preview: '#',
      rating: 4.8,
      reviews: 76
    },
    {
      id: '6',
      title: 'Commutative Algebra',
      description: 'Comprehensive notes on Noetherian rings, localization, completion, and dimension theory.',
      topics: ['Noetherian Rings', 'Localization', 'Completion', 'Dimension Theory'],
      pages: 145,
      price: 28.99,
      preview: '#',
      rating: 4.9,
      reviews: 91
    }
  ];

  const categories = [
    { id: 'all', name: 'All Notes' },
    { id: 'topology', name: 'Topology' },
    { id: 'algebra', name: 'Algebra' },
    { id: 'geometry', name: 'Geometry' },
    { id: 'category', name: 'Category Theory' }
  ];

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

        <div className="flex flex-wrap gap-3 justify-center mb-12">
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
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow"
            >
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {note.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {note.description}
                  </p>
                </div>

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

                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium text-slate-900 dark:text-white">{note.rating}</span>
                    <span>({note.reviews})</span>
                  </div>
                  <span>{note.pages} pages</span>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      ${note.price}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={note.preview}
                      className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium"
                    >
                      Preview
                    </a>
                    <button
                      onClick={() => alert(`Processing purchase for: ${note.title}`)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium shadow-lg shadow-blue-500/30"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
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
        </div>
      </div>
    </section>
  );
}

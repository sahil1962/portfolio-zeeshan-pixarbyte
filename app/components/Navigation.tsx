// app/components/Navigation.tsx

'use client';

import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#publications', label: 'Publications' },
    { href: '#notes', label: 'Notes' },
    { href: '#contact', label: 'Contact' }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg border-b border-slate-200/50 dark:border-slate-700/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="shrink-0">
            <a href="#" className="group flex items-center gap-2">
              {/* <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                <span className="text-white font-bold text-xl">D</span>
              </div> */}
              <span className="text-2xl font-extrabold">
                <span className="text-slate-900 dark:text-white">Dr. </span>
                <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Zeeshan
                </span>
              </span>
            </a>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors group"
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute inset-0 bg-blue-50 dark:bg-slate-800 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200 origin-center"></span>
              </a>
            ))}

            <div className="ml-4 pl-4 border-l border-slate-300 dark:border-slate-700">
              <ThemeToggle />
            </div>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-900 dark:text-white p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-red-200 dark:border-slate-700 shadow-xl">
          <div className="px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 font-medium transition-all rounded-lg"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

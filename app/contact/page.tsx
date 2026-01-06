// app/contact/page.tsx

'use client';

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function ContactPage() {

  const socialLinks = [
    {
      name: "YouTube",
      handle: "@zeeshanzamurred9280",
      url: "https://www.youtube.com/@zeeshanzamurred9280",
      subtitle: "81.7K subscribers • 11M+ views",
      description: "Watch my free A-Level Maths video lessons",
      icon: (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      color: "red"
    },
    {
      name: "Instagram",
      handle: "@zeeshanzamurred",
      url: "https://instagram.com/zeeshanzamurred",
      subtitle: "Follow for updates & tips",
      description: "Daily maths tips and study motivation",
      icon: (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      color: "pink"
    },
    {
      name: "Twitter/X",
      handle: "@ZZamurred",
      url: "https://twitter.com/ZZamurred",
      subtitle: "Latest news & announcements",
      description: "Stay updated with new content releases",
      icon: (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: "blue"
    },
    {
      name: "Buy Me a Coffee",
      handle: "Support my work",
      url: "https://buymeacoffee.com/zeeshanzamurred",
      subtitle: "One-time donation",
      description: "Help me create more free content",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: "yellow"
    }
  ];


  return (
    <div className="min-h-screen">
      <Navigation />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28 bg-slate-50 dark:bg-slate-950 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-size-[14px_24px] opacity-30"></div>

          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-150 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 rounded-full mb-6">
                <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Connect With Me</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                Let&apos;s Connect
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Follow me on social media for updates, tips, and daily A-Level Maths content
              </p>
            </div>
          </div>
        </section>

        {/* Social Links Section */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Connect With Me
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Follow me on social media for updates, tips, and daily content
                  </p>
                </div>

                <div className="space-y-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-4 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                    >
                      <div className="shrink-0 w-14 h-14 bg-orange-600 dark:bg-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        {social.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white mb-1">{social.name}</p>
                        <p className="text-orange-600 dark:text-orange-400 font-medium truncate mb-1">
                          {social.handle}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{social.subtitle}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{social.description}</p>
                      </div>
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 group-hover:translate-x-1 transition-all duration-200 shrink-0 mt-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  ))}
                </div>

                {/* Quick Links Card */}
                <div className="bg-linear-to-br from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-800 p-8 rounded-2xl border border-orange-100 dark:border-slate-700">
                  <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Explore More</h3>
                  <div className="flex flex-wrap gap-3">
                    <a href="/videos" className="px-5 py-2.5 bg-white dark:bg-slate-900 hover:bg-orange-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg font-medium transition-all text-slate-900 dark:text-white hover:border-orange-300 dark:hover:border-orange-600">
                      Watch Videos
                    </a>
                    <a href="/resources" className="px-5 py-2.5 bg-white dark:bg-slate-900 hover:bg-orange-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg font-medium transition-all text-slate-900 dark:text-white hover:border-orange-300 dark:hover:border-orange-600">
                      Browse Resources
                    </a>
                    <a href="/about" className="px-5 py-2.5 bg-white dark:bg-slate-900 hover:bg-orange-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg font-medium transition-all text-slate-900 dark:text-white hover:border-orange-300 dark:hover:border-orange-600">
                      About Me
                    </a>
                  </div>
                </div>
              </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

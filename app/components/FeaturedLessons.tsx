// app/components/FeaturedLessons.tsx

'use client';

export default function FeaturedLessons() {
  const featuredVideos = [
    { id: "fDEQgC4pR_A", title: "A-Level Maths Video Tutorial", category: "Popular" },
    { id: "U5TjZ8s0KRo", title: "A-Level Maths Explained", category: "Popular" },
    { id: "Uptq5JZaGV0", title: "Step-by-Step Solution", category: "Popular" }
  ];

  return (
    <section id="featured-lessons" className="relative py-20 bg-white dark:bg-slate-900 overflow-hidden">
      {/* Subtle glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 dark:bg-orange-500/3 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 dark:bg-amber-500/3 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 rounded-full mb-6">
            <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Video Lessons</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Featured Lessons
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Step-by-step video explanations that make complex concepts simple
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Topic-by-topic explanations</p>
            </div>
            <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Exam-style question walkthroughs</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredVideos.map((video, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              {/* Video Container */}
              <div className="relative pb-[56.25%] overflow-hidden bg-slate-100 dark:bg-slate-800">
                {/* <div className="absolute inset-0 bg-black/10 dark:bg-black/20 group-hover:bg-black/5 dark:group-hover:bg-black/30 transition-colors duration-300 z-10 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                    <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div> */}
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Video Info */}
              <div className="p-5 bg-white dark:bg-slate-900">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 text-orange-700 dark:text-orange-300 text-xs font-medium rounded-full">
                    {video.category}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug">
                  {video.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="/videos"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-orange-600/20 hover:shadow-xl hover:shadow-orange-600/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>View All 352+ Lessons</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

// app/components/Hero.tsx

import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-slate-950">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-size-[14px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Subtle glow effects */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column - Content */}
          <div className="lg:col-span-7 space-y-8">
            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                <span className="text-slate-900 dark:text-white">Edexcel A-Level</span>
                <br />
                <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  and Further Maths 
                </span>
                <br />
                <span className="text-slate-900 dark:text-white">Made Clear</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                Step-by-step video lessons, practice questions, and exam-focused resources designed specifically for Edexcel A-Level Maths and Further Maths students.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href="/videos"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
                <span>Watch Free Lessons</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>

              <a
                href="/resources"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Browse Resources</span>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">352+</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Video Lessons</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">11M+</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Total Views</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">81.7K+</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Subscribers</div>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -inset-4 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full opacity-20 blur-2xl"></div>

              {/* Main image container */}
              <div className="relative">
                <div className="absolute -inset-1 bg-linear-to-r from-blue-600 via-indigo-600 to-blue-600 rounded-full blur-sm opacity-75"></div>
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden ring-4 ring-white dark:ring-slate-900 shadow-2xl">
                  <Image
                    src="/profile.jpg"
                    alt="Zeeshan Zamurred - A-Level Maths Educator"
                    width={384}
                    height={384}
                    priority
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* YouTube Logo Badge */}
              <div className="absolute -top-4 -left-1 w-20 h-20 rounded-full overflow-hidden shadow-lg">
                <Image
                  src="/youtube_logo.jpg"
                  alt="YouTube"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Certified Educator Badge - Positioned below the profile photo */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 min-w-max">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">Certified Educator</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">A-Level Specialist</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        {/* <div className="mt-16 lg:mt-24">
          <p className="text-center text-sm font-medium text-slate-600 dark:text-slate-400 mb-6">Trusted by students from</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <div className="text-slate-600 dark:text-slate-400 font-semibold">Edexcel</div>
            <div className="w-1 h-1 rounded-full bg-slate-400"></div>
            <div className="text-slate-600 dark:text-slate-400 font-semibold">Pearson</div>
            <div className="w-1 h-1 rounded-full bg-slate-400"></div>
            <div className="text-slate-600 dark:text-slate-400 font-semibold">UK Schools</div>
            <div className="w-1 h-1 rounded-full bg-slate-400"></div>
            <div className="text-slate-600 dark:text-slate-400 font-semibold">International Students</div>
          </div>
        </div> */}
      </div>
    </section>
  );
}

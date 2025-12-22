// app/components/Hero.tsx

import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-slate-50 via-blue-50/50 to-indigo-100/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="space-y-5 animate-fadeIn">
          {/* Profile Image */}
          <div className="flex justify-center ">
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 lg:w-60 lg:h-60 rounded-full overflow-hidden ring-4 ring-white dark:ring-slate-900 shadow-2xl transform group-hover:scale-105 transition duration-500">
                <Image
                  src="/profile.jpg"
                  alt="Dr. Alexander Theorem"
                  width={240}
                  height={240}
                  priority
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-linear-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white dark:ring-slate-900 transform group-hover:rotate-12 transition duration-500">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Name and Title */}
          {/* <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight">
              <span className="block text-slate-900 dark:text-white">Dr. Zeeshan Zamurred</span>
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl text-slate-600 dark:text-slate-300 font-light tracking-wide">
              Research Mathematician & Academic
            </p>
          </div> */}

          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white">
              Dr. Zeeshan<span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Zamurred</span>
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl text-slate-600 dark:text-slate-300 font-light tracking-wide">
              Research Mathematician & Academic
            </p>
          </div>

          {/* Specialization */}
          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              Specializing in{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">Algebraic Topology</span>,{' '}
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">Abstract Algebra</span>, and{' '}
              <span className="font-semibold text-purple-600 dark:text-purple-400">Category Theory</span>
            </p>
            <div className="flex items-center justify-center gap-3 text-slate-500 dark:text-slate-500">
              <span className="px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full text-sm font-medium border border-slate-200/50 dark:border-slate-700/50">
                PhD Mathematics, MIT
              </span>
              <span className="text-slate-400">•</span>
              <span className="px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full text-sm font-medium border border-slate-200/50 dark:border-slate-700/50">
                Postdoctoral Research Fellow
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-6 justify-center pt-0">
            <a
              href="#publications"
              className="group relative px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
            >
              <span className="relative z-10">View Publications</span>
              <div className="absolute inset-0 bg-linear-to-r from-blue-700 to-indigo-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            <a
              href="#notes"
              className="group px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-xl border-2 border-slate-200 dark:border-slate-700 transition-all duration-300 hover:scale-105 hover:border-blue-400 dark:hover:border-blue-600"
            >
              Browse Notes
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">Scroll to explore</span>
            <svg className="w-6 h-6 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

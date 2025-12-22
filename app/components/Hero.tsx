// app/components/Hero.tsx

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white">
              Dr. Alexander <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Theorem</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 font-light">
              Research Mathematician & Academic
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Specializing in <span className="font-semibold text-slate-900 dark:text-white">Algebraic Topology</span>,
              <span className="font-semibold text-slate-900 dark:text-white"> Abstract Algebra</span>, and
              <span className="font-semibold text-slate-900 dark:text-white"> Category Theory</span>
            </p>
            <p className="text-base text-slate-500 dark:text-slate-500">
              PhD Mathematics, MIT | Postdoctoral Research Fellow
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <a
              href="#publications"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/30"
            >
              View Publications
            </a>
            <a
              href="#notes"
              className="px-8 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium rounded-lg border-2 border-slate-200 dark:border-slate-700 transition-colors"
            >
              Browse Notes
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}

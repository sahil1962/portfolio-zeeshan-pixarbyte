// app/components/About.tsx

export default function About() {
  const interests = [
    { title: "Algebraic Topology", description: "Homotopy theory, fundamental groups, and homology" },
    { title: "Abstract Algebra", description: "Group theory, ring theory, and field extensions" },
    { title: "Category Theory", description: "Functors, natural transformations, and universal properties" },
    { title: "Differential Geometry", description: "Manifolds, tensor analysis, and Riemannian geometry" }
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            About My Research
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Exploring the fundamental structures that underlie modern mathematics
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Biography</h3>
            <div className="space-y-4 text-slate-600 dark:text-slate-400">
              <p>
                I am a research mathematician with over a decade of experience in pure mathematics.
                My work focuses on understanding the deep connections between algebraic structures and
                topological spaces.
              </p>
              <p>
                Currently serving as a Postdoctoral Research Fellow, I collaborate with mathematicians
                worldwide to advance our understanding of abstract mathematical structures.
              </p>
            </div>
          </div>

          <div className="bg-linear-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Education</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-600 pl-4">
                <p className="font-semibold text-slate-900 dark:text-white">PhD in Mathematics</p>
                <p className="text-slate-600 dark:text-slate-400">Massachusetts Institute of Technology, 2018</p>
              </div>
              <div className="border-l-4 border-indigo-600 pl-4">
                <p className="font-semibold text-slate-900 dark:text-white">MS in Pure Mathematics</p>
                <p className="text-slate-600 dark:text-slate-400">Stanford University, 2014</p>
              </div>
              <div className="border-l-4 border-purple-600 pl-4">
                <p className="font-semibold text-slate-900 dark:text-white">BS in Mathematics</p>
                <p className="text-slate-600 dark:text-slate-400">UC Berkeley, 2012</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Research Interests
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {interests.map((interest, index) => (
              <div
                key={index}
                className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700"
              >
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {interest.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {interest.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

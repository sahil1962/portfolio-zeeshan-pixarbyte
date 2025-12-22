export default function Publications() {
  const publications = [
    {
      title: "On the Cohomology of Compact Kähler Manifolds",
      journal: "Journal of Pure Mathematics",
      year: 2023,
      authors: "A. Theorem, B. Lemma",
      link: "#",
      abstract: "We establish new results on the cohomology rings of compact Kähler manifolds using spectral sequence techniques."
    },
    {
      title: "Functorial Approaches to Homological Algebra",
      journal: "Advances in Category Theory",
      year: 2022,
      authors: "A. Theorem, C. Proof, D. Axiom",
      link: "#",
      abstract: "This paper introduces novel functorial methods for computing derived functors in abelian categories."
    },
    {
      title: "Group Actions on Topological Spaces: A Modern Perspective",
      journal: "Topology and Its Applications",
      year: 2021,
      authors: "A. Theorem",
      link: "#",
      abstract: "We present a comprehensive study of group actions on various topological spaces with applications to geometry."
    },
    {
      title: "The Structure of Noetherian Rings",
      journal: "Communications in Algebra",
      year: 2020,
      authors: "A. Theorem, E. Corollary",
      link: "#",
      abstract: "New insights into the structure theory of Noetherian rings and their relationship to algebraic geometry."
    }
  ];

  return (
    <section id="publications" className="py-20 bg-slate-50 dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Publications
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Peer-reviewed research in leading mathematical journals
          </p>
        </div>

        <div className="space-y-6">
          {publications.map((pub, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {pub.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    {pub.authors}
                  </p>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {pub.journal}, {pub.year}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {pub.year}
                  </span>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {pub.abstract}
              </p>
              <div className="mt-4 flex gap-3">
                <a
                  href={pub.link}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  Read Paper →
                </a>
                <a
                  href={pub.link}
                  className="text-slate-600 dark:text-slate-400 hover:underline text-sm"
                >
                  Citation
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// app/components/About.tsx

export default function About() {
  const teachingFocus = [
    { title: "Step-by-step explanations", icon: "1️⃣" },
    { title: "Logical problem-solving", icon: "🧩" },
    { title: "Building confidence through practice", icon: "💪" }
  ];

  const approach = [
    "Follow the Edexcel specification closely",
    "Explain ideas visually and methodically",
    "Emphasise correct mathematical language",
    "Highlight common mistakes made in exams"
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            About Me
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Who I Am</h3>
            <div className="space-y-4 text-slate-600 dark:text-slate-400">
              <p>
                Hi, I&apos;m Zeeshan, an A-Level Maths and Further Maths educator creating structured video lessons
                and resources for Edexcel A-Level Maths students.
              </p>
              <p>
                I started this platform to help students:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <span>Understand difficult topics clearly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <span>Learn the exam-ready methods</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <span>Practise effectively using exam-style questions</span>
                </li>
              </ul>
              <p>
                All content on this site and my YouTube channel is designed to support students throughout
                the A-Level Maths course, whether they are revising, catching up, or aiming for top grades.
              </p>
            </div>
          </div>

          <div className="bg-linear-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Teaching Approach</h3>
            <div className="space-y-4">
              {approach.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 pt-0.5">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            My Teaching Focuses On
          </h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {teachingFocus.map((focus, index) => (
              <div
                key={index}
                className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700 text-center"
              >
                <div className="text-4xl mb-3">{focus.icon}</div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {focus.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

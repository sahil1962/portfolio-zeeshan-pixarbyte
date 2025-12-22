import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Publications from './components/Publications';
import NotesMarketplace from './components/NotesMarketplace';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <About />
        <Publications />
        <NotesMarketplace />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

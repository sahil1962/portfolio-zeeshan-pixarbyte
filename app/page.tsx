// app/page.tsx

import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Publications from './components/Publications';
import NotesMarketplace from './components/NotesMarketplace';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Cart from './components/Cart';

export const dynamic = 'force-dynamic';

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
      <Cart />
    </div>
  );
}

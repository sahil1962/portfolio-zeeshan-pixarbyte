// app/page.tsx

import Navigation from './components/Navigation';
import Hero from './components/Hero';
import WhatITeach from './components/WhatITeach';
import FeaturedLessons from './components/FeaturedLessons';
import NotesMarketplace from './components/NotesMarketplace';
import WhyLearnWithMe from './components/WhyLearnWithMe';
import MailingList from './components/MailingList';
import Footer from './components/Footer';
import Cart from './components/Cart';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <WhatITeach />
        <FeaturedLessons />
        <NotesMarketplace />
        <WhyLearnWithMe />
        <MailingList />
      </main>
      <Footer />
      <Cart />
    </div>
  );
}

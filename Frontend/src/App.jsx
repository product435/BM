import { useCallback, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import EventIntro from "./components/EventIntro.jsx";
import WhyItMatters from "./components/WhyItMatters.jsx";
import EventExperience from "./components/EventExperience.jsx";
import ParticipationCategories from "./components/ParticipationCategories.jsx";
import FundingOpportunity from "./components/FundingOpportunity.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Guests from "./components/Guests.jsx";
import QnASection from "./components/QnASection.jsx";
import Highlights from "./components/Highlights.jsx";
import JaipurSection from "./components/JaipurSection.jsx";
import Registration from "./components/Registration.jsx";
import FinalCTA from "./components/FinalCTA.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleSelectCategory = useCallback(
    (id) => {
      setSelectedCategory(id);
      scrollTo("register");
    },
    [scrollTo]
  );

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <Navbar onNavigate={scrollTo} />
      <main id="main">
        <Hero onRegister={() => scrollTo("register")} onExplore={() => scrollTo("about")} />
        <EventIntro />
        <WhyItMatters onExploreCategories={() => scrollTo("categories")} />
        <EventExperience />
        <ParticipationCategories onSelectCategory={handleSelectCategory} />
        <FundingOpportunity onRegister={() => scrollTo("register")} />
        <HowItWorks onRegister={() => scrollTo("register")} />
        <Guests />
        <QnASection />
        <Highlights />
        <JaipurSection
          onRegister={() => scrollTo("register")}
          onExploreCategories={() => scrollTo("categories")}
        />
        <Registration
          selectedCategory={selectedCategory}
          onCategoryChanged={setSelectedCategory}
        />
        <FinalCTA
          onRegister={() => scrollTo("register")}
          onExploreCategories={() => scrollTo("categories")}
        />
      </main>
      <Footer onNavigate={scrollTo} />
    </>
  );
}

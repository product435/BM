import { useCallback, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import AdminLogin from "./components/AdminLogin.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { SiteProvider } from "./context/SiteContext.jsx";
import { supabase } from "./lib/supabase.js";

const LandingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [heroData, setHeroData] = useState(null);
  const [venueData, setVenueData] = useState(null);
  const [eventAmountData, setEventAmountData] = useState(null);
  const [experienceData, setExperienceData] = useState(null);
  const [qaData, setQaData] = useState(null);

  useEffect(() => {
    async function loadData() {
      const [heroRes, venueRes, amountRes, experienceRes, qaRes] = await Promise.all([
        supabase.from('hero_content').select('*').eq('id', 1).single(),
        supabase.from('venue_content').select('*').eq('id', 1).single(),
        supabase.from('event_amount').select('*').eq('id', 1).single(),
        supabase.from('event_experience').select('*').eq('id', 1).single(),
        supabase.from('qa_session').select('*').eq('id', 1).single()
      ]);
      
      if (heroRes.data) setHeroData(heroRes.data);
      if (venueRes.data) setVenueData(venueRes.data);
      if (amountRes.data) setEventAmountData(amountRes.data);
      if (experienceRes.data) setExperienceData(experienceRes.data);
      if (qaRes.data) setQaData(qaRes.data);
    }
    loadData();
  }, []);

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
        {heroData ? (
           <Hero 
             onRegister={() => scrollTo("register")} 
             onExplore={() => scrollTo("about")} 
             eventData={{ city: heroData.city, date: heroData.event_date }}
             eyebrow={heroData.eyebrow}
             titleLine1={[heroData.title_line_1.split(' ').slice(0, -1).join(' '), heroData.title_line_1.split(' ').pop() || '']}
             titleLine2={[heroData.title_line_2.split(' ').slice(0, -1).join(' '), heroData.title_line_2.split(' ').pop() || '']}
             subText={heroData.sub_text}
             primaryCtaText={heroData.primary_cta_text}
             secondaryCtaText={heroData.secondary_cta_text}
             heroTicker={heroData.ticker.split(',').map(s => s.trim())}
             heroImages={{ hero: heroData.hero_image }}
           />
        ) : (
           <Hero onRegister={() => scrollTo("register")} onExplore={() => scrollTo("about")} />
        )}
        <EventIntro />
        <WhyItMatters onExploreCategories={() => scrollTo("categories")} />
        <EventExperience />
        <ParticipationCategories onSelectCategory={handleSelectCategory} />
        <FundingOpportunity onRegister={() => scrollTo("register")} />
        <HowItWorks onRegister={() => scrollTo("register")} />
        <Guests />
        <QnASection qaData={qaData} />
        <Highlights experienceData={experienceData} />
        <JaipurSection
          onRegister={() => scrollTo("register")}
          onExploreCategories={() => scrollTo("categories")}
          venueData={venueData}
        />
        <Registration
          selectedCategory={selectedCategory}
          onCategoryChanged={setSelectedCategory}
          eventAmountData={eventAmountData}
        />
        <FinalCTA
          onRegister={() => scrollTo("register")}
          onExploreCategories={() => scrollTo("categories")}
        />
      </main>
      <Footer onNavigate={scrollTo} />
    </>
  );
};

export default function App() {
  return (
    <SiteProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Router>
    </SiteProvider>
  );
}

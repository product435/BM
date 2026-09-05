import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { QA_SESSION } from '../data/eventData';
import { GUESTS } from '../data/guests';

const SiteContext = createContext();

export const useSiteContent = () => useContext(SiteContext);

export const SiteProvider = ({ children }) => {
  const [content, setContent] = useState({
    guests: GUESTS,
    faq: QA_SESSION
  });
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    // Fetch site_content if it exists
    const { data: siteData, error: siteError } = await supabase
      .from('site_content')
      .select('data')
      .eq('id', 1)
      .single();

    // Fetch guests
    const { data: guestsData, error: guestsError } = await supabase
      .from('guests')
      .select('*')
      .order('sort_order', { ascending: true });

    setContent(prev => ({
      ...prev,
      ...(siteData?.data || {}),
      guests: guestsData?.length > 0 ? guestsData : GUESTS
    }));

    setLoading(false);
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <SiteContext.Provider value={{ content, fetchContent, loading }}>
      {children}
    </SiteContext.Provider>
  );
};

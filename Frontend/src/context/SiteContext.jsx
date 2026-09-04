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
    const { data, error } = await supabase
      .from('site_content')
      .select('data')
      .eq('id', 1)
      .single();

    if (!error && data?.data) {
      setContent(prev => ({
        ...prev,
        ...data.data
      }));
    }
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

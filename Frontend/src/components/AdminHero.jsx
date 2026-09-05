import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Image as ImageIcon, RefreshCcw } from 'lucide-react';
import Hero from './Hero';

// Reuse colors from dashboard
const C = {
  ink950: '#0c0b09',
  ink900: '#14120f',
  ink800: '#1c1a15',
  lineDark: 'rgba(247,242,232,0.10)',
  ivory50: '#f7f2e8',
  stone400: '#a49a84',
  stone500: '#857b67',
  brass400: '#c6a462',
  brass500: '#a5844a',
  em500: '#2c8360',
  rose400: '#c87f63',
};

const SERIF = '"Fraunces","Georgia",serif';
const SANS = '"Archivo","Helvetica Neue",sans-serif';

export default function AdminHero() {
  const [formData, setFormData] = useState({
    city: 'Jaipur',
    date: '20th',
    eyebrow: 'Capital. Capability. Connections.',
    titleLine1: 'Where ideas',
    titleLine2: 'meet opportunity',
    subText: 'A curated platform for founders, innovators, operating businesses, industry leaders and strategic partners to connect, build and scale. — in Jaipur, on the 20th — to explore what comes next.',
    primaryCtaText: 'Register now',
    secondaryCtaText: 'Explore the event',
    ticker: 'Startup Pitches, Investment Conversations, Business Networking, Student Ideas, E-Sales, Innovation',
    heroImage: 'https://images.pexels.com/photos/9275222/pexels-photo-9275222.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1800'
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [previewImage, setPreviewImage] = useState(formData.heroImage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      setFormData(prev => ({ ...prev, heroImage: url }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Mock save
    setMessage({ type: 'success', text: 'Hero content saved successfully! (Mock)' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const parseTitle = (line) => {
    const parts = line.split(' ');
    const lastWord = parts.pop();
    return [parts.join(' '), lastWord || ''];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', background: C.ink950 }}>
      <main style={{ flex: 1, padding: '32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          <div>
            <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.stone500, fontWeight: 700, marginBottom: '4px' }}>CMS</p>
            <h2 style={{ fontFamily: SERIF, fontSize: '20px', color: C.ivory50, fontWeight: 600 }}>Hero Section Management</h2>
          </div>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
            {/* Form Section */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ flex: 1, background: C.ink800, border: `1px solid ${C.lineDark}`, borderRadius: '3px', padding: '28px' }}>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Event Name / Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: C.stone400, marginBottom: '6px' }}>Event City</label>
                    <input name="city" value={formData.city} onChange={handleInputChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: C.stone400, marginBottom: '6px' }}>Event Date</label>
                    <input name="date" value={formData.date} onChange={handleInputChange} style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: C.stone400, marginBottom: '6px' }}>Hero Badge (Eyebrow)</label>
                  <input name="eyebrow" value={formData.eyebrow} onChange={handleInputChange} style={inputStyle} />
                </div>

                {/* Title */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: C.stone400, marginBottom: '6px' }}>Title Line 1</label>
                    <input name="titleLine1" value={formData.titleLine1} onChange={handleInputChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: C.stone400, marginBottom: '6px' }}>Title Line 2</label>
                    <input name="titleLine2" value={formData.titleLine2} onChange={handleInputChange} style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: C.stone400, marginBottom: '6px' }}>Description</label>
                  <textarea name="subText" value={formData.subText} onChange={handleInputChange} style={{ ...inputStyle, height: '80px', resize: 'vertical' }} />
                </div>

                {/* CTAs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: C.stone400, marginBottom: '6px' }}>Primary CTA Text</label>
                    <input name="primaryCtaText" value={formData.primaryCtaText} onChange={handleInputChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: C.stone400, marginBottom: '6px' }}>Secondary CTA Text</label>
                    <input name="secondaryCtaText" value={formData.secondaryCtaText} onChange={handleInputChange} style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: C.stone400, marginBottom: '6px' }}>Bottom Scrolling Highlights (Comma Separated)</label>
                  <input name="ticker" value={formData.ticker} onChange={handleInputChange} style={inputStyle} />
                </div>

                {/* Background Image */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: C.stone400, marginBottom: '6px' }}>Background Image</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: C.ink900, border: `1px solid ${C.lineDark}`, padding: '12px', borderRadius: '3px' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '3px', overflow: 'hidden', background: C.ink950, display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                      {previewImage ? (
                         <img src={previewImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                         <ImageIcon size={20} color={C.stone500} style={{ margin: '0 auto' }}/>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '11px', color: C.stone400, marginBottom: '4px' }}>Current background media</p>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: C.brass400, background: 'transparent', border: `1px solid ${C.brass500}`, padding: '5px 12px', borderRadius: '2px', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: SANS }}>
                        <RefreshCcw size={12} /> Replace Image
                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '20px', borderTop: `1px solid ${C.lineDark}` }}>
                  {message.text ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: message.type === 'success' ? C.em500 : C.rose400, fontSize: '13px' }}>
                      <Check size={16} /> {message.text}
                    </div>
                  ) : <div />}
                  <button type="submit" style={{ padding: '10px 24px', background: C.brass400, color: C.ink950, border: 'none', borderRadius: '3px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: SANS }}>
                    Save Changes
                  </button>
                </div>

              </form>
            </motion.div>
          </div>

          {/* Live Preview */}
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontFamily: SERIF, fontSize: '18px', color: C.ivory50, marginBottom: '16px' }}>Live Preview</h3>
            <div style={{ border: `1px solid ${C.brass500}`, borderRadius: '4px', overflow: 'hidden', height: '600px', position: 'relative' }}>
               <Hero 
                 onRegister={() => {}} 
                 onExplore={() => {}}
                 eventData={{ city: formData.city, date: formData.date }}
                 heroTicker={formData.ticker.split(',').map(s => s.trim())}
                 heroImages={{ hero: formData.heroImage }}
                 eyebrow={formData.eyebrow}
                 titleLine1={parseTitle(formData.titleLine1)}
                 titleLine2={parseTitle(formData.titleLine2)}
                 subText={formData.subText}
                 primaryCtaText={formData.primaryCtaText}
                 secondaryCtaText={formData.secondaryCtaText}
               />
               <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, pointerEvents: 'none', boxShadow: 'inset 0 0 0 4px rgba(198,164,98,0.5)' }} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  background: C.ink900,
  border: `1px solid ${C.lineDark}`,
  borderRadius: '3px',
  color: C.ivory50,
  fontSize: '13px',
  outline: 'none',
  fontFamily: SANS,
};

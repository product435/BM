import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Image as ImageIcon, RefreshCcw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import EventIntro from './EventIntro';

import { AdminThemeContext } from '../context/AdminThemeContext';
const SERIF = '"Fraunces","Georgia",serif';
const SANS = '"Archivo","Helvetica Neue",sans-serif';

export default function AdminTheEvent() {
  const { C } = React.useContext(AdminThemeContext);

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

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    color: C.stone400,
    marginBottom: '6px'
  };

  const sectionHeadingStyle = {
    fontFamily: SERIF,
    fontSize: '15px',
    color: C.ivory50,
    fontWeight: 600,
    margin: 0
  };

  const [formData, setFormData] = useState({
    eyebrow: '01 — The Event',
    title: 'More than an event. <span class="t-italic t-emerald">A place</span> where ambition meets opportunity.',
    paragraph_1: 'BMI Event Startup & Business Launch brings together **promising ideas**...',
    paragraph_2: 'One city. One powerful gathering. A space to connect, learn, collaborate and create what comes next.',
    intro_words: 'Connections, Learning, Funding, Scaling, Innovation, Mentorship',
    image_url: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    media_headline: 'Funding is only the beginning',
    media_pills: 'CAPITAL, MANAGEMENT, TECHNOLOGY, OPERATIONS, NETWORK, GROWTH, CONVERSATIONS, REAL CONNECTIONS',
    media_location: 'Jaipur, Rajasthan',
    stats: [
      { value: '04', label: 'WAYS TO PARTICIPATE' },
      { value: '06+', label: 'VOICES IN THE EVENT' },
      { value: '01', label: 'CITY — JAIPUR' },
      { value: 'Stardom Resort', label: 'VENUE — Jaipur, Rajasthan' }
    ],
    footer_note: 'Venue and capacity figures are being finalized details will be confirmed ahead of the event.'
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [previewImage, setPreviewImage] = useState(formData.image_url);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [previewData, setPreviewData] = useState(null); // For live preview rendering

  useEffect(() => {
    fetchEventIntroContent();
  }, []);

  const fetchEventIntroContent = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('event_intro').select('*').eq('id', 1).single();
    if (data) {
      // Parse arrays back to comma-separated strings for the form
      const parsedData = {
        ...data,
        intro_words: Array.isArray(data.intro_words) ? data.intro_words.join(', ') : '',
        media_pills: Array.isArray(data.media_pills) ? data.media_pills.join(', ') : '',
        stats: Array.isArray(data.stats) && data.stats.length === 4 ? data.stats : formData.stats
      };
      setFormData(parsedData);
      setPreviewImage(data.image_url);
      setPreviewData(data); // Preview takes the raw DB object shape
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatChange = (index, field, value) => {
    setFormData(prev => {
      const newStats = [...prev.stats];
      newStats[index] = { ...newStats[index], [field]: value };
      return { ...prev, stats: newStats };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      setFileToUpload(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUploading(true);

    let imageUrl = formData.image_url;

    if (fileToUpload) {
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `event_intro_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('hero_media')
        .upload(fileName, fileToUpload);

      if (uploadError) {
        setMessage({ type: 'error', text: 'Failed to upload image.' });
        setUploading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('hero_media')
        .getPublicUrl(fileName);

      imageUrl = publicUrl;
      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    }

    // Convert comma-separated back to arrays before saving
    const parsedWords = formData.intro_words.split(',').map(s => s.trim()).filter(Boolean);
    const parsedPills = formData.media_pills.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      id: 1,
      eyebrow: formData.eyebrow,
      title: formData.title,
      paragraph_1: formData.paragraph_1,
      paragraph_2: formData.paragraph_2,
      intro_words: parsedWords,
      image_url: imageUrl,
      media_headline: formData.media_headline,
      media_pills: parsedPills,
      media_location: formData.media_location,
      stats: formData.stats,
      footer_note: formData.footer_note
    };

    const { error } = await supabase.from('event_intro').upsert(payload);

    if (error) {
      setMessage({ type: 'error', text: 'Failed to save changes.' });
    } else {
      setMessage({ type: 'success', text: 'Content saved successfully!' });
      setFileToUpload(null);
      setPreviewData(payload); // Update live preview
    }

    setUploading(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', background: C.ink950 }}>
      <main style={{ flex: 1, padding: '32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>

          <div>
            <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.stone500, fontWeight: 700, marginBottom: '4px' }}>CMS</p>
            <h2 style={{ fontFamily: SERIF, fontSize: '20px', color: C.ivory50, fontWeight: 600 }}>The Event Management</h2>
          </div>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ flex: 1, background: C.ink800, border: `1px solid ${C.lineDark}`, borderRadius: '3px', padding: '28px' }}>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Introduction Text Block */}
                <div>
                  <h3 style={sectionHeadingStyle}>Introduction Section</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginTop: '12px' }}>
                    <div>
                      <label style={labelStyle}>Eyebrow (Badge)</label>
                      <input name="eyebrow" value={formData.eyebrow} onChange={handleInputChange} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Main Title (Supports HTML tags like {"<span class='t-italic'>"})</label>
                      <input name="title" value={formData.title} onChange={handleInputChange} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Paragraph 1 (Use **text** for bold)</label>
                      <textarea name="paragraph_1" value={formData.paragraph_1} onChange={handleInputChange} style={{ ...inputStyle, height: '80px', resize: 'vertical' }} />
                    </div>
                    <div>
                      <label style={labelStyle}>Paragraph 2</label>
                      <textarea name="paragraph_2" value={formData.paragraph_2} onChange={handleInputChange} style={{ ...inputStyle, height: '60px', resize: 'vertical' }} />
                    </div>
                    <div>
                      <label style={labelStyle}>Intro Words List (Comma separated)</label>
                      <input name="intro_words" value={formData.intro_words} onChange={handleInputChange} style={inputStyle} placeholder="e.g. Connections, Learning, Funding" />
                    </div>
                  </div>
                </div>

                <hr style={{ borderTop: `1px solid ${C.lineDark}`, margin: '0' }} />

                {/* Media Image Block */}
                <div>
                  <h3 style={sectionHeadingStyle}>Media Image Block</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginTop: '12px' }}>
                    <div>
                      <label style={labelStyle}>Media Headline</label>
                      <input name="media_headline" value={formData.media_headline} onChange={handleInputChange} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Media Pills (Comma separated)</label>
                      <input name="media_pills" value={formData.media_pills} onChange={handleInputChange} style={inputStyle} placeholder="e.g. CAPITAL, MANAGEMENT, TECHNOLOGY" />
                    </div>
                    <div>
                      <label style={labelStyle}>Media Location</label>
                      <input name="media_location" value={formData.media_location} onChange={handleInputChange} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Main Image</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: C.ink900, border: `1px solid ${C.lineDark}`, padding: '12px', borderRadius: '3px' }}>
                        <div style={{ width: '120px', height: '80px', borderRadius: '3px', overflow: 'hidden', background: C.ink950, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {previewImage ? (
                            previewImage.endsWith('.mp4') || previewImage.endsWith('.webm') ? (
                              <video src={previewImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted playsInline />
                            ) : (
                              <img src={previewImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            )
                          ) : (
                            <ImageIcon size={20} color={C.stone500} />
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '11px', color: C.stone400, marginBottom: '4px' }}>Current event image</p>
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: C.brass400, background: 'transparent', border: `1px solid ${C.brass500}`, padding: '5px 12px', borderRadius: '2px', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: SANS }}>
                            <RefreshCcw size={12} /> Replace Image
                            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr style={{ borderTop: `1px solid ${C.lineDark}`, margin: '0' }} />

                {/* Stats Block */}
                <div>
                  <h3 style={sectionHeadingStyle}>Event Stats (4 Items)</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                    {formData.stats.map((stat, index) => (
                      <div key={index} style={{ background: C.ink900, padding: '12px', borderRadius: '3px', border: `1px solid ${C.lineDark}` }}>
                        <p style={{ fontSize: '10px', color: C.stone500, marginBottom: '8px' }}>Stat {index + 1}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <input
                            value={stat.value}
                            onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                            style={inputStyle}
                            placeholder="Value (e.g. 04 or TBA)"
                          />
                          <input
                            value={stat.label}
                            onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                            style={inputStyle}
                            placeholder="Label (e.g. WAYS TO PARTICIPATE)"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <hr style={{ borderTop: `1px solid ${C.lineDark}`, margin: '0' }} />

                {/* Footer Note */}
                <div>
                  <h3 style={sectionHeadingStyle}>Footer</h3>
                  <div style={{ marginTop: '12px' }}>
                    <label style={labelStyle}>Footer Note</label>
                    <input name="footer_note" value={formData.footer_note} onChange={handleInputChange} style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '20px', borderTop: `1px solid ${C.lineDark}` }}>
                  {message.text ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: message.type === 'success' ? C.em500 : C.rose400, fontSize: '13px' }}>
                      <Check size={16} /> {message.text}
                    </div>
                  ) : <div />}
                  <button type="submit" disabled={uploading || loading} style={{ padding: '10px 24px', background: C.brass400, color: C.ink950, border: 'none', borderRadius: '3px', fontWeight: 600, fontSize: '13px', cursor: (uploading || loading) ? 'not-allowed' : 'pointer', fontFamily: SANS, opacity: (uploading || loading) ? 0.7 : 1 }}>
                    {uploading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>

          {/* Live Preview */}
          <div style={{ marginTop: '20px', paddingBottom: '40px' }}>
            <h3 style={{ fontFamily: SERIF, fontSize: '18px', color: C.ivory50, marginBottom: '16px' }}>Live Preview</h3>
            <div style={{ border: `1px solid ${C.brass500}`, borderRadius: '4px', overflow: 'hidden', position: 'relative', background: C.ink950 }}>
              {/* We pass previewData down. If it's null, EventIntro will just fetch its own or use defaults. */}
              <EventIntro previewData={previewData} />
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, pointerEvents: 'none', boxShadow: 'inset 0 0 0 4px rgba(198,164,98,0.5)' }} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}



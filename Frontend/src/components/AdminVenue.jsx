import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Image as ImageIcon, RefreshCcw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import JaipurSection from './JaipurSection';

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

export default function AdminVenue() {
  const [formData, setFormData] = useState({
    eyebrow: '10 — The Venue',
    title_line_1: 'The next conversation',
    title_line_2: 'starts in Jaipur.',
    description: "A city of **craft and commerce** — home to a growing student-and-startup ecosystem, campuses like **MNIT**, and a generation of founders who build for India. Jaipur isn't just the backdrop. **It's part of the pitch.**",
    image_url: 'https://images.pexels.com/photos/9275222/pexels-photo-9275222.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1800',
    image_caption: 'The Pink City — tradition with an eye on tomorrow',
    event_date: '20th',
    location: 'Jaipur',
    venue_status: 'To be announced',
    participation_text: 'By registration',
    venue_note: 'Precise location will be shared with confirmed attendees to maintain the privacy of the gathering.'
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [previewImage, setPreviewImage] = useState(formData.image_url);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);

  useEffect(() => {
    fetchVenueContent();
  }, []);

  const fetchVenueContent = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('venue_content').select('*').eq('id', 1).single();
    if (data) {
      setFormData(data);
      setPreviewImage(data.image_url);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      const fileName = `venue_${Date.now()}.${fileExt}`;
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

    const { error } = await supabase.from('venue_content').upsert({
      id: 1,
      ...formData,
      image_url: imageUrl
    });

    if (error) {
      setMessage({ type: 'error', text: 'Failed to save changes.' });
    } else {
      setMessage({ type: 'success', text: 'Venue content saved successfully!' });
      setFileToUpload(null);
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
            <h2 style={{ fontFamily: SERIF, fontSize: '20px', color: C.ivory50, fontWeight: 600 }}>The Venue Management</h2>
          </div>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ flex: 1, background: C.ink800, border: `1px solid ${C.lineDark}`, borderRadius: '3px', padding: '28px' }}>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Location</label>
                    <input name="location" value={formData.location} onChange={handleInputChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Event Date</label>
                    <input name="event_date" value={formData.event_date} onChange={handleInputChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Eyebrow (Badge)</label>
                    <input name="eyebrow" value={formData.eyebrow} onChange={handleInputChange} style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Title Line 1</label>
                    <input name="title_line_1" value={formData.title_line_1} onChange={handleInputChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Title Line 2 (Brass & Italic)</label>
                    <input name="title_line_2" value={formData.title_line_2} onChange={handleInputChange} style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Description (Use **text** for bold)</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} style={{ ...inputStyle, height: '80px', resize: 'vertical' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Venue Status</label>
                    <input name="venue_status" value={formData.venue_status} onChange={handleInputChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Participation Text</label>
                    <input name="participation_text" value={formData.participation_text} onChange={handleInputChange} style={inputStyle} />
                  </div>
                </div>
                
                <div>
                  <label style={labelStyle}>Venue Footer Note</label>
                  <input name="venue_note" value={formData.venue_note} onChange={handleInputChange} style={inputStyle} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Image Caption</label>
                    <input name="image_caption" value={formData.image_caption} onChange={handleInputChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Venue Image</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: C.ink900, border: `1px solid ${C.lineDark}`, padding: '12px', borderRadius: '3px' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '3px', overflow: 'hidden', background: C.ink950, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {previewImage ? (
                           <img src={previewImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                           <ImageIcon size={20} color={C.stone500} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '11px', color: C.stone400, marginBottom: '4px' }}>Current venue image</p>
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: C.brass400, background: 'transparent', border: `1px solid ${C.brass500}`, padding: '5px 12px', borderRadius: '2px', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: SANS }}>
                          <RefreshCcw size={12} /> Replace Image
                          <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                        </label>
                      </div>
                    </div>
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
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontFamily: SERIF, fontSize: '18px', color: C.ivory50, marginBottom: '16px' }}>Live Preview</h3>
            <div style={{ border: `1px solid ${C.brass500}`, borderRadius: '4px', overflow: 'hidden', position: 'relative', background: C.ink950 }}>
               <JaipurSection 
                 onRegister={() => {}} 
                 onExploreCategories={() => {}}
                 venueData={{...formData, image_url: previewImage}}
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

const labelStyle = { 
  display: 'block', 
  fontSize: '12px', 
  color: C.stone400, 
  marginBottom: '6px' 
};

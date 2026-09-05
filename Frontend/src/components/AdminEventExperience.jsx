import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Highlights from './Highlights';

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

export default function AdminEventExperience() {
  const [formData, setFormData] = useState({
    eyebrow: '',
    heading: '',
    subheading: '',
    agenda: [],
    special_items: [],
    value_strip: []
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('event_experience').select('*').eq('id', 1).single();
    if (data) {
      setFormData(data);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateArrayItem = (arrayName, index, field, value) => {
    const newArray = [...formData[arrayName]];
    newArray[index][field] = value;
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const removeArrayItem = (arrayName, index) => {
    const newArray = [...formData[arrayName]];
    newArray.splice(index, 1);
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const addArrayItem = (arrayName, defaultItem) => {
    setFormData({ ...formData, [arrayName]: [...formData[arrayName], defaultItem] });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const { error } = await supabase.from('event_experience').upsert({
      id: 1,
      ...formData
    });

    if (error) {
      setMessage({ type: 'error', text: 'Failed to save changes.' });
    } else {
      setMessage({ type: 'success', text: 'Event Experience content saved successfully!' });
    }
    
    setSaving(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', background: C.ink950 }}>
      <main style={{ flex: 1, padding: '32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.stone500, fontWeight: 700, marginBottom: '4px' }}>CMS</p>
              <h2 style={{ fontFamily: SERIF, fontSize: '20px', color: C.ivory50, fontWeight: 600 }}>Event Day Experience Management</h2>
            </div>
            <button onClick={handleSave} disabled={saving || loading} style={{ padding: '10px 24px', background: C.brass400, color: C.ink950, border: 'none', borderRadius: '3px', fontWeight: 600, fontSize: '13px', cursor: (saving || loading) ? 'not-allowed' : 'pointer', fontFamily: SANS, opacity: (saving || loading) ? 0.7 : 1 }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Header Section */}
              <div style={{ background: C.ink800, border: `1px solid ${C.lineDark}`, borderRadius: '3px', padding: '24px' }}>
                <h3 style={{ fontFamily: SERIF, fontSize: '18px', color: C.ivory50, marginBottom: '16px' }}>Section Header</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Eyebrow Badge</label>
                    <input name="eyebrow" value={formData.eyebrow} onChange={handleInputChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Heading</label>
                    <input name="heading" value={formData.heading} onChange={handleInputChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Subheading</label>
                    <textarea name="subheading" value={formData.subheading} onChange={handleInputChange} style={{ ...inputStyle, height: '60px', resize: 'vertical' }} />
                  </div>
                </div>
              </div>

              {/* Agenda Section */}
              <div style={{ background: C.ink800, border: `1px solid ${C.lineDark}`, borderRadius: '3px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontFamily: SERIF, fontSize: '18px', color: C.ivory50 }}>Event Agenda</h3>
                  <button onClick={() => addArrayItem('agenda', { time: '12:00 PM', title: 'New Item', description: 'Description' })} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: `1px solid ${C.brass500}`, color: C.brass400, padding: '4px 12px', borderRadius: '3px', fontSize: '12px', cursor: 'pointer' }}>
                    <Plus size={14} /> Add Item
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {formData.agenda.map((item, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr 40px', gap: '12px', background: C.ink900, padding: '12px', borderRadius: '4px', border: `1px solid ${C.lineDark}` }}>
                      <input value={item.time} onChange={e => updateArrayItem('agenda', i, 'time', e.target.value)} style={smallInputStyle} placeholder="Time" />
                      <input value={item.title} onChange={e => updateArrayItem('agenda', i, 'title', e.target.value)} style={smallInputStyle} placeholder="Title" />
                      <input value={item.description} onChange={e => updateArrayItem('agenda', i, 'description', e.target.value)} style={smallInputStyle} placeholder="Description" />
                      <button onClick={() => removeArrayItem('agenda', i)} style={{ background: 'transparent', border: 'none', color: C.rose400, cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Items */}
              <div style={{ background: C.ink800, border: `1px solid ${C.lineDark}`, borderRadius: '3px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontFamily: SERIF, fontSize: '18px', color: C.ivory50 }}>What Makes It Special?</h3>
                  <button onClick={() => addArrayItem('special_items', { index: '00', title: 'New Item', description: 'Description' })} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: `1px solid ${C.brass500}`, color: C.brass400, padding: '4px 12px', borderRadius: '3px', fontSize: '12px', cursor: 'pointer' }}>
                    <Plus size={14} /> Add Item
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {formData.special_items.map((item, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '50px 1fr 1fr 40px', gap: '12px', background: C.ink900, padding: '12px', borderRadius: '4px', border: `1px solid ${C.lineDark}` }}>
                      <input value={item.index} onChange={e => updateArrayItem('special_items', i, 'index', e.target.value)} style={smallInputStyle} placeholder="No." />
                      <input value={item.title} onChange={e => updateArrayItem('special_items', i, 'title', e.target.value)} style={smallInputStyle} placeholder="Title" />
                      <input value={item.description} onChange={e => updateArrayItem('special_items', i, 'description', e.target.value)} style={smallInputStyle} placeholder="Description" />
                      <button onClick={() => removeArrayItem('special_items', i)} style={{ background: 'transparent', border: 'none', color: C.rose400, cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Value Strip */}
              <div style={{ background: C.ink800, border: `1px solid ${C.lineDark}`, borderRadius: '3px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontFamily: SERIF, fontSize: '18px', color: C.ivory50 }}>What's in the event?</h3>
                  <button onClick={() => addArrayItem('value_strip', { title: 'New Item', description: 'Description' })} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: `1px solid ${C.brass500}`, color: C.brass400, padding: '4px 12px', borderRadius: '3px', fontSize: '12px', cursor: 'pointer' }}>
                    <Plus size={14} /> Add Item
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {formData.value_strip.map((item, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: '12px', background: C.ink900, padding: '12px', borderRadius: '4px', border: `1px solid ${C.lineDark}` }}>
                      <input value={item.title} onChange={e => updateArrayItem('value_strip', i, 'title', e.target.value)} style={smallInputStyle} placeholder="Title" />
                      <input value={item.description} onChange={e => updateArrayItem('value_strip', i, 'description', e.target.value)} style={smallInputStyle} placeholder="Description" />
                      <button onClick={() => removeArrayItem('value_strip', i)} style={{ background: 'transparent', border: 'none', color: C.rose400, cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>

              {message.text && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: message.type === 'success' ? C.em500 : C.rose400, fontSize: '13px' }}>
                  <Check size={16} /> {message.text}
                </div>
              )}

            </motion.div>
          </div>

          {/* Live Preview */}
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontFamily: SERIF, fontSize: '18px', color: C.ivory50, marginBottom: '16px' }}>Live Preview</h3>
            <div style={{ border: `1px solid ${C.brass500}`, borderRadius: '4px', overflow: 'hidden', position: 'relative', background: C.ink950 }}>
               <div style={{ zoom: 0.8, pointerEvents: 'none' }}>
                 {/* Only rendering Highlights to keep it simple and focused */}
                 <Highlights experienceData={formData} />
               </div>
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

const smallInputStyle = {
  width: '100%',
  padding: '8px 10px',
  background: C.ink950,
  border: `1px solid ${C.lineDark}`,
  borderRadius: '3px',
  color: C.ivory50,
  fontSize: '12px',
  outline: 'none',
  fontFamily: SANS,
};

const labelStyle = { 
  display: 'block', 
  fontSize: '12px', 
  color: C.stone400, 
  marginBottom: '6px' 
};

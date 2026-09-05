import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import QnASection from './QnASection';

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

export default function AdminQASession() {
  const [formData, setFormData] = useState({
    eyebrow: '',
    title_plain: '',
    title_italic: '',
    title_end: '',
    lede: '',
    quote: '',
    faqs: []
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('qa_session').select('*').eq('id', 1).single();
    if (data) {
      setFormData(data);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateArrayItem = (index, field, value) => {
    const newArray = [...formData.faqs];
    newArray[index][field] = value;
    setFormData({ ...formData, faqs: newArray });
  };

  const removeArrayItem = (index) => {
    const newArray = [...formData.faqs];
    newArray.splice(index, 1);
    setFormData({ ...formData, faqs: newArray });
  };

  const addArrayItem = () => {
    setFormData({ ...formData, faqs: [...formData.faqs, { question: 'New Question', answer: 'New Answer' }] });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const { error } = await supabase.from('qa_session').upsert({
      id: 1,
      ...formData
    });

    if (error) {
      setMessage({ type: 'error', text: 'Failed to save changes.' });
    } else {
      setMessage({ type: 'success', text: 'Q&A Session content saved successfully!' });
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
              <h2 style={{ fontFamily: SERIF, fontSize: '20px', color: C.ivory50, fontWeight: 600 }}>Q&A Session Management</h2>
            </div>
            <button onClick={handleSave} disabled={saving || loading} style={{ padding: '10px 24px', background: C.brass400, color: C.ink950, border: 'none', borderRadius: '3px', fontWeight: 600, fontSize: '13px', cursor: (saving || loading) ? 'not-allowed' : 'pointer', fontFamily: SANS, opacity: (saving || loading) ? 0.7 : 1 }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Header Section */}
              <div style={{ background: C.ink800, border: `1px solid ${C.lineDark}`, borderRadius: '3px', padding: '24px' }}>
                <h3 style={{ fontFamily: SERIF, fontSize: '18px', color: C.ivory50, marginBottom: '16px' }}>Left Column Content</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Eyebrow Badge</label>
                    <input name="eyebrow" value={formData.eyebrow} onChange={handleInputChange} style={inputStyle} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Title (Plain Start)</label>
                      <input name="title_plain" value={formData.title_plain} onChange={handleInputChange} style={inputStyle} placeholder="Ask. " />
                    </div>
                    <div>
                      <label style={labelStyle}>Title (Brass & Italic)</label>
                      <input name="title_italic" value={formData.title_italic} onChange={handleInputChange} style={inputStyle} placeholder="Challenge." />
                    </div>
                    <div>
                      <label style={labelStyle}>Title (Plain End)</label>
                      <input name="title_end" value={formData.title_end} onChange={handleInputChange} style={inputStyle} placeholder=" Learn." />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Subheading (Lede)</label>
                    <textarea name="lede" value={formData.lede} onChange={handleInputChange} style={{ ...inputStyle, height: '60px', resize: 'vertical' }} />
                  </div>
                </div>
              </div>
              
              {/* Quote Section */}
              <div style={{ background: C.ink800, border: `1px solid ${C.lineDark}`, borderRadius: '3px', padding: '24px' }}>
                <h3 style={{ fontFamily: SERIF, fontSize: '18px', color: C.ivory50, marginBottom: '16px' }}>Right Column Quote</h3>
                <label style={labelStyle}>Large Quote Text</label>
                <textarea name="quote" value={formData.quote} onChange={handleInputChange} style={{ ...inputStyle, height: '60px', resize: 'vertical' }} />
              </div>

              {/* FAQs Section */}
              <div style={{ background: C.ink800, border: `1px solid ${C.lineDark}`, borderRadius: '3px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontFamily: SERIF, fontSize: '18px', color: C.ivory50 }}>Frequently Asked Questions</h3>
                  <button onClick={addArrayItem} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: `1px solid ${C.brass500}`, color: C.brass400, padding: '4px 12px', borderRadius: '3px', fontSize: '12px', cursor: 'pointer' }}>
                    <Plus size={14} /> Add Question
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {formData.faqs.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '16px', background: C.ink900, padding: '16px', borderRadius: '4px', border: `1px solid ${C.lineDark}` }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <label style={labelStyle}>Question</label>
                          <input value={item.question} onChange={e => updateArrayItem(i, 'question', e.target.value)} style={smallInputStyle} placeholder="Enter question..." />
                        </div>
                        <div>
                          <label style={labelStyle}>Answer</label>
                          <textarea value={item.answer} onChange={e => updateArrayItem(i, 'answer', e.target.value)} style={{ ...smallInputStyle, height: '60px', resize: 'vertical' }} placeholder="Enter answer..." />
                        </div>
                      </div>
                      <button onClick={() => removeArrayItem(i)} style={{ background: 'transparent', border: 'none', color: C.rose400, cursor: 'pointer', padding: '8px' }}>
                        <Trash2 size={16} />
                      </button>
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
                 <QnASection qaData={formData} />
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

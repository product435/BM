import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Registration from './Registration';

import { AdminThemeContext } from '../context/AdminThemeContext';
const SERIF = '"Fraunces","Georgia",serif';
const SANS = '"Archivo","Helvetica Neue",sans-serif';

export default function AdminEventRegistration() {
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
    eyebrow: '11 — Registration',
    title: 'Ready to be <span class="t-italic t-emerald">part of the event?</span>',
    lede: "Seats are limited and the event is curated. Tell us who's coming and how you want to show up.",
    steps: [
      { title: 'Choose your category.', description: 'Student, Visitor, Entrepreneur or Business Tycoon.' },
      { title: 'Share your details.', description: 'The form adapts to your path.' },
      { title: 'We confirm your seat.', description: 'You show up on the day and make the event count.' }
    ],
    fee_student: 0,
    fee_visitor: 500,
    fee_entrepreneur: 1000,
    fee_business_tycoon: 2000,
    upi_id: 'bmipresents@upi'
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewData, setPreviewData] = useState(null); // For live preview rendering

  useEffect(() => {
    fetchRegistrationContent();
  }, []);

  const fetchRegistrationContent = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('registration_content').select('*').eq('id', 1).single();
    if (data) {
      const parsedData = {
        ...data,
        steps: Array.isArray(data.steps) && data.steps.length === 3 ? data.steps : formData.steps
      };
      setFormData(parsedData);
      setPreviewData(data); // Preview takes the raw DB object shape
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (index, field, value) => {
    setFormData(prev => {
      const newSteps = [...prev.steps];
      newSteps[index] = { ...newSteps[index], [field]: value };
      return { ...prev, steps: newSteps };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUploading(true);

    const payload = {
      id: 1,
      eyebrow: formData.eyebrow,
      title: formData.title,
      lede: formData.lede,
      steps: formData.steps,
      fee_student: Number(formData.fee_student),
      fee_visitor: Number(formData.fee_visitor),
      fee_entrepreneur: Number(formData.fee_entrepreneur),
      fee_business_tycoon: Number(formData.fee_business_tycoon),
      upi_id: formData.upi_id
    };

    const { error } = await supabase.from('registration_content').upsert(payload);

    if (error) {
      setMessage({ type: 'error', text: 'Failed to save changes.' });
    } else {
      setMessage({ type: 'success', text: 'Content saved successfully!' });
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
            <h2 style={{ fontFamily: SERIF, fontSize: '20px', color: C.ivory50, fontWeight: 600 }}>Event Registration Management</h2>
          </div>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ flex: 1, background: C.ink800, border: `1px solid ${C.lineDark}`, borderRadius: '3px', padding: '28px' }}>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Introduction Text Block */}
                <div>
                  <h3 style={sectionHeadingStyle}>Registration Content</h3>
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
                      <label style={labelStyle}>Sub-description (Lede)</label>
                      <textarea name="lede" value={formData.lede} onChange={handleInputChange} style={{ ...inputStyle, height: '60px', resize: 'vertical' }} />
                    </div>
                  </div>
                </div>

                <hr style={{ borderTop: `1px solid ${C.lineDark}`, margin: '0' }} />

                {/* Steps Block */}
                <div>
                  <h3 style={sectionHeadingStyle}>Registration Steps (3 Items)</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginTop: '12px' }}>
                    {formData.steps.map((step, index) => (
                      <div key={index} style={{ background: C.ink900, padding: '12px', borderRadius: '3px', border: `1px solid ${C.lineDark}` }}>
                        <p style={{ fontSize: '10px', color: C.stone500, marginBottom: '8px' }}>Step {index + 1}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <input 
                            value={step.title} 
                            onChange={(e) => handleStepChange(index, 'title', e.target.value)} 
                            style={inputStyle} 
                            placeholder="Title (e.g. Choose your category.)" 
                          />
                          <input 
                            value={step.description} 
                            onChange={(e) => handleStepChange(index, 'description', e.target.value)} 
                            style={inputStyle} 
                            placeholder="Description (e.g. Student, Visitor, Entrepreneur or Business Tycoon.)" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <hr style={{ borderTop: `1px solid ${C.lineDark}`, margin: '0' }} />

                {/* Fees Block */}
                <div>
                  <h3 style={sectionHeadingStyle}>Registration Fees (INR)</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                    <div>
                      <label style={labelStyle}>Student Fee</label>
                      <input type="number" name="fee_student" value={formData.fee_student} onChange={handleInputChange} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Visitor Fee</label>
                      <input type="number" name="fee_visitor" value={formData.fee_visitor} onChange={handleInputChange} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Entrepreneur Fee</label>
                      <input type="number" name="fee_entrepreneur" value={formData.fee_entrepreneur} onChange={handleInputChange} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Business Tycoon Fee</label>
                      <input type="number" name="fee_business_tycoon" value={formData.fee_business_tycoon} onChange={handleInputChange} style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <label style={labelStyle}>Payment UPI ID</label>
                    <input type="text" name="upi_id" value={formData.upi_id} onChange={handleInputChange} style={inputStyle} />
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
               {/* Pass previewData to Registration.jsx to preview changes */}
               <Registration previewData={previewData} selectedCategory={null} onCategoryChanged={() => {}} />
               <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, pointerEvents: 'none', boxShadow: 'inset 0 0 0 4px rgba(198,164,98,0.5)' }} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}



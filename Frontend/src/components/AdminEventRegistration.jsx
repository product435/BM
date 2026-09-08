import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Trash2, Edit2, GripVertical } from 'lucide-react';
import { supabase } from '../lib/supabase';

import { AdminThemeContext } from '../context/AdminThemeContext';
const SERIF = '"Fraunces","Georgia",serif';
const SANS = '"Archivo","Helvetica Neue",sans-serif';

export default function AdminEventRegistration() {
  const { C } = React.useContext(AdminThemeContext);
  
  const [config, setConfig] = useState({ categories: [], form_fields: {} });
  const [upiId, setUpiId] = useState('bmipresents@upi');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    const { data: configData } = await supabase.from('form_config').select('*').eq('id', 1).single();
    if (configData) {
      setConfig({ categories: configData.categories, form_fields: configData.form_fields });
      if (configData.categories.length > 0) setSelectedCategory(configData.categories[0].id);
    }
    const { data: regData } = await supabase.from('registration_content').select('upi_id').eq('id', 1).single();
    if (regData && regData.upi_id) {
      setUpiId(regData.upi_id);
    }
    setLoading(false);
  };

  const handleCategoryChange = (index, field, value) => {
    const newCats = [...config.categories];
    newCats[index] = { ...newCats[index], [field]: value };
    setConfig({ ...config, categories: newCats });
  };

  const handleFieldChange = (catId, index, field, value) => {
    const newFields = { ...config.form_fields };
    newFields[catId][index] = { ...newFields[catId][index], [field]: value };
    setConfig({ ...config, form_fields: newFields });
  };

  const addField = (catId) => {
    const newFields = { ...config.form_fields };
    if (!newFields[catId]) newFields[catId] = [];
    newFields[catId].push({
      name: `customField_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false
    });
    setConfig({ ...config, form_fields: newFields });
  };

  const removeField = (catId, index) => {
    const newFields = { ...config.form_fields };
    newFields[catId].splice(index, 1);
    setConfig({ ...config, form_fields: newFields });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUploading(true);
    const { error: configError } = await supabase.from('form_config').update({
      categories: config.categories,
      form_fields: config.form_fields,
      updated_at: new Date().toISOString()
    }).eq('id', 1);

    const { error: regError } = await supabase.from('registration_content').update({
      upi_id: upiId
    }).eq('id', 1);

    if (configError || regError) {
      setMessage({ type: 'error', text: 'Failed to save changes.' });
    } else {
      setMessage({ type: 'success', text: 'Form configuration saved successfully!' });
    }
    
    setUploading(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const inputStyle = {
    width: '100%', padding: '8px 10px', background: C.ink950,
    border: `1px solid ${C.lineDark}`, borderRadius: '3px',
    color: C.ivory50, fontSize: '12px', outline: 'none', fontFamily: SANS,
  };

  if (loading) return <div style={{ padding: '40px', color: C.stone500 }}>Loading form builder...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', background: C.ink950 }}>
      <main style={{ flex: 1, padding: '32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div>
            <style>{`
              input[type=number]::-webkit-inner-spin-button, 
              input[type=number]::-webkit-outer-spin-button { 
                -webkit-appearance: none; 
                margin: 0; 
              }
              input[type=number] {
                -moz-appearance: textfield;
              }
            `}</style>
            <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.stone500, fontWeight: 700, marginBottom: '4px' }}>CMS</p>
            <h2 style={{ fontFamily: SERIF, fontSize: '20px', color: C.ivory50, fontWeight: 600 }}>Event Registration Form Builder</h2>
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              
              {/* Left Column: Categories List */}
              <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontFamily: SERIF, fontSize: '16px', color: C.ivory50 }}>Registration Categories</h3>
                {config.categories.map((cat, idx) => (
                  <div 
                    key={cat.id} 
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{ 
                      background: selectedCategory === cat.id ? C.ink800 : C.ink900, 
                      border: `1px solid ${selectedCategory === cat.id ? C.brass400 : C.lineDark}`, 
                      borderRadius: '4px', padding: '16px', cursor: 'pointer' 
                    }}
                  >
                    <input 
                      value={cat.title} onChange={e => handleCategoryChange(idx, 'title', e.target.value)} 
                      style={{ ...inputStyle, fontWeight: 'bold', marginBottom: '8px', background: 'transparent' }} 
                    />
                    <input 
                      value={cat.tagline} onChange={e => handleCategoryChange(idx, 'tagline', e.target.value)} 
                      style={{ ...inputStyle, marginBottom: '8px' }} placeholder="Tagline"
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <label style={{ fontSize: '11px', color: C.stone400 }}>Registration Fee (₹):</label>
                      <input 
                        type="number"
                        placeholder="0"
                        value={cat.fee === 0 ? '' : (cat.fee ?? '')} 
                        onChange={e => handleCategoryChange(idx, 'fee', e.target.value === '' ? 0 : parseInt(e.target.value, 10))} 
                        style={{ ...inputStyle, marginBottom: 0, flex: 1 }} 
                      />
                    </div>
                    <textarea 
                      value={cat.description} onChange={e => handleCategoryChange(idx, 'description', e.target.value)} 
                      style={{ ...inputStyle, height: '60px', resize: 'vertical' }} placeholder="Description"
                    />
                  </div>
                ))}
              </div>

              {/* Right Column: Fields for Selected Category */}
              <div style={{ flex: 1, background: C.ink800, border: `1px solid ${C.lineDark}`, borderRadius: '4px', padding: '24px' }}>
                <h3 style={{ fontFamily: SERIF, fontSize: '16px', color: C.ivory50, marginBottom: '20px' }}>
                  Form Fields for <span style={{ color: C.brass400 }}>{config.categories.find(c => c.id === selectedCategory)?.title}</span>
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {(config.form_fields[selectedCategory] || []).map((field, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', background: C.ink900, padding: '12px', border: `1px solid ${C.lineDark}`, borderRadius: '4px' }}>
                      <GripVertical size={16} color={C.stone500} style={{ cursor: 'move' }} />
                      
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '10px', color: C.stone500, marginBottom: '4px' }}>Field Key (DB Name)</label>
                        <input value={field.name} onChange={e => handleFieldChange(selectedCategory, idx, 'name', e.target.value)} style={inputStyle} disabled={field.name === 'email' || field.name === 'phone'} />
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '10px', color: C.stone500, marginBottom: '4px' }}>Field Label</label>
                        <input value={field.label} onChange={e => handleFieldChange(selectedCategory, idx, 'label', e.target.value)} style={inputStyle} />
                      </div>

                      <div style={{ width: '100px' }}>
                        <label style={{ display: 'block', fontSize: '10px', color: C.stone500, marginBottom: '4px' }}>Type</label>
                        <select value={field.type} onChange={e => handleFieldChange(selectedCategory, idx, 'type', e.target.value)} style={inputStyle}>
                          <option value="text">Text</option>
                          <option value="email">Email</option>
                          <option value="tel">Phone</option>
                          <option value="textarea">Textarea</option>
                          <option value="url">URL</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '16px' }}>
                        <input type="checkbox" checked={field.required} onChange={e => handleFieldChange(selectedCategory, idx, 'required', e.target.checked)} id={`req-${idx}`} />
                        <label htmlFor={`req-${idx}`} style={{ fontSize: '11px', color: C.stone400 }}>Required</label>
                      </div>

                      <button type="button" onClick={() => removeField(selectedCategory, idx)} style={{ background: 'transparent', border: 'none', color: C.rose400, cursor: 'pointer', paddingTop: '16px' }} disabled={field.name === 'email' || field.name === 'phone'}>
                        <Trash2 size={16} color={field.name === 'email' || field.name === 'phone' ? C.stone600 : C.rose400} />
                      </button>
                    </div>
                  ))}
                  
                  <button type="button" onClick={() => addField(selectedCategory)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: 'transparent', border: `1px dashed ${C.brass400}`, color: C.brass400, borderRadius: '4px', cursor: 'pointer' }}>
                    <Plus size={16} /> Add Field
                  </button>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '32px', paddingTop: '20px', borderTop: `1px solid ${C.lineDark}` }}>
                  {message.text ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: message.type === 'success' ? C.em500 : C.rose400, fontSize: '13px' }}>
                      <Check size={16} /> {message.text}
                    </div>
                  ) : <div />}
                  <button type="submit" disabled={uploading} style={{ padding: '10px 24px', background: C.brass400, color: C.ink950, border: 'none', borderRadius: '3px', fontWeight: 600, fontSize: '13px', cursor: uploading ? 'not-allowed' : 'pointer' }}>
                    {uploading ? 'Saving...' : 'Save Configuration'}
                  </button>
                </div>
                
                <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: `1px solid ${C.lineDark}` }}>
                  <h3 style={{ fontFamily: SERIF, fontSize: '16px', color: C.ivory50, marginBottom: '12px' }}>Payment Settings</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '11px', color: C.stone400 }}>UPI ID for QR Code Scanner</label>
                    <input 
                      value={upiId} 
                      onChange={e => setUpiId(e.target.value)} 
                      style={{ ...inputStyle, width: '100%', maxWidth: '300px' }} 
                      placeholder="e.g. bmipresents@upi"
                    />
                    <p style={{ fontSize: '11px', color: C.stone500, margin: 0 }}>This UPI ID is used to generate the "Scan to Pay" QR code.</p>
                  </div>
                </div>

              </div>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}

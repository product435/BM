import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useSiteContent } from '../context/SiteContext';
import { Save, Plus, Trash2, Edit } from 'lucide-react';
import { motion } from 'framer-motion';

const C = {
  ink950: '#0c0b09',
  ink900: '#14120f',
  ink800: '#1c1a15',
  ink700: '#262219',
  ivory50: '#f7f2e8',
  ivory100: '#efe8d8',
  stone400: '#a49a84',
  stone500: '#857b67',
  stone600: '#6b6250',
  brass300: '#dcc08a',
  brass400: '#c6a462',
  rose400: '#c87f63',
  lineDark: 'rgba(247,242,232,0.10)',
};

const SERIF = '"Fraunces","Georgia",serif';
const SANS = '"Archivo","Helvetica Neue",sans-serif';

export default function AdminCMS() {
  const { content, fetchContent } = useSiteContent();
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (content) {
      setFormData(JSON.parse(JSON.stringify(content)));
    }
  }, [content]);

  if (!formData) return <div style={{ color: C.stone500 }}>Loading CMS...</div>;

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('site_content')
      .update({ data: formData, updated_at: new Date().toISOString() })
      .eq('id', 1);

    if (error) {
      alert('Error saving content: ' + error.message);
    } else {
      await fetchContent();
      alert('Content updated successfully!');
    }
    setSaving(false);
  };

  const updateGuest = (index, field, value) => {
    const newGuests = [...formData.guests];
    newGuests[index][field] = value;
    setFormData({ ...formData, guests: newGuests });
  };

  const updateFaqStep = (index, field, value) => {
    const newFaq = { ...formData.faq };
    newFaq.steps[index][field] = value;
    setFormData({ ...formData, faq: newFaq });
  };

  return (
    <div style={{ padding: '32px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.stone500, fontWeight: 700, marginBottom: '4px' }}>Content Management</p>
          <h2 style={{ fontFamily: SERIF, fontSize: '24px', color: C.ivory50, fontWeight: 600 }}>Dynamic CMS</h2>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: C.brass400, color: C.ink950, border: 'none', padding: '10px 20px', borderRadius: '4px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '800px' }}>
        
        {/* SPEAKERS */}
        <section style={{ background: C.ink900, border: `1px solid ${C.lineDark}`, borderRadius: '6px', padding: '24px' }}>
          <h3 style={{ fontFamily: SERIF, fontSize: '18px', color: C.ivory50, marginBottom: '20px' }}>Speakers & Guests</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {formData.guests.map((guest, i) => (
              <div key={guest.id || i} style={{ background: C.ink800, padding: '16px', borderRadius: '4px', border: `1px solid ${C.lineDark}` }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: C.stone400, marginBottom: '6px' }}>Name</label>
                    <input type="text" value={guest.name} onChange={(e) => updateGuest(i, 'name', e.target.value)} style={{ width: '100%', padding: '8px', background: C.ink950, border: `1px solid ${C.lineDark}`, color: C.ivory50, borderRadius: '4px', fontFamily: SANS, fontSize: '13px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: C.stone400, marginBottom: '6px' }}>Role</label>
                    <input type="text" value={guest.role} onChange={(e) => updateGuest(i, 'role', e.target.value)} style={{ width: '100%', padding: '8px', background: C.ink950, border: `1px solid ${C.lineDark}`, color: C.ivory50, borderRadius: '4px', fontFamily: SANS, fontSize: '13px' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: C.stone400, marginBottom: '6px' }}>Description</label>
                  <textarea value={guest.description} onChange={(e) => updateGuest(i, 'description', e.target.value)} rows={2} style={{ width: '100%', padding: '8px', background: C.ink950, border: `1px solid ${C.lineDark}`, color: C.ivory50, borderRadius: '4px', fontFamily: SANS, fontSize: '13px', resize: 'none' }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section style={{ background: C.ink900, border: `1px solid ${C.lineDark}`, borderRadius: '6px', padding: '24px' }}>
          <h3 style={{ fontFamily: SERIF, fontSize: '18px', color: C.ivory50, marginBottom: '20px' }}>Q&A Session (FAQs)</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: C.stone400, marginBottom: '6px' }}>Host Name</label>
              <input type="text" value={formData.faq.host} onChange={(e) => setFormData({ ...formData, faq: { ...formData.faq, host: e.target.value } })} style={{ width: '100%', padding: '8px', background: C.ink950, border: `1px solid ${C.lineDark}`, color: C.ivory50, borderRadius: '4px', fontFamily: SANS, fontSize: '13px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: C.stone400, marginBottom: '6px' }}>Quote</label>
              <input type="text" value={formData.faq.quote} onChange={(e) => setFormData({ ...formData, faq: { ...formData.faq, quote: e.target.value } })} style={{ width: '100%', padding: '8px', background: C.ink950, border: `1px solid ${C.lineDark}`, color: C.ivory50, borderRadius: '4px', fontFamily: SANS, fontSize: '13px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {formData.faq.steps.map((step, i) => (
              <div key={step.index} style={{ background: C.ink800, padding: '16px', borderRadius: '4px', border: `1px solid ${C.lineDark}` }}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: C.stone400, marginBottom: '6px' }}>Step {step.index} Title</label>
                  <input type="text" value={step.title} onChange={(e) => updateFaqStep(i, 'title', e.target.value)} style={{ width: '100%', padding: '8px', background: C.ink950, border: `1px solid ${C.lineDark}`, color: C.ivory50, borderRadius: '4px', fontFamily: SANS, fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: C.stone400, marginBottom: '6px' }}>Text</label>
                  <textarea value={step.text} onChange={(e) => updateFaqStep(i, 'text', e.target.value)} rows={2} style={{ width: '100%', padding: '8px', background: C.ink950, border: `1px solid ${C.lineDark}`, color: C.ivory50, borderRadius: '4px', fontFamily: SANS, fontSize: '13px', resize: 'none' }} />
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

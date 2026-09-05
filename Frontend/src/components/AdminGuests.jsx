import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Check, X, Image as ImageIcon, RefreshCcw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import GuestCard from './GuestCard';

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
  marginBottom: '16px'
};

export default function AdminGuests() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingGuest, setEditingGuest] = useState(null); // null when not editing, {} for new guest, populated obj for existing
  const [formData, setFormData] = useState({});
  const [fileToUpload, setFileToUpload] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('guests').select('*').order('sort_order', { ascending: true });
    if (data) {
      setGuests(data);
    }
    setLoading(false);
  };

  const handleAddNew = () => {
    setEditingGuest({ isNew: true });
    setFormData({
      name: '',
      initials: '',
      role: 'Speaker details to be announced',
      description: 'Conversation details will be shared as the lineup is confirmed.',
      sort_order: guests.length + 1,
      image_url: ''
    });
    setPreviewImage(null);
    setFileToUpload(null);
  };

  const handleEdit = (guest) => {
    setEditingGuest(guest);
    setFormData({ ...guest });
    setPreviewImage(guest.image_url);
    setFileToUpload(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      await supabase.from('guests').delete().eq('id', id);
      fetchGuests();
    }
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
    setSaving(true);
    
    let imageUrl = formData.image_url;

    if (fileToUpload) {
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `guest_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('hero_media')
        .upload(fileName, fileToUpload);

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('hero_media')
          .getPublicUrl(fileName);
        imageUrl = publicUrl;
      }
    }

    const payload = {
      name: formData.name,
      initials: formData.initials,
      role: formData.role,
      description: formData.description,
      sort_order: formData.sort_order,
      image_url: imageUrl
    };

    let error;
    if (editingGuest.isNew) {
      const { error: insertError } = await supabase.from('guests').insert([payload]);
      error = insertError;
    } else {
      const { error: updateError } = await supabase.from('guests').update(payload).eq('id', editingGuest.id);
      error = updateError;
    }

    if (error) {
      setMessage({ type: 'error', text: 'Failed to save changes.' });
    } else {
      setEditingGuest(null);
      fetchGuests();
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
              <h2 style={{ fontFamily: SERIF, fontSize: '20px', color: C.ivory50, fontWeight: 600 }}>Guests Management</h2>
            </div>
            {!editingGuest && (
              <button onClick={handleAddNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: C.brass400, color: C.ink950, border: 'none', borderRadius: '3px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: SANS }}>
                <Plus size={16} /> Add Guest
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {editingGuest ? (
              <motion.div key="editor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ background: C.ink800, border: `1px solid ${C.lineDark}`, borderRadius: '3px', padding: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ color: C.ivory50, fontFamily: SERIF, fontSize: '18px' }}>{editingGuest.isNew ? 'New Guest' : 'Edit Guest'}</h3>
                  <button onClick={() => setEditingGuest(null)} style={{ background: 'transparent', border: 'none', color: C.stone400, cursor: 'pointer' }}><X size={20} /></button>
                </div>
                
                <form onSubmit={handleSave} style={{ display: 'flex', gap: '32px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: C.stone400, marginBottom: '6px' }}>Name</label>
                        <input name="name" value={formData.name || ''} onChange={handleInputChange} style={inputStyle} required />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: C.stone400, marginBottom: '6px' }}>Initials</label>
                        <input name="initials" value={formData.initials || ''} onChange={handleInputChange} style={inputStyle} required maxLength={3} />
                      </div>
                    </div>

                    <label style={{ display: 'block', fontSize: '12px', color: C.stone400, marginBottom: '6px' }}>Role</label>
                    <input name="role" value={formData.role || ''} onChange={handleInputChange} style={inputStyle} required />

                    <label style={{ display: 'block', fontSize: '12px', color: C.stone400, marginBottom: '6px' }}>Description</label>
                    <textarea name="description" value={formData.description || ''} onChange={handleInputChange} style={{ ...inputStyle, height: '80px', resize: 'vertical' }} required />

                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: C.stone400, marginBottom: '6px' }}>Sort Order</label>
                        <input type="number" name="sort_order" value={formData.sort_order || 0} onChange={handleInputChange} style={inputStyle} required />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: C.stone400, marginBottom: '6px' }}>Photo</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: C.ink900, border: `1px solid ${C.lineDark}`, padding: '8px', borderRadius: '3px' }}>
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: C.brass400, background: 'transparent', border: `1px solid ${C.brass500}`, padding: '5px 12px', borderRadius: '2px', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: SANS }}>
                            <RefreshCcw size={12} /> {previewImage ? 'Change' : 'Upload'}
                            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                          </label>
                          {previewImage && <span style={{ fontSize: '12px', color: C.stone400 }}>Image selected</span>}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
                      <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: C.brass400, color: C.ink950, border: 'none', borderRadius: '3px', fontWeight: 600, fontSize: '13px', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: SANS, opacity: saving ? 0.7 : 1 }}>
                        {saving ? 'Saving...' : 'Save Guest'}
                      </button>
                      {message.text && (
                        <span style={{ color: message.type === 'error' ? C.rose400 : C.em500, fontSize: '13px' }}>{message.text}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Live Card Preview */}
                  <div style={{ width: '300px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: C.stone400, marginBottom: '6px' }}>Live Preview</label>
                    <div style={{ pointerEvents: 'none', zoom: 0.8 }}>
                      <GuestCard 
                        guest={{
                          name: formData.name || 'Name',
                          initials: formData.initials || 'XX',
                          role: formData.role || 'Role',
                          description: formData.description || 'Description goes here.',
                          image: previewImage
                        }} 
                        index={formData.sort_order - 1} 
                      />
                    </div>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {loading ? (
                  <p style={{ color: C.stone400, fontSize: '14px' }}>Loading guests...</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                    {guests.map((guest, i) => (
                      <div key={guest.id} style={{ background: C.ink900, border: `1px solid ${C.lineDark}`, borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ pointerEvents: 'none', zoom: 0.8 }}>
                           <GuestCard 
                             guest={{
                               name: guest.name,
                               initials: guest.initials,
                               role: guest.role,
                               description: guest.description,
                               image: guest.image_url
                             }} 
                             index={i} 
                           />
                        </div>
                        <div style={{ display: 'flex', padding: '12px', borderTop: `1px solid ${C.lineDark}`, gap: '8px' }}>
                          <button onClick={() => handleEdit(guest)} style={{ flex: 1, padding: '8px', background: C.ink800, color: C.ivory50, border: `1px solid ${C.lineDark}`, borderRadius: '3px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <Edit2 size={14} /> Edit
                          </button>
                          <button onClick={() => handleDelete(guest.id)} style={{ padding: '8px', background: 'rgba(200, 127, 99, 0.1)', color: C.rose400, border: `1px solid rgba(200, 127, 99, 0.2)`, borderRadius: '3px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}

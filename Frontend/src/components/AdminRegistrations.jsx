import TicketPass from './TicketPass';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronRight, X, FileText, Video, ExternalLink, MessageSquare, Check, XCircle, Plus, Loader2, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Brand tokens
const C = {
  ink950: '#0c0b09', ink900: '#14120f', ink800: '#1c1a15', ink700: '#262219',
  ivory50: '#f7f2e8', ivory100: '#efe8d8',
  stone400: '#a49a84', stone500: '#857b67', stone600: '#6b6250',
  brass300: '#dcc08a', brass400: '#c6a462', brass500: '#a5844a',
  em900: '#0d2a20', em700: '#1a4d38', em600: '#1e6b4c', em500: '#2c8360', em300: '#8fc0a8',
  rose400: '#c87f63', lineDark: 'rgba(247,242,232,0.10)',
};
const SERIF = '"Fraunces","Georgia",serif';
const SANS = '"Archivo","Helvetica Neue",sans-serif';

const StatusBadge = ({ status }) => {
  let color = C.stone400, bg = 'rgba(164,154,132,0.1)';
  if (status === 'Under Review') { color = C.brass300; bg = 'rgba(220,192,138,0.1)'; }
  else if (status === 'Shortlisted') { color = C.em500; bg = 'rgba(44,131,96,0.1)'; }
  else if (status === 'Selected') { color = C.brass400; bg = 'rgba(198,164,98,0.15)'; }
  else if (status === 'Rejected') { color = C.rose400; bg = 'rgba(200,127,99,0.1)'; }

  return (
    <span style={{ padding: '4px 8px', borderRadius: '2px', background: bg, color: color, fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
      {status || 'Pending'}
    </span>
  );
};

export default function AdminRegistrations() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTrack, setFilterTrack] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    const { data: regs, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching registrations:', error);
    } else {
      setData(regs || []);
    }
    setLoading(false);
  };

  const addMockData = async () => {
    const mock = [
      {
        registration_id: 'REG-' + Math.floor(1000 + Math.random() * 9000), 
        name: 'Aarav Sharma', email: 'aarav@techxyz.com', phone: '+91 9876543210', city: 'Jaipur',
        track: 'Track 2 (Startups)', status: 'Pending', payment_status: 'Paid',
        details: { startupName: 'TechXYZ', stage: 'Early Traction', revenue: '₹5L/mo', pitchDeck: 'techxyz_pitch.pdf', video: 'youtube.com/watch?v=123' },
        notes: ''
      },
      {
        registration_id: 'REG-' + Math.floor(1000 + Math.random() * 9000), 
        name: 'Priya Patel', email: 'priya@student.edu', phone: '+91 8765432109', city: 'Delhi',
        track: 'Track 1 (Students)', status: 'Under Review', payment_status: 'Pending',
        details: { college: 'IIT Delhi', course: 'B.Tech CSE', year: '3rd Year', idCard: 'priya_id.pdf' },
        notes: 'Strong academic background.'
      }
    ];

    const { error } = await supabase.from('registrations').insert(mock);
    if (!error) {
      fetchRegistrations();
    } else {
      alert('Error adding mock data: ' + error.message);
    }
  };

  const exportCSV = () => {
    if (filteredData.length === 0) return;
    const headers = ['Registration ID', 'Name', 'Email', 'Phone', 'City', 'Track', 'Status', 'Payment Status', 'Created At', 'Notes'];
    const rows = filteredData.map(app => {
      return [
        app.registration_id,
        app.name,
        app.email,
        app.phone || '',
        app.city || '',
        app.track,
        app.status,
        app.payment_status,
        new Date(app.created_at).toLocaleDateString(),
        (app.notes || '').replace(/"/g, '""')
      ].map(val => `"${val}"`).join(',');
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + '\n' + rows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BMI_Registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          (item.registration_id && item.registration_id.toLowerCase().includes(search.toLowerCase()));
      const matchTrack = filterTrack === 'All' || item.track.includes(filterTrack);
      const matchStatus = filterStatus === 'All' || item.status === filterStatus;
      return matchSearch && matchTrack && matchStatus;
    });
  }, [data, search, filterTrack, filterStatus]);

  const updateStatus = async (newStatus) => {
    if (!selectedApp) return;
    
    // Optimistic update
    setData(prev => prev.map(app => app.id === selectedApp.id ? { ...app, status: newStatus } : app));
    setSelectedApp({ ...selectedApp, status: newStatus });

    const { error } = await supabase
      .from('registrations')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', selectedApp.id);
      
    if (error) {
      console.error('Error updating status:', error);
      // Revert on error (could implement if needed)
    }
  };

  const saveNote = async () => {
    if (!selectedApp) return;
    setSavingNote(true);
    
    const { error } = await supabase
      .from('registrations')
      .update({ notes: adminNote, updated_at: new Date().toISOString() })
      .eq('id', selectedApp.id);
      
    if (!error) {
      setData(prev => prev.map(app => app.id === selectedApp.id ? { ...app, notes: adminNote } : app));
      setSelectedApp({ ...selectedApp, notes: adminNote });
    } else {
      console.error('Error saving note:', error);
    }
    setSavingNote(false);
  };

  const openDrawer = (app) => {
    setSelectedApp(app);
    setAdminNote(app.notes || '');
  };

  return (
    <div style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Header & Controls */}
      <div style={{ marginBottom: '24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
          <div>
            <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.stone500, fontWeight: 700, marginBottom: '4px' }}>02 — Database</p>
            <h2 style={{ fontFamily: SERIF, fontSize: '24px', color: C.ivory50, fontWeight: 600 }}>Applicants</h2>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: C.brass400, border: 'none', color: C.ink950, padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              <Download size={14} /> Export CSV
            </button>
            <button onClick={addMockData} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: `1px solid ${C.brass400}`, color: C.brass400, padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
              <Plus size={14} /> Add Mock Data
            </button>
            <div style={{ fontSize: '13px', color: C.stone400 }}>Total: <span style={{ color: C.ivory50, fontWeight: 700 }}>{filteredData.length}</span></div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          {/* Search */}
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: C.stone500 }} />
            <input
              type="text" placeholder="Search name or ID..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 36px', background: C.ink900, border: `1px solid ${C.lineDark}`, borderRadius: '3px', color: C.ivory50, fontSize: '13px', fontFamily: SANS, outline: 'none' }}
              onFocus={e => e.target.style.borderColor = C.brass400} onBlur={e => e.target.style.borderColor = C.lineDark}
            />
          </div>
          {/* Track Filter */}
          <select value={filterTrack} onChange={e => setFilterTrack(e.target.value)} style={{ padding: '10px', background: C.ink900, border: `1px solid ${C.lineDark}`, borderRadius: '3px', color: C.ivory50, fontSize: '13px', fontFamily: SANS, outline: 'none', cursor: 'pointer' }}>
            <option value="All">All Tracks</option>
            <option value="Track 1">Track 1 (Students)</option>
            <option value="Track 2">Track 2 (Startups)</option>
            <option value="Track 3">Track 3 (Scale)</option>
          </select>
          {/* Status Filter */}
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '10px', background: C.ink900, border: `1px solid ${C.lineDark}`, borderRadius: '3px', color: C.ivory50, fontSize: '13px', fontFamily: SANS, outline: 'none', cursor: 'pointer' }}>
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div style={{ flex: 1, background: C.ink800, border: `1px solid ${C.lineDark}`, borderRadius: '3px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: C.ink900, position: 'sticky', top: 0, zIndex: 5 }}>
              <tr>
                {['ID', 'Applicant Info', 'Track', 'Payment', 'Date', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '16px', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.stone500, fontWeight: 600, borderBottom: `1px solid ${C.lineDark}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: C.stone500, fontSize: '14px' }}>
                    <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto', marginBottom: '12px' }} />
                    Loading applicants...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: C.stone500, fontSize: '14px' }}>No applicants found.</td>
                </tr>
              ) : (
                filteredData.map(app => (
                  <tr
                    key={app.id}
                    onClick={() => openDrawer(app)}
                    style={{ borderBottom: `1px solid ${C.lineDark}`, cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(247,242,232,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px', fontSize: '12px', color: C.stone400 }}>{app.registration_id}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: C.ivory50, marginBottom: '2px' }}>{app.name}</div>
                      <div style={{ fontSize: '12px', color: C.stone500 }}>{app.email}</div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '13px', color: C.stone400 }}>{app.track}</td>
                    <td style={{ padding: '16px', fontSize: '13px', color: app.payment_status === 'Paid' ? C.em500 : (app.payment_status === 'Failed' ? C.rose400 : C.stone400) }}>{app.payment_status}</td>
                    <td style={{ padding: '16px', fontSize: '13px', color: C.stone400 }}>{new Date(app.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '16px' }}><StatusBadge status={app.status} /></td>
                    <td style={{ padding: '16px', textAlign: 'right' }}><ChevronRight size={16} color={C.stone500} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Drawer Overlay */}
      <AnimatePresence>
        {selectedApp && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(12,11,9,0.7)', backdropFilter: 'blur(4px)', zIndex: 40 }}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '480px', background: C.ink900, borderLeft: `1px solid ${C.lineDark}`, zIndex: 50, display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)' }}
            >
              {/* Drawer Header */}
              <div style={{ padding: '24px 32px', borderBottom: `1px solid ${C.lineDark}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '11px', letterSpacing: '0.1em', color: C.brass400, textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>{selectedApp.registration_id}</p>
                  <h3 style={{ fontFamily: SERIF, fontSize: '24px', color: C.ivory50, fontWeight: 600 }}>{selectedApp.name}</h3>
                </div>
                <button onClick={() => setSelectedApp(null)} style={{ background: 'transparent', border: 'none', color: C.stone400, cursor: 'pointer' }}><X size={20} /></button>
              </div>

              {/* Drawer Content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
                
                {/* Status Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: C.ink800, borderRadius: '4px', border: `1px solid ${C.lineDark}`, marginBottom: '24px' }}>
                  <span style={{ fontSize: '13px', color: C.stone400 }}>Current Status</span>
                  <StatusBadge status={selectedApp.status} />
                </div>

                {/* Basic Info */}
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.stone500, fontWeight: 600, marginBottom: '16px' }}>Basic Info</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div><p style={{ fontSize: '11px', color: C.stone500, marginBottom: '4px' }}>Email</p><p style={{ fontSize: '14px', color: C.ivory50 }}>{selectedApp.email}</p></div>
                    <div><p style={{ fontSize: '11px', color: C.stone500, marginBottom: '4px' }}>Phone</p><p style={{ fontSize: '14px', color: C.ivory50 }}>{selectedApp.phone || '-'}</p></div>
                    <div><p style={{ fontSize: '11px', color: C.stone500, marginBottom: '4px' }}>City</p><p style={{ fontSize: '14px', color: C.ivory50 }}>{selectedApp.city || '-'}</p></div>
                    <div><p style={{ fontSize: '11px', color: C.stone500, marginBottom: '4px' }}>Track</p><p style={{ fontSize: '14px', color: C.ivory50 }}>{selectedApp.track}</p></div>
                  </div>
                </div>

                {/* Track Specific Details */}
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.stone500, fontWeight: 600, marginBottom: '16px' }}>Application Details</h4>
                  <div style={{ background: 'rgba(247,242,232,0.02)', padding: '16px', borderRadius: '4px', border: `1px solid ${C.lineDark}` }}>
                    {selectedApp.details && Object.keys(selectedApp.details).length > 0 ? Object.entries(selectedApp.details).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid rgba(247,242,232,0.05)` }}>
                        <span style={{ fontSize: '13px', color: C.stone400, textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        {key.toLowerCase().includes('deck') || key.toLowerCase().includes('idcard') ? (
                          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: C.brass400, textDecoration: 'none' }}><FileText size={14}/> View File</a>
                        ) : key.toLowerCase() === 'video' ? (
                          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: C.brass400, textDecoration: 'none' }}><Video size={14}/> Watch</a>
                        ) : (
                          <span style={{ fontSize: '14px', color: C.ivory50, fontWeight: 500 }}>{val}</span>
                        )}
                      </div>
                    )) : (
                      <span style={{ fontSize: '13px', color: C.stone500 }}>No additional details provided.</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.stone500, fontWeight: 600, marginBottom: '16px' }}>Update Status</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {['Pending', 'Under Review', 'Shortlisted', 'Selected', 'Rejected'].map(st => (
                      <button
                        key={st} onClick={() => updateStatus(st)}
                        style={{
                          padding: '8px 16px', fontSize: '12px', borderRadius: '3px', cursor: 'pointer', fontFamily: SANS,
                          background: selectedApp.status === st ? C.ink800 : 'transparent',
                          color: selectedApp.status === st ? C.ivory50 : C.stone400,
                          border: `1px solid ${selectedApp.status === st ? C.brass400 : C.lineDark}`,
                          transition: 'all 0.2s'
                        }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedApp.status === 'Selected' && (
                  <div style={{ marginTop: '20px' }}>
                    <TicketPass applicant={selectedApp} />
                  </div>
                )}

                {/* Admin Notes */}
                <div>
                  <h4 style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.stone500, fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={14}/> Internal Notes
                  </h4>
                  <textarea
                    value={adminNote} onChange={e => setAdminNote(e.target.value)}
                    placeholder="Add feedback, scores or internal jury notes here..."
                    style={{ width: '100%', height: '100px', background: C.ink800, border: `1px solid ${C.lineDark}`, borderRadius: '4px', padding: '12px', color: C.ivory50, fontSize: '13px', fontFamily: SANS, resize: 'none', outline: 'none', marginBottom: '12px' }}
                    onFocus={e => e.target.style.borderColor = C.brass400} onBlur={e => e.target.style.borderColor = C.lineDark}
                  />
                  <button
                    onClick={saveNote} disabled={savingNote}
                    style={{ width: '100%', padding: '12px', background: C.brass400, color: C.ink950, border: 'none', borderRadius: '3px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: savingNote ? 'not-allowed' : 'pointer', opacity: savingNote ? 0.7 : 1 }}
                  >
                    {savingNote ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

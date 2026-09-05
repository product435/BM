import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, ClipboardCheck, CreditCard,
  Ticket, BarChart3, Settings, Bell, Search,
  TrendingUp, DollarSign, AlertCircle, CheckCircle2, Clock, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AdminRegistrations from './AdminRegistrations';
import AdminCMS from './AdminCMS';
import AdminScanner from './AdminScanner';
import { PenTool, LayoutTemplate } from 'lucide-react';
import AdminHero from './AdminHero';
// ── Brand tokens from BMI design system ──────────────────────
const C = {
  ink950: '#0c0b09',
  ink900: '#14120f',
  ink800: '#1c1a15',
  ink700: '#262219',
  ivory50: '#f7f2e8',
  ivory100: '#efe8d8',
  sand200: '#e3d8c0',
  sand300: '#c9bb9e',
  stone400: '#a49a84',
  stone500: '#857b67',
  stone600: '#6b6250',
  brass300: '#dcc08a',
  brass400: '#c6a462',
  brass500: '#a5844a',
  em900: '#0d2a20',
  em700: '#1a4d38',
  em600: '#1e6b4c',
  em500: '#2c8360',
  em300: '#8fc0a8',
  rose400: '#c87f63',
  lineDark: 'rgba(247,242,232,0.10)',
  lineLight: 'rgba(12,11,9,0.14)',
};

const SERIF = '"Fraunces","Georgia",serif';
const SANS = '"Archivo","Helvetica Neue",sans-serif';

const NAV = [
  { name: 'Dashboard',        icon: LayoutDashboard },
  { name: 'Registrations',    icon: Users           },
  { name: 'Review',           icon: ClipboardCheck  },
  { name: 'Payments',         icon: CreditCard      },
  { name: 'Tickets & Check-in', icon: Ticket        },
  { name: 'CMS',              icon: PenTool         },
  { name: 'Hero Section',     icon: LayoutTemplate  },
  { name: 'Reports',          icon: BarChart3       },
  { name: 'Settings',         icon: Settings        },
];

const fade = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

// Short, human label for a notification line, e.g. "Track 1
// (Students)" -> "Student". Falls back to the raw track value.
const trackLabel = (track) => {
  if (!track) return 'New';
  if (track.includes('Student')) return 'Student';
  if (track.includes('Startup')) return 'Startup';
  if (track.includes('Scale')) return 'Business';
  if (track.includes('Visitor')) return 'Visitor';
  return track;
};

const timeAgo = (isoDate) => {
  if (!isoDate) return '';
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

// ── Sub-components ────────────────────────────────────────────

const Divider = () => (
  <div style={{ height: '1px', background: C.lineDark, margin: '8px 0' }} />
);

const StatCard = ({ card }) => {
  const Icon = card.icon;
  return (
    <motion.div
      variants={fade}
      whileHover={{ y: -2 }}
      style={{
        background: C.ink800, border: `1px solid ${C.lineDark}`,
        borderRadius: '3px', padding: '24px', position: 'relative', overflow: 'hidden',
        cursor: 'default', transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.4)`}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.stone400, fontWeight: 600, marginBottom: '10px' }}>{card.title}</p>
          <h3 style={{ fontFamily: SERIF, fontSize: '32px', fontWeight: 700, color: C.ivory50, lineHeight: 1 }}>{card.value}</h3>
        </div>
        <div style={{ padding: '10px', background: card.bg, borderRadius: '3px' }}>
          <Icon size={20} style={{ color: card.color }} />
        </div>
      </div>
      {/* subtle brass accent line bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${card.color}60, transparent)` }} />
    </motion.div>
  );
};

// ── Main Component ────────────────────────────────────────────
export default function AdminDashboard() {
  const [active, setActive] = useState('Dashboard');
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  // ── Registration notifications (bell) ────────────────────────
  const [notifications, setNotifications] = useState([]);
  const [unreadIds, setUnreadIds] = useState(() => new Set());
  const [bellOpen, setBellOpen] = useState(false);
  const [openRegistrationId, setOpenRegistrationId] = useState(null);
  const bellRef = useRef(null);
  const knownIdsRef = useRef(new Set());

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Initial load: most recent registrations populate the dropdown
  // immediately, before any realtime event has a chance to fire.
  useEffect(() => {
    let cancelled = false;

    const loadInitialNotifications = async () => {
      const { data, error } = await supabase
        .from('registrations')
        .select('id, name, track, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading registration notifications:', error);
        return;
      }
      if (cancelled || !data) return;

      data.forEach((row) => knownIdsRef.current.add(row.id));
      setNotifications(data);
    };

    loadInitialNotifications();

    // Realtime: new registration rows land here the moment they're
    // inserted, without a manual refresh.
    const channel = supabase
      .channel('admin-registrations-inserts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'registrations' },
        (payload) => {
          const row = payload.new;
          if (!row || knownIdsRef.current.has(row.id)) return;
          knownIdsRef.current.add(row.id);
          setNotifications((prev) => [row, ...prev].slice(0, 10));
          setUnreadIds((prev) => new Set(prev).add(row.id));
        }
      )
      .subscribe();

    // Fallback safety net: if Realtime isn't enabled/reachable for
    // this table, a light poll still surfaces new registrations
    // (read-only — no inserts, no duplicate rows) without a manual
    // page refresh.
    const pollId = setInterval(async () => {
      const { data, error: pollError } = await supabase
        .from('registrations')
        .select('id, name, track, created_at')
        .order('created_at', { ascending: false })
        .limit(10);
      if (pollError || !data || cancelled) return;

      const fresh = data.filter((row) => !knownIdsRef.current.has(row.id));
      if (fresh.length === 0) return;

      fresh.forEach((row) => knownIdsRef.current.add(row.id));
      setNotifications((prev) => [...fresh, ...prev].slice(0, 10));
      setUnreadIds((prev) => {
        const next = new Set(prev);
        fresh.forEach((row) => next.add(row.id));
        return next;
      });
    }, 20000);

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
      clearInterval(pollId);
    };
  }, []);

  // Close the dropdown on outside click.
  useEffect(() => {
    if (!bellOpen) return;
    const onClick = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [bellOpen]);

  const unreadCount = unreadIds.size;

  const handleNotificationClick = (row) => {
    setUnreadIds((prev) => {
      const next = new Set(prev);
      next.delete(row.id);
      return next;
    });
    setBellOpen(false);
    setOpenRegistrationId(row.id);
    setActive('Registrations');
  };

  const fetchDashboardStats = async () => {
    const { data: regs, error } = await supabase.from('registrations').select('*');
    if (error) {
      console.error('Error fetching stats:', error);
      return;
    }

    if (!regs) return;

    // Calculators
    const visitorsCount = regs.filter(r => r.track.includes('Visitor')).length;
    const scaleCount = regs.filter(r => r.track.includes('Scale')).length;
    const ideaCount = regs.filter(r => r.track.includes('Student') || r.track.includes('Startup')).length;

    const pending = regs.filter(r => !r.status || r.status === 'Pending').length;
    const review = regs.filter(r => r.status === 'Under Review').length;
    const short = regs.filter(r => r.status === 'Shortlisted').length;
    const selected = regs.filter(r => r.status === 'Selected').length;
    const rejected = regs.filter(r => r.status === 'Rejected').length;

    // Financial calculations (Scale track is ₹2,499)
    const paidScale = regs.filter(r => r.track.includes('Scale') && r.payment_status === 'Paid').length;
    const pendingScale = regs.filter(r => r.track.includes('Scale') && r.payment_status === 'Pending').length;
    const failedScale = regs.filter(r => r.track.includes('Scale') && r.payment_status === 'Failed').length;

    const revPaid = paidScale * 2499;
    const revPending = pendingScale * 2499;
    const revFailed = failedScale * 2499;
    const revTotal = revPaid + revPending; // assuming pending is expected revenue

    const checkedInCount = regs.filter(r => r.checked_in).length;
    const notCheckedInCount = regs.length - checkedInCount;

    setStats({
      total: regs.length,
      visitors: visitorsCount,
      scale: scaleCount,
      idea: ideaCount,
      queue: { pending, review, short, selected, rejected },
      finance: { revPaid, revPending, revFailed, revTotal },
      checkins: { checkedIn: checkedInCount, notCheckedIn: notCheckedInCount }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  // Prepare dynamic data structures
  const registrationCards = stats ? [
    { title: 'Total Registrations', value: stats.total.toLocaleString(), icon: Users,         color: C.brass400,  bg: 'rgba(198,164,98,0.1)'  },
    { title: 'Visitors',            value: stats.visitors.toLocaleString(), icon: Ticket,        color: C.em500,     bg: 'rgba(44,131,96,0.1)'   },
    { title: 'Business Man',        value: stats.scale.toLocaleString(),   icon: TrendingUp,    color: C.brass300,  bg: 'rgba(220,192,138,0.1)' },
    { title: 'Idea / Execution',    value: stats.idea.toLocaleString(),    icon: ClipboardCheck,color: C.em300,     bg: 'rgba(143,192,168,0.1)' },
  ] : [];

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);

  const financialMetrics = stats ? [
    { title: 'Total Revenue',   value: formatCurrency(stats.finance.revTotal), icon: DollarSign,   trend: 'Projected', up: true  },
    { title: 'Paid Payments',   value: formatCurrency(stats.finance.revPaid),  icon: CheckCircle2, trend: 'Received',  up: true  },
    { title: 'Pending',         value: formatCurrency(stats.finance.revPending),icon: Clock,       trend: 'Awaiting',  up: false },
    { title: 'Failed',          value: formatCurrency(stats.finance.revFailed), icon: AlertCircle, trend: 'Dropped',   up: false },
  ] : [];

  const applicationQueue = stats ? [
    { label: 'PENDING',      count: stats.queue.pending,  color: C.stone400, bg: 'rgba(164,154,132,0.1)' },
    { label: 'UNDER REVIEW', count: stats.queue.review,   color: C.brass300, bg: 'rgba(220,192,138,0.1)' },
    { label: 'SHORTLISTED',  count: stats.queue.short,    color: C.em500,    bg: 'rgba(44,131,96,0.1)'   },
    { label: 'SELECTED',     count: stats.queue.selected, color: C.brass400, bg: 'rgba(198,164,98,0.15)' },
    { label: 'REJECTED',     count: stats.queue.rejected, color: C.rose400,  bg: 'rgba(200,127,99,0.1)'  },
  ] : [];

  // Static for now since Check-in system is not built yet
  const eventStats = stats ? [
    { label: 'Total Passes', value: stats.total.toLocaleString(), pct: 100,  color: C.brass400 },
    { label: 'Checked In',       value: stats.checkins.checkedIn.toLocaleString(), pct: (stats.checkins.checkedIn / Math.max(stats.total, 1)) * 100,  color: C.em500    },
    { label: 'Not Checked In',   value: stats.checkins.notCheckedIn.toLocaleString(), pct: (stats.checkins.notCheckedIn / Math.max(stats.total, 1)) * 100,  color: C.stone500 },
  ] : [];

  return (
    <div style={{ display: 'flex', height: '100vh', background: C.ink950, fontFamily: SANS, overflow: 'hidden' }}>

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <motion.aside
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        style={{
          width: '240px', flexShrink: 0,
          background: C.ink900,
          borderRight: `1px solid ${C.lineDark}`,
          display: 'flex', flexDirection: 'column',
          zIndex: 20,
        }}
      >
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${C.lineDark}` }}>
          <img
            src="/Full_Logo.png"
            alt="BM Investment"
            style={{ width: '140px', display: 'block', filter: `drop-shadow(0 0 8px rgba(198,164,98,0.25))` }}
          />
          <p style={{ fontSize: '10px', color: C.stone500, marginTop: '8px', letterSpacing: '0.05em' }}>Admin Control Panel</p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          <p style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.stone600, marginBottom: '8px', paddingLeft: '12px', fontWeight: 700 }}>Navigation</p>
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActive(item.name)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 12px', borderRadius: '3px', border: 'none',
                  background: isActive ? `rgba(198,164,98,0.12)` : 'transparent',
                  color: isActive ? C.brass400 : C.stone400,
                  fontSize: '13px', fontWeight: isActive ? 600 : 400,
                  letterSpacing: '0.02em', cursor: 'pointer',
                  transition: 'all 0.15s', marginBottom: '2px',
                  textAlign: 'left', fontFamily: SANS,
                  borderLeft: isActive ? `2px solid ${C.brass400}` : '2px solid transparent',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(247,242,232,0.04)'; e.currentTarget.style.color = C.ivory100; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.stone400; } }}
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <Divider />

        {/* Logout Button */}
        <div style={{ padding: '0 12px 12px' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '3px', border: `1px solid rgba(200,127,99,0.2)`,
              background: 'transparent', color: C.rose400,
              fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', cursor: 'pointer', fontFamily: SANS,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,127,99,0.08)'; e.currentTarget.style.borderColor = C.rose400; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(200,127,99,0.2)'; }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* User pill */}
        <div style={{ padding: '16px 12px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: C.ink800, borderRadius: '3px', border: `1px solid ${C.lineDark}` }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: C.em700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.em600}`, flexShrink: 0 }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: C.em300 }}>AD</span>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: C.ivory50, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Admin User</p>
              <p style={{ fontSize: '11px', color: C.stone500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>admin@bminvestment.com</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* ── Main ─────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Header */}
        <header style={{
          height: '68px', background: C.ink900,
          borderBottom: `1px solid ${C.lineDark}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', flexShrink: 0, zIndex: 10,
        }}>
          <h1 style={{ fontFamily: SERIF, fontSize: '22px', fontWeight: 600, color: C.ivory50, letterSpacing: '0.01em' }}>{active}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: C.stone500 }} />
              <input
                placeholder="Search…"
                style={{
                  paddingLeft: '34px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px',
                  background: C.ink800, border: `1px solid ${C.lineDark}`, borderRadius: '3px',
                  color: C.ivory50, fontSize: '13px', outline: 'none', width: '220px',
                  fontFamily: SANS,
                }}
                onFocus={e => e.target.style.borderColor = C.brass400}
                onBlur={e => e.target.style.borderColor = C.lineDark}
              />
            </div>

            {/* Bell */}
            <div ref={bellRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setBellOpen(v => !v)}
                style={{ position: 'relative', padding: '8px', background: bellOpen ? 'rgba(247,242,232,0.05)' : 'transparent', border: 'none', cursor: 'pointer', color: bellOpen ? C.ivory50 : C.stone400, borderRadius: '3px' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(247,242,232,0.05)'; e.currentTarget.style.color = C.ivory50; }}
                onMouseLeave={e => { if (!bellOpen) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.stone400; } }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: '5px', right: '5px', minWidth: '14px', height: '14px', padding: '0 3px', background: C.rose400, borderRadius: '7px', border: `1px solid ${C.ink900}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: C.ink950, fontFamily: SANS, lineHeight: 1 }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {bellOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '340px',
                      background: C.ink900, border: `1px solid ${C.lineDark}`, borderRadius: '4px',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.5)', zIndex: 60, overflow: 'hidden',
                    }}
                  >
                    <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.lineDark}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: SERIF, fontSize: '15px', color: C.ivory50, fontWeight: 600 }}>Notifications</span>
                      {unreadCount > 0 && (
                        <span style={{ fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: C.brass400, fontWeight: 700 }}>{unreadCount} new</span>
                      )}
                    </div>

                    <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '28px 16px', textAlign: 'center', fontSize: '13px', color: C.stone500 }}>
                          No registrations yet.
                        </div>
                      ) : (
                        notifications.map((row) => {
                          const isUnread = unreadIds.has(row.id);
                          return (
                            <button
                              key={row.id}
                              onClick={() => handleNotificationClick(row)}
                              style={{
                                width: '100%', display: 'block', textAlign: 'left',
                                padding: '12px 16px', border: 'none', borderBottom: `1px solid ${C.lineDark}`,
                                background: isUnread ? 'rgba(198,164,98,0.06)' : 'transparent',
                                cursor: 'pointer', fontFamily: SANS,
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(247,242,232,0.05)'}
                              onMouseLeave={e => e.currentTarget.style.background = isUnread ? 'rgba(198,164,98,0.06)' : 'transparent'}
                            >
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                {isUnread && <span style={{ marginTop: '5px', width: '6px', height: '6px', borderRadius: '50%', background: C.rose400, flexShrink: 0 }} />}
                                <div style={{ minWidth: 0 }}>
                                  <p style={{ fontSize: '13px', color: C.ivory50, fontWeight: isUnread ? 600 : 400, marginBottom: '3px' }}>
                                    New {trackLabel(row.track)} registration — {row.name}
                                  </p>
                                  <p style={{ fontSize: '11px', color: C.stone500 }}>{timeAgo(row.created_at)}</p>
                                </div>
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>

                    <button
                      onClick={() => { setBellOpen(false); setActive('Registrations'); }}
                      style={{ width: '100%', padding: '11px', background: 'transparent', border: 'none', borderTop: `1px solid ${C.lineDark}`, color: C.brass400, fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: SANS }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(247,242,232,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      View all registrations
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar */}
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: C.em700, border: `1px solid ${C.em600}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: C.em300 }}>AD</span>
            </div>
          </div>
        </header>

        {/* Content area */}
        {active === 'Registrations' ? (
          <AdminRegistrations
            openRegistrationId={openRegistrationId}
            onOpenRegistrationHandled={() => setOpenRegistrationId(null)}
          />
        ) : active === 'CMS' ? (
          <AdminCMS />
        ) : active === 'Hero Section' ? (
          <AdminHero />
        ) : active === 'Tickets & Check-in' ? (
          <AdminScanner />
        ) : (
          <main style={{ flex: 1, overflowY: 'auto', padding: '32px', background: C.ink950 }}>
            <motion.div variants={stagger} initial="hidden" animate="visible" style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>

              {/* Section label */}
              <motion.div variants={fade}>
                <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.stone500, fontWeight: 700, marginBottom: '4px' }}>01 — Overview</p>
                <h2 style={{ fontFamily: SERIF, fontSize: '20px', color: C.ivory50, fontWeight: 600 }}>Registration Summary</h2>
              </motion.div>

              {!stats ? (
                <div style={{ color: C.stone500, fontSize: '14px' }}>Loading dashboard data...</div>
              ) : (
                <>
                  {/* Registration Stats — 4 cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '16px' }}>
                    {registrationCards.map((card, i) => <StatCard key={i} card={card} />)}
                  </div>

                  {/* Financial + Event Day */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>

                    {/* Financial */}
                    <motion.div variants={fade} style={{ background: C.ink800, border: `1px solid ${C.lineDark}`, borderRadius: '3px', padding: '28px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div>
                          <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.stone500, fontWeight: 700, marginBottom: '4px' }}>02 — Finance</p>
                          <h2 style={{ fontFamily: SERIF, fontSize: '18px', color: C.ivory50, fontWeight: 600 }}>Financial Overview</h2>
                        </div>
                        <button onClick={fetchDashboardStats} style={{ fontSize: '11px', color: C.brass400, background: 'transparent', border: `1px solid ${C.brass500}`, padding: '5px 12px', borderRadius: '2px', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: SANS }}>
                          Refresh
                        </button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {financialMetrics.map((m, i) => {
                          const Icon = m.icon;
                          return (
                            <div key={i} style={{ background: C.ink900, border: `1px solid ${C.lineDark}`, borderRadius: '3px', padding: '18px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <div style={{ padding: '7px', background: C.ink800, borderRadius: '3px', border: `1px solid ${C.lineDark}` }}>
                                  <Icon size={14} style={{ color: C.stone400 }} />
                                </div>
                                <span style={{ fontSize: '11px', color: C.stone500, letterSpacing: '0.05em' }}>{m.title}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                <span style={{ fontFamily: SERIF, fontSize: '24px', fontWeight: 700, color: C.ivory50 }}>{m.value}</span>
                                <span style={{ fontSize: '11px', fontWeight: 600, color: m.up ? C.em500 : C.stone400 }}>{m.trend}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>

                    {/* Event Day */}
                    <motion.div variants={fade} style={{ background: C.ink900, border: `1px solid ${C.lineDark}`, borderRadius: '3px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
                      {/* Gold glow top-right */}
                      <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', background: C.brass400, opacity: 0.07, borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />

                      <div style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                        <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.stone500, fontWeight: 700, marginBottom: '4px' }}>03 — Event Day</p>
                        <h2 style={{ fontFamily: SERIF, fontSize: '18px', color: C.ivory50, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Ticket size={18} style={{ color: C.brass400 }} /> Status
                        </h2>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 1 }}>
                        {eventStats.map((s, i) => (
                          <div key={i}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <span style={{ fontSize: '12px', color: C.stone400, letterSpacing: '0.03em' }}>{s.label}</span>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: C.ivory50 }}>{s.value}</span>
                            </div>
                            <div style={{ height: '3px', background: 'rgba(247,242,232,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${s.pct}%` }}
                                transition={{ duration: 1.2, delay: 0.4 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                                style={{ height: '100%', background: s.color, borderRadius: '2px' }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Application Queue */}
                  <motion.div variants={fade} style={{ background: C.ink800, border: `1px solid ${C.lineDark}`, borderRadius: '3px', padding: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <div>
                        <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.stone500, fontWeight: 700, marginBottom: '4px' }}>04 — Pipeline</p>
                        <h2 style={{ fontFamily: SERIF, fontSize: '18px', color: C.ivory50, fontWeight: 600 }}>Application Review Queue</h2>
                      </div>
                      <button onClick={() => setActive('Registrations')} style={{ fontSize: '11px', color: C.brass400, background: 'transparent', border: `1px solid ${C.brass500}`, padding: '5px 12px', borderRadius: '2px', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: SANS }}>
                        Manage Queue
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                      {applicationQueue.map((q, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ y: -2 }}
                          style={{
                            background: C.ink900, border: `1px solid ${C.lineDark}`, borderRadius: '3px',
                            padding: '20px 16px', textAlign: 'center', cursor: 'default',
                            transition: 'box-shadow 0.2s',
                            borderTop: `2px solid ${q.color}`,
                          }}
                        >
                          <p style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: q.color, fontWeight: 700, marginBottom: '10px' }}>{q.label}</p>
                          <p style={{ fontFamily: SERIF, fontSize: '30px', fontWeight: 700, color: C.ivory50 }}>{q.count}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}

            </motion.div>
          </main>
        )}
      </div>
    </div>
  );
}

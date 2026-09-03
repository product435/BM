import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, ClipboardCheck, CreditCard,
  Ticket, BarChart3, Settings, Bell, Search, UserCircle,
  TrendingUp, DollarSign, AlertCircle, CheckCircle2, Clock, Menu, X
} from 'lucide-react';

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

// ── Mock data ─────────────────────────────────────────────────
const registrationCards = [
  { title: 'Total Registrations', value: '4,289', icon: Users,         color: C.brass400,  bg: 'rgba(198,164,98,0.1)'  },
  { title: 'Visitors',            value: '1,842', icon: Ticket,        color: C.em500,     bg: 'rgba(44,131,96,0.1)'   },
  { title: 'Business Man',        value: '845',   icon: TrendingUp,    color: C.brass300,  bg: 'rgba(220,192,138,0.1)' },
  { title: 'Idea / Execution',    value: '1,602', icon: ClipboardCheck,color: C.em300,     bg: 'rgba(143,192,168,0.1)' },
];

const financialMetrics = [
  { title: 'Total Revenue',   value: '₹28.5L', icon: DollarSign,   trend: '+12.5%', up: true  },
  { title: 'Paid Payments',   value: '₹22.1L', icon: CheckCircle2, trend: '+8.2%',  up: true  },
  { title: 'Pending',         value: '₹5.4L',  icon: Clock,        trend: '-2.4%',  up: false },
  { title: 'Failed',          value: '₹1.0L',  icon: AlertCircle,  trend: '+1.1%',  up: false },
];

const applicationQueue = [
  { label: 'PENDING',      count: 423,  color: C.stone400, bg: 'rgba(164,154,132,0.1)' },
  { label: 'UNDER REVIEW', count: 156,  color: C.brass300, bg: 'rgba(220,192,138,0.1)' },
  { label: 'SHORTLISTED',  count: 89,   color: C.em500,    bg: 'rgba(44,131,96,0.1)'   },
  { label: 'SELECTED',     count: 45,   color: C.brass400, bg: 'rgba(198,164,98,0.15)' },
  { label: 'REJECTED',     count: 212,  color: C.rose400,  bg: 'rgba(200,127,99,0.1)'  },
];

const eventStats = [
  { label: 'Passes Generated', value: '3,892', pct: 90,  color: C.brass400 },
  { label: 'Checked In',       value: '2,145', pct: 55,  color: C.em500    },
  { label: 'Not Checked In',   value: '1,747', pct: 45,  color: C.stone500 },
];

const NAV = [
  { name: 'Dashboard',        icon: LayoutDashboard },
  { name: 'Registrations',    icon: Users           },
  { name: 'Review',           icon: ClipboardCheck  },
  { name: 'Payments',         icon: CreditCard      },
  { name: 'Tickets & Check-in', icon: Ticket        },
  { name: 'Reports',          icon: BarChart3       },
  { name: 'Settings',         icon: Settings        },
];

const fade = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <div style={{ padding: '28px 24px 20px', borderBottom: `1px solid ${C.lineDark}` }}>
          <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '2px', border: `1px solid ${C.brass500}`, padding: '6px 12px' }}>
            <span style={{ fontFamily: SERIF, fontSize: '18px', fontWeight: 700, color: C.ivory50, letterSpacing: '0.12em', lineHeight: 1 }}>BMI</span>
            <span style={{ fontSize: '8px', letterSpacing: '0.25em', textTransform: 'uppercase', color: C.brass400, fontWeight: 600 }}>JAIPUR</span>
          </div>
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
            <button style={{ position: 'relative', padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: C.stone400, borderRadius: '3px' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(247,242,232,0.05)'; e.currentTarget.style.color = C.ivory50; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.stone400; }}
            >
              <Bell size={18} />
              <span style={{ position: 'absolute', top: '7px', right: '7px', width: '7px', height: '7px', background: C.rose400, borderRadius: '50%', border: `1px solid ${C.ink900}` }} />
            </button>

            {/* Avatar */}
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: C.em700, border: `1px solid ${C.em600}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: C.em300 }}>AD</span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px', background: C.ink950 }}>
          <motion.div variants={stagger} initial="hidden" animate="visible" style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* Section label */}
            <motion.div variants={fade}>
              <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.stone500, fontWeight: 700, marginBottom: '4px' }}>01 — Overview</p>
              <h2 style={{ fontFamily: SERIF, fontSize: '20px', color: C.ivory50, fontWeight: 600 }}>Registration Summary</h2>
            </motion.div>

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
                  <button style={{ fontSize: '11px', color: C.brass400, background: 'transparent', border: `1px solid ${C.brass500}`, padding: '5px 12px', borderRadius: '2px', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: SANS }}>
                    View Details
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
                          <span style={{ fontSize: '11px', fontWeight: 600, color: m.up ? C.em500 : C.rose400 }}>{m.trend}</span>
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
                <button style={{ fontSize: '11px', color: C.brass400, background: 'transparent', border: `1px solid ${C.brass500}`, padding: '5px 12px', borderRadius: '2px', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: SANS }}>
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

          </motion.div>
        </main>
      </div>
    </div>
  );
}

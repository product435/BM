import React, { useState, useEffect, useCallback, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, CheckCircle2, Clock, AlertCircle, ArrowDownRight,
  Search, Download, Eye, X, RefreshCw, ChevronUp, ChevronDown
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AdminThemeContext } from '../context/AdminThemeContext';

const SERIF = '"Fraunces","Georgia",serif';
const SANS  = '"Archivo","Helvetica Neue",sans-serif';

const fade   = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.07 } } };

const STATUS_CONFIG = {
  PAID:      { label: 'Paid',      bg: 'rgba(34,197,94,0.15)',  text: '#22c55e', dot: '#22c55e'  },
  PENDING:   { label: 'Pending',   bg: 'rgba(234,179,8,0.15)',  text: '#eab308', dot: '#eab308'  },
  FAILED:    { label: 'Failed',    bg: 'rgba(239,68,68,0.15)',  text: '#ef4444', dot: '#ef4444'  },
  REFUNDED:  { label: 'Refunded',  bg: 'rgba(139,92,246,0.15)', text: '#a78bfa', dot: '#a78bfa'  },
  Paid:      { label: 'Paid',      bg: 'rgba(34,197,94,0.15)',  text: '#22c55e', dot: '#22c55e'  },
  Pending:   { label: 'Pending',   bg: 'rgba(234,179,8,0.15)',  text: '#eab308', dot: '#eab308'  },
  Failed:    { label: 'Failed',    bg: 'rgba(239,68,68,0.15)',  text: '#ef4444', dot: '#ef4444'  },
  Refunded:  { label: 'Refunded',  bg: 'rgba(139,92,246,0.15)', text: '#a78bfa', dot: '#a78bfa'  },
};

const DEFAULT_STATUS = { label: 'Unknown', bg: 'rgba(120,113,108,0.15)', text: '#78716c', dot: '#78716c' };

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || DEFAULT_STATUS;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '99px',
      background: cfg.bg, color: cfg.text,
      fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em',
      fontFamily: SANS, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
};

const CategoryBadge = ({ track }) => {
  const label = track?.includes('Visitor') ? 'Visitor'
    : track?.includes('Scale') || track?.includes('Business') ? 'Business Man'
    : track?.includes('Startup') || track?.includes('Idea') || track?.includes('Execution') ? 'Idea / Exec'
    : track?.includes('Student') ? 'Student'
    : track || '—';

  const colors = {
    'Visitor':      { bg: 'rgba(44,131,96,0.15)',   text: '#4ade80' },
    'Business Man': { bg: 'rgba(198,164,98,0.15)',  text: '#C6A462' },
    'Idea / Exec':  { bg: 'rgba(96,165,250,0.12)',  text: '#60a5fa' },
    'Student':      { bg: 'rgba(167,139,250,0.12)', text: '#a78bfa' },
  };
  const c = colors[label] || { bg: 'rgba(120,113,108,0.15)', text: '#a8a29e' };

  return (
    <span style={{
      padding: '3px 10px', borderRadius: '3px',
      background: c.bg, color: c.text,
      fontSize: '11px', fontWeight: 600, letterSpacing: '0.03em',
      fontFamily: SANS, whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
};

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);
const fmtDate = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' ' + dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

const truncate = (str, n = 22) => str ? (str.length > n ? str.slice(0, n) + '…' : str) : '—';

export default function AdminPayments() {
  const { C } = useContext(AdminThemeContext);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('paid_at');
  const [sortDir, setSortDir] = useState('desc');
  const [detail, setDetail] = useState(null);   // row for detail modal
  const [refreshing, setRefreshing] = useState(false);

  const fetchPayments = useCallback(async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);
    const { data, error } = await supabase
      .from('registrations')
      .select('id, name, email, phone, track, payment_status, payment_amount, razorpay_order_id, razorpay_payment_id, razorpay_signature, paid_at, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('AdminPayments fetch error:', error);
    } else if (data) {
      console.log('Raw data from Supabase:', data.length, 'rows');
      console.log('Sample first row:', data[0]);
      // Keep only rows that have a payment_amount or a non-null payment_status
      const paymentRows = data.filter(r =>
        r.payment_amount != null && Number(r.payment_amount) > 0
      );
      console.log('After filter:', paymentRows.length, 'payment rows');
      setRows(paymentRows);
    }
    setLoading(false);
    if (showSpinner) setRefreshing(false);
  }, []);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  // ---------- computed metrics ----------
  const paid     = rows.filter(r => (r.payment_status || '').toLowerCase() === 'paid');
  const pending  = rows.filter(r => (r.payment_status || '').toLowerCase() === 'pending');
  const failed   = rows.filter(r => (r.payment_status || '').toLowerCase() === 'failed');
  const refunded = rows.filter(r => (r.payment_status || '').toLowerCase() === 'refunded');

  const totalRev   = paid.reduce((s, r) => s + (Number(r.payment_amount) || 0), 0);
  const paidAmt    = totalRev;
  const pendingAmt = pending.reduce((s, r) => s + (Number(r.payment_amount) || 0), 0);
  const failedAmt  = failed.reduce((s, r) => s + (Number(r.payment_amount) || 0), 0);
  const refundAmt  = refunded.reduce((s, r) => s + (Number(r.payment_amount) || 0), 0);

  const METRIC_CARDS = [
    { title: 'Total Revenue',          value: fmt(totalRev),   sub: `${paid.length} txns`, icon: DollarSign,    color: '#C6A462', bg: 'rgba(198,164,98,0.12)'   },
    { title: 'Paid',                   value: fmt(paidAmt),    sub: `${paid.length} successful`, icon: CheckCircle2, color: '#22c55e', bg: 'rgba(34,197,94,0.1)'    },
    { title: 'Pending',                value: fmt(pendingAmt), sub: `${pending.length} awaiting`, icon: Clock,    color: '#eab308', bg: 'rgba(234,179,8,0.1)'    },
    { title: 'Failed / Dropped',       value: fmt(failedAmt),  sub: `${failed.length} txns`, icon: AlertCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)'    },
    { title: 'Refunded',               value: fmt(refundAmt),  sub: `${refunded.length} txns`, icon: ArrowDownRight, color: '#a78bfa', bg: 'rgba(139,92,246,0.1)' },
  ];

  // ---------- filtering + sorting ----------
  const filtered = rows
    .filter(r => {
      if (statusFilter !== 'All') {
        const st = (r.payment_status || '').toUpperCase();
        if (st !== statusFilter.toUpperCase()) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        return (r.name || '').toLowerCase().includes(q)
          || (r.email || '').toLowerCase().includes(q)
          || (r.razorpay_payment_id || '').toLowerCase().includes(q)
          || (r.razorpay_order_id || '').toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (sortField === 'payment_amount') { va = Number(va) || 0; vb = Number(vb) || 0; }
      if (va == null) return 1; if (vb == null) return -1;
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  // ---------- CSV export ----------
  const exportCSV = () => {
    const headers = ['Date', 'Name', 'Email', 'Category', 'Amount', 'Razorpay Payment ID', 'Razorpay Order ID', 'Status'];
    const csvRows = [
      headers.join(','),
      ...filtered.map(r => [
        fmtDate(r.paid_at || r.created_at),
        `"${r.name || ''}"`,
        r.email || '',
        r.track || '',
        r.payment_amount || 0,
        r.razorpay_payment_id || '',
        r.razorpay_order_id || '',
        r.payment_status || '',
      ].join(',')),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'bmi_payments.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp size={12} style={{ opacity: 0.3 }} />;
    return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  const TH = ({ label, field, style = {} }) => (
    <th
      onClick={field ? () => toggleSort(field) : undefined}
      style={{
        padding: '10px 16px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.14em',
        textTransform: 'uppercase', fontWeight: 700, color: C.stone400,
        borderBottom: `1px solid ${C.cardBorder}`, cursor: field ? 'pointer' : 'default',
        whiteSpace: 'nowrap', userSelect: 'none', fontFamily: SANS, ...style,
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        {label}{field && <SortIcon field={field} />}
      </span>
    </th>
  );

  const inputStyle = {
    background: C.cardBg, border: `1px solid ${C.cardBorder}`,
    borderRadius: '3px', color: C.ivory50, fontFamily: SANS, fontSize: '13px',
    padding: '9px 14px', outline: 'none',
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <main style={{ flex: 1, overflowY: 'auto', padding: '32px', background: C.ink950 }}>
      <motion.div variants={stagger} initial="hidden" animate="visible"
        style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* ── Page header ── */}
        <motion.div variants={fade} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.stone500, fontWeight: 700, marginBottom: '4px' }}>
              Finance
            </p>
            <h2 style={{ fontFamily: SERIF, fontSize: '22px', color: C.ivory50, fontWeight: 600 }}>
              Payment Overview
            </h2>
          </div>
          <button
            onClick={() => fetchPayments(true)}
            disabled={refreshing}
            style={{
              ...inputStyle, display: 'flex', alignItems: 'center', gap: '7px',
              cursor: 'pointer', color: C.stone400, padding: '8px 14px',
            }}
          >
            <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </motion.div>

        {/* ── Metric cards ── */}
        <motion.div variants={fade} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '16px' }}>
          {METRIC_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.title} whileHover={{ y: -2 }}
                style={{
                  background: C.cardBg, border: `1px solid ${C.cardBorder}`,
                  borderRadius: '3px', padding: '20px', position: 'relative', overflow: 'hidden',
                  boxShadow: C.cardShadow,
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <p style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.stone400, fontWeight: 600 }}>
                    {card.title}
                  </p>
                  <div style={{ padding: '8px', background: card.bg, borderRadius: '3px' }}>
                    <Icon size={16} style={{ color: card.color }} />
                  </div>
                </div>
                <h3 style={{ fontFamily: SERIF, fontSize: '26px', fontWeight: 700, color: C.ivory50, lineHeight: 1, marginBottom: '6px' }}>
                  {card.value}
                </h3>
                <p style={{ fontSize: '11px', color: C.stone500, fontFamily: SANS }}>
                  {card.sub}
                </p>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${card.color}70, transparent)` }} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Search + Filter + Export ── */}
        <motion.div variants={fade} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '200px' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: C.stone500, pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email, payment ID…"
              style={{ ...inputStyle, paddingLeft: '36px', width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {['All', 'PAID', 'PENDING', 'FAILED', 'REFUNDED'].map(s => (
              <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
            ))}
          </select>

          {/* Export */}
          <button
            onClick={exportCSV}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '9px 18px', background: 'rgba(198,164,98,0.12)',
              border: '1px solid rgba(198,164,98,0.3)', borderRadius: '3px',
              color: '#C6A462', fontSize: '13px', fontWeight: 600,
              fontFamily: SANS, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(198,164,98,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(198,164,98,0.12)'; }}
          >
            <Download size={14} />
            Export CSV
          </button>

          {/* Result count */}
          <span style={{ fontSize: '12px', color: C.stone500, fontFamily: SANS, whiteSpace: 'nowrap' }}>
            {filtered.length} record{filtered.length !== 1 ? 's' : ''}
          </span>
        </motion.div>

        {/* ── Table ── */}
        <motion.div variants={fade}
          style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '3px', overflow: 'hidden', boxShadow: C.cardShadow }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: C.stone500, fontFamily: SANS, fontSize: '14px' }}>
              Loading transactions…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '56px', textAlign: 'center' }}>
              <p style={{ color: C.stone500, fontFamily: SANS, fontSize: '14px' }}>No transactions found.</p>
              {(search || statusFilter !== 'All') && (
                <button onClick={() => { setSearch(''); setStatusFilter('All'); }}
                  style={{ marginTop: '12px', background: 'transparent', border: `1px solid ${C.cardBorder}`, borderRadius: '3px', color: C.stone400, padding: '7px 16px', cursor: 'pointer', fontFamily: SANS, fontSize: '12px' }}>
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: SANS }}>
                <thead>
                  <tr style={{ background: C.ink800 }}>
                    <TH label="Date & Time"    field="paid_at" />
                    <TH label="Name / Email" />
                    <TH label="Category" />
                    <TH label="Amount"         field="payment_amount" style={{ textAlign: 'right' }} />
                    <TH label="Payment ID" />
                    <TH label="Status"         field="payment_status" />
                    <TH label="" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, i) => (
                    <tr key={row.id}
                      style={{ borderBottom: `1px solid ${C.cardBorder}`, background: i % 2 === 0 ? 'transparent' : 'rgba(247,242,232,0.01)', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(198,164,98,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(247,242,232,0.01)'}
                    >
                      {/* Date */}
                      <td style={{ padding: '13px 16px', fontSize: '12px', color: C.stone400, whiteSpace: 'nowrap' }}>
                        {fmtDate(row.paid_at || row.created_at)}
                      </td>

                      {/* Name / Email */}
                      <td style={{ padding: '13px 16px' }}>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: C.ivory100, marginBottom: '2px' }}>{row.name || '—'}</p>
                        <p style={{ fontSize: '11px', color: C.stone500 }}>{row.email || '—'}</p>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '13px 16px' }}>
                        <CategoryBadge track={row.track} />
                      </td>

                      {/* Amount */}
                      <td style={{ padding: '13px 16px', textAlign: 'right', fontSize: '14px', fontWeight: 700, color: C.ivory50, whiteSpace: 'nowrap' }}>
                        {row.payment_amount ? fmt(row.payment_amount) : '—'}
                      </td>

                      {/* Payment ID */}
                      <td style={{ padding: '13px 16px' }}>
                        {row.razorpay_payment_id ? (
                          <span
                            title={row.razorpay_payment_id}
                            style={{ fontFamily: 'monospace', fontSize: '11px', color: C.stone400, cursor: 'pointer' }}
                            onClick={() => navigator.clipboard.writeText(row.razorpay_payment_id)}
                          >
                            {truncate(row.razorpay_payment_id, 18)}
                          </span>
                        ) : (
                          <span style={{ color: C.stone600, fontSize: '12px' }}>—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '13px 16px' }}>
                        <StatusBadge status={row.payment_status} />
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '13px 16px' }}>
                        <button
                          onClick={() => setDetail(row)}
                          title="View details"
                          style={{
                            background: 'rgba(198,164,98,0.08)', border: `1px solid rgba(198,164,98,0.2)`,
                            borderRadius: '3px', padding: '6px 10px', cursor: 'pointer',
                            color: '#C6A462', display: 'flex', alignItems: 'center',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(198,164,98,0.18)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(198,164,98,0.08)'}
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {detail && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDetail(null)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
              zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: C.ink800, border: `1px solid ${C.cardBorder}`,
                borderRadius: '4px', padding: '28px', maxWidth: '520px', width: '100%',
                boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <p style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.stone500, marginBottom: '4px', fontFamily: SANS }}>Transaction Detail</p>
                  <h3 style={{ fontFamily: SERIF, fontSize: '20px', color: C.ivory50, fontWeight: 600 }}>{detail.name}</h3>
                </div>
                <button onClick={() => setDetail(null)} style={{ background: 'transparent', border: 'none', color: C.stone400, cursor: 'pointer', display: 'flex', padding: '4px' }}>
                  <X size={20} />
                </button>
              </div>

              {[
                ['Status',              <StatusBadge status={detail.payment_status} />],
                ['Amount',             fmt(detail.payment_amount)],
                ['Email',              detail.email || '—'],
                ['Phone',              detail.phone || '—'],
                ['Category',           <CategoryBadge track={detail.track} />],
                ['Paid At',            fmtDate(detail.paid_at)],
                ['Razorpay Order ID',  detail.razorpay_order_id || '—'],
                ['Razorpay Payment ID',detail.razorpay_payment_id || '—'],
                ['Signature',          detail.razorpay_signature ? truncate(detail.razorpay_signature, 32) : '—'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.cardBorder}` }}>
                  <span style={{ fontSize: '12px', color: C.stone500, fontFamily: SANS }}>{k}</span>
                  <span style={{ fontSize: '13px', color: C.ivory100, fontFamily: typeof v === 'string' ? 'monospace' : SANS, fontWeight: typeof v === 'string' ? 500 : 400 }}>
                    {v}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* spin keyframe */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}

import { AdminThemeContext } from '../context/AdminThemeContext';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Mail, Lock, ArrowRight, Shield } from 'lucide-react';

const AdminLogin = () => {
  const { C } = useContext(AdminThemeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message || 'Invalid credentials.');
      } else if (data.session) {
        navigate('/admin');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!email) {
      setError('Please enter your email address to reset password.');
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        if (error.status === 429 || error.message?.toLowerCase().includes('rate limit')) {
          setError('You have requested too many password resets. Please check your inbox/spam or wait 1 hour before trying again.');
        } else {
          setError(error.message || 'Error sending reset email.');
        }
      } else {
        setSuccessMsg('Password reset link sent to your email.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Luxury Gold / Charcoal Palette
  const bgDark = '#0a0a0c';
  const cardBg = 'rgba(18, 18, 20, 0.75)';
  const gold = '#d4af37'; // A refined gold
  const goldMuted = '#b89947';
  const textLight = '#f5f5f5';
  const textMuted = '#9ca3af';
  const inputBg = 'rgba(255, 255, 255, 0.03)';
  const borderColor = 'rgba(212, 175, 55, 0.15)'; // Subtle gold border

  return (
    <div style={{ backgroundColor: bgDark, minHeight: '100vh', fontFamily: '"Archivo","Helvetica Neue",sans-serif', position: 'relative', overflow: 'hidden' }}>

      {/* Background Image / Texture Layer */}
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/images/hero-bg.jpg)', // Assuming hero-bg.jpg or similar exists, fallback is dark bg
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          pointerEvents: 'none',
          mixBlendMode: 'luminosity' // Ensures it stays grayscale/dark
        }}
      />
      {/* Dark overlay to ensure form remains the focus */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, #0a0a0c 80%)', pointerEvents: 'none' }} />

      {/* Subtle decorative gold lines */}
      <div style={{ position: 'absolute', top: 0, left: '20%', width: '1px', height: '100%', background: `linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.1), transparent)` }} />
      <div style={{ position: 'absolute', top: 0, right: '20%', width: '1px', height: '100%', background: `linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.1), transparent)` }} />

      {/* Desktop Left Content */}
      <div className="hidden lg:flex" style={{ position: 'absolute', top: 0, bottom: 0, left: '60px', flexDirection: 'column', justifyContent: 'center', zIndex: 10, width: '200px' }}>
        <div style={{ color: textLight, letterSpacing: '0.25em', fontSize: '13px', lineHeight: 2.8, fontWeight: 500, marginBottom: '24px' }}>
          <div>IDEAS</div>
          <div>EXECUTION</div>
          <div>GROWTH</div>
        </div>
        <div style={{ width: '24px', height: '1px', backgroundColor: gold, marginBottom: '24px' }} />
        <div style={{ color: textMuted, letterSpacing: '0.15em', fontSize: '10px', textTransform: 'uppercase', lineHeight: 1.8 }}>
          POWERING<br />TOMORROW'S<br />OPPORTUNITIES
        </div>

        {/* Bottom Left */}
        <div style={{ position: 'absolute', bottom: '40px', left: 0, color: textMuted, fontSize: '10px', letterSpacing: '0.25em', display: 'flex', alignItems: 'center', gap: '16px', whiteSpace: 'nowrap' }}>
          JAIPUR • INDIA
          <div style={{ width: '40px', height: '1px', backgroundColor: borderColor }} />
        </div>
      </div>

      {/* Desktop Right Content */}
      <div className="hidden lg:flex" style={{ position: 'absolute', top: 0, bottom: 0, right: '60px', flexDirection: 'column', justifyContent: 'center', zIndex: 10, width: '200px', alignItems: 'flex-end', textAlign: 'right' }}>
        <div style={{ color: gold, fontSize: '26px', fontFamily: '"Fraunces","Georgia",serif', fontStyle: 'italic', marginBottom: '16px', lineHeight: 1.3 }}>
          “<br />Enabling ideas<br />that create impact.
        </div>
        <div style={{ width: '24px', height: '1px', backgroundColor: gold }} />

        {/* Bottom Right */}
        <div style={{ position: 'absolute', bottom: '40px', right: 0, color: textMuted, fontSize: '10px', letterSpacing: '0.25em', whiteSpace: 'nowrap' }}>
          CAPITAL. CAPABILITY. CONNECTIONS.
        </div>
      </div>

      {/* Center Form Area */}
      <div style={{ position: 'relative', zIndex: 20, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '100%',
            maxWidth: '440px',
            background: cardBg,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid ${borderColor}`,
            borderRadius: '16px',
            padding: '48px 40px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* Logo & Header */}
          <div className="text-center mb-10">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <img
                src="/images/full_logo.png"
                alt="BM Investment"
                style={{ width: '160px', filter: `drop-shadow(0 0 16px rgba(212,175,55,0.2))` }}
              />
            </div>
            <h1 style={{ fontFamily: '"Fraunces","Georgia",serif', fontSize: '26px', fontWeight: 500, color: textLight, lineHeight: 1.2, marginBottom: '8px' }}>
              Admin Portal
            </h1>
            <p style={{ fontSize: '13px', color: textMuted, letterSpacing: '0.02em' }}>
              Sign in to manage the event ecosystem.
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Error / Success Alerts */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '4px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', fontSize: '13px', marginBottom: '-8px' }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </motion.div>
              )}
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '4px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px', color: '#22c55e', fontSize: '13px', marginBottom: '-8px' }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div>
              <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, marginBottom: '10px', fontWeight: 600 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: textMuted }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bminvestment.com"
                  style={{
                    width: '100%', padding: '14px 16px 14px 44px',
                    background: inputBg, border: `1px solid ${borderColor}`, borderRadius: '6px',
                    color: textLight, fontSize: '14px', outline: 'none', transition: 'border-color 0.2s, background-color 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={e => { e.target.style.borderColor = gold; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                  onBlur={e => { e.target.style.borderColor = borderColor; e.target.style.background = inputBg; }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, fontWeight: 600 }}>Password</label>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: textMuted }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '14px 16px 14px 44px',
                    background: inputBg, border: `1px solid ${borderColor}`, borderRadius: '6px',
                    color: textLight, fontSize: '14px', outline: 'none', transition: 'border-color 0.2s, background-color 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={e => { e.target.style.borderColor = gold; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                  onBlur={e => { e.target.style.borderColor = borderColor; e.target.style.background = inputBg; }}
                />
              </div>
            </div>

            {/* Keep me signed in */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '-4px' }}>
              <div style={{ position: 'relative', width: '16px', height: '16px' }}>
                <input
                  type="checkbox"
                  id="keepSignedIn"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  style={{ appearance: 'none', width: '100%', height: '100%', margin: 0, border: `1px solid ${borderColor}`, borderRadius: '3px', background: keepSignedIn ? gold : inputBg, cursor: 'pointer', display: 'block' }}
                />
                {keepSignedIn && (
                  <div style={{ position: 'absolute', left: '5px', top: '2px', width: '4px', height: '8px', borderRight: '2px solid #111', borderBottom: '2px solid #111', transform: 'rotate(45deg)', pointerEvents: 'none' }} />
                )}
              </div>
              <label htmlFor="keepSignedIn" style={{ fontSize: '12px', color: textMuted, cursor: 'pointer', userSelect: 'none' }}>
                Keep me signed in
              </label>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%', padding: '14px', marginTop: '4px',
                background: isLoading ? goldMuted : gold,
                border: 'none', borderRadius: '6px',
                color: '#111', fontSize: '12px', fontWeight: 600,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                transition: 'background 0.2s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => { if (!isLoading) e.target.style.background = '#e5c04c'; }}
              onMouseLeave={e => { if (!isLoading) e.target.style.background = gold; }}
            >
              {isLoading ? (
                <div style={{ width: '18px', height: '18px', border: `2px solid #111`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              ) : (
                <><span>Sign In Securely</span><ArrowRight size={16} /></>
              )}
            </button>

          </form>

          {/* Footer Security Text */}
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: textMuted, fontSize: '10px', letterSpacing: '0.05em', marginBottom: '4px' }}>
              <Lock size={10} /> Secure connection for BM Investment personnel only.
            </div>
            <div style={{ color: '#6b7280', fontSize: '10px', letterSpacing: '0.02em' }}>
              Unauthorised access is strictly prohibited.
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Copy */}
      <div className="hidden lg:block" style={{ position: 'absolute', bottom: '40px', width: '100%', textAlign: 'center', color: '#6b7280', fontSize: '10px', letterSpacing: '0.05em', pointerEvents: 'none', zIndex: 10 }}>
        © 2026 BM Investment. All rights reserved.
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AdminLogin;

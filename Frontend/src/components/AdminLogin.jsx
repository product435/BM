import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Brand colors from BMI design system
const brand = {
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
  brass300: '#dcc08a',
  brass400: '#c6a462',
  brass500: '#a5844a',
  emerald600: '#1e6b4c',
  emerald500: '#2c8360',
  lineDark: 'rgba(247,242,232,0.12)',
};

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
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

  return (
    <div
      style={{ background: brand.ink950, fontFamily: '"Archivo","Helvetica Neue",sans-serif', minHeight: '100vh' }}
      className="flex items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '360px', height: '360px', background: brand.emerald600, opacity: 0.07, borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '360px', height: '360px', background: brand.brass400, opacity: 0.10, borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

      {/* Thin horizontal rule accent top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${brand.brass400}, transparent)` }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: brand.ink800,
          border: `1px solid ${brand.lineDark}`,
          borderRadius: '4px',
          padding: '48px 40px 40px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Brand mark */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            {/* Logo */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <img
                src="/Full_Logo.png"
                alt="BM Investment"
                style={{
                  width: '180px',
                  filter: `drop-shadow(0 0 12px rgba(198,164,98,0.3))`,
                }}
              />
            </div>
            <h1 style={{ fontFamily: '"Fraunces","Georgia",serif', fontSize: '28px', fontWeight: 600, color: brand.ivory50, lineHeight: 1.2, marginBottom: '8px' }}>
              Admin Portal
            </h1>
            <p style={{ fontSize: '13px', color: brand.stone400, letterSpacing: '0.02em' }}>Sign in to manage the event ecosystem.</p>
          </motion.div>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ background: 'rgba(200,80,80,0.12)', border: '1px solid rgba(200,80,80,0.25)', borderRadius: '3px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', color: '#e07070', fontSize: '13px' }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: brand.stone400, marginBottom: '8px', fontWeight: 600 }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: brand.stone500 }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bminvestment.com"
                style={{
                  width: '100%', padding: '12px 14px 12px 40px',
                  background: brand.ink900, border: `1px solid ${brand.lineDark}`, borderRadius: '3px',
                  color: brand.ivory50, fontSize: '14px', outline: 'none', transition: 'border 0.2s',
                  fontFamily: 'inherit',
                }}
                onFocus={e => e.target.style.borderColor = brand.brass400}
                onBlur={e => e.target.style.borderColor = brand.lineDark}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: brand.stone400, fontWeight: 600 }}>Password</label>
              <a href="#" style={{ fontSize: '11px', color: brand.brass400, textDecoration: 'none', letterSpacing: '0.05em' }}>Forgot?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: brand.stone500 }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '12px 14px 12px 40px',
                  background: brand.ink900, border: `1px solid ${brand.lineDark}`, borderRadius: '3px',
                  color: brand.ivory50, fontSize: '14px', outline: 'none', transition: 'border 0.2s',
                  fontFamily: 'inherit',
                }}
                onFocus={e => e.target.style.borderColor = brand.brass400}
                onBlur={e => e.target.style.borderColor = brand.lineDark}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%', padding: '14px',
              background: isLoading ? brand.brass500 : brand.brass400,
              border: 'none', borderRadius: '3px',
              color: brand.ink950, fontSize: '12px', fontWeight: 700,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              transition: 'background 0.2s, transform 0.1s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => { if (!isLoading) e.target.style.background = brand.brass300; }}
            onMouseLeave={e => { if (!isLoading) e.target.style.background = brand.brass400; }}
          >
            {isLoading ? (
              <div style={{ width: '18px', height: '18px', border: `2px solid ${brand.ink800}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            ) : (
              <><span>Sign In Securely</span><LogIn size={15} /></>
            )}
          </button>
        </form>

        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: `1px solid ${brand.lineDark}`, textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: brand.stone500, letterSpacing: '0.05em', lineHeight: 1.7 }}>
            Secure connection for BM Investment personnel only.<br />
            Unauthorised access is strictly prohibited.
          </p>
        </div>
      </motion.div>

      {/* Spinner keyframes */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AdminLogin;

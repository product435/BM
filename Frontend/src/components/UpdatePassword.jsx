import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Lock, ArrowRight, Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';

const UpdatePassword = () => {
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const getPasswordStrength = (pass) => {
    if (pass.length === 0) return { label: '', color: 'transparent', width: '0%' };
    if (pass.length < 6) return { label: 'Weak', color: '#ef4444', width: '33%' };
    if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) return { label: 'Strong', color: '#22c55e', width: '100%' };
    return { label: 'Medium', color: '#eab308', width: '66%' };
  };

  const strength = getPasswordStrength(password);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage({ type: 'error', text: error.message });
      setLoading(false);
    } else {
      setMessage({ type: 'success', text: 'Password updated successfully! Redirecting...' });
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    }
  };

  // Luxury Gold / Charcoal Palette
  const bgDark = '#0a0a0c';
  const cardBg = 'rgba(18, 18, 20, 0.75)';
  const gold = '#d4af37'; 
  const goldMuted = '#b89947';
  const textLight = '#f5f5f5';
  const textMuted = '#9ca3af';
  const inputBg = 'rgba(255, 255, 255, 0.03)';
  const borderColor = 'rgba(212, 175, 55, 0.15)'; 

  return (
    <div style={{ backgroundColor: bgDark, minHeight: '100vh', fontFamily: '"Archivo","Helvetica Neue",sans-serif', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Image / Texture Layer */}
      <div 
        style={{ 
          position: 'absolute', inset: 0, 
          backgroundImage: 'url(/images/hero-bg.jpg)',
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          opacity: 0.15, 
          pointerEvents: 'none',
          mixBlendMode: 'luminosity' 
        }} 
      />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, #0a0a0c 80%)', pointerEvents: 'none' }} />
      
      {/* Subtle decorative gold lines */}
      <div style={{ position: 'absolute', top: 0, left: '20%', width: '1px', height: '100%', background: 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.1), transparent)' }} />
      <div style={{ position: 'absolute', top: 0, right: '20%', width: '1px', height: '100%', background: 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.1), transparent)' }} />

      {/* Desktop Left Content */}
      <div className="hidden lg:flex" style={{ position: 'absolute', top: 0, bottom: 0, left: '60px', flexDirection: 'column', justifyContent: 'center', zIndex: 10, width: '200px' }}>
        <div style={{ color: textLight, letterSpacing: '0.25em', fontSize: '13px', lineHeight: 2.8, fontWeight: 500, marginBottom: '24px' }}>
          <div>IDEAS</div>
          <div>EXECUTION</div>
          <div>GROWTH</div>
        </div>
        <div style={{ width: '24px', height: '1px', backgroundColor: gold, marginBottom: '24px' }} />
        <div style={{ color: textMuted, letterSpacing: '0.15em', fontSize: '10px', textTransform: 'uppercase', lineHeight: 1.8 }}>
          POWERING<br/>TOMORROW'S<br/>OPPORTUNITIES
        </div>
        
        <div style={{ position: 'absolute', bottom: '40px', left: 0, color: textMuted, fontSize: '10px', letterSpacing: '0.25em', display: 'flex', alignItems: 'center', gap: '16px', whiteSpace: 'nowrap' }}>
          JAIPUR • INDIA
          <div style={{ width: '40px', height: '1px', backgroundColor: borderColor }} />
        </div>
      </div>

      {/* Desktop Right Content */}
      <div className="hidden lg:flex" style={{ position: 'absolute', top: 0, bottom: 0, right: '60px', flexDirection: 'column', justifyContent: 'center', zIndex: 10, width: '200px', alignItems: 'flex-end', textAlign: 'right' }}>
        <div style={{ color: gold, fontSize: '26px', fontFamily: '"Fraunces","Georgia",serif', fontStyle: 'italic', marginBottom: '16px', lineHeight: 1.3 }}>
          “<br/>Enabling ideas<br/>that create impact.
        </div>
        <div style={{ width: '24px', height: '1px', backgroundColor: gold }} />
        
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
                src="/Full_Logo.png"
                alt="BM Investment"
                style={{ width: '160px', filter: 'drop-shadow(0 0 16px rgba(212,175,55,0.2))' }}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: `1px solid ${goldMuted}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(212, 175, 55, 0.05)' }}>
                <Lock size={20} color={gold} />
              </div>
            </div>

            <h1 style={{ fontFamily: '"Fraunces","Georgia",serif', fontSize: '26px', fontWeight: 500, color: textLight, lineHeight: 1.2, marginBottom: '8px' }}>
              Reset Password
            </h1>
            <p style={{ fontSize: '13px', color: textMuted, letterSpacing: '0.02em' }}>
              Create a new secure password for your account.
            </p>
          </div>

          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Error / Success Alerts */}
            <AnimatePresence>
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ 
                    background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', 
                    border: `1px solid ${message.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`, 
                    borderRadius: '4px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px', 
                    color: message.type === 'error' ? '#ef4444' : '#22c55e', fontSize: '13px', marginBottom: '-8px' 
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{message.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* New Password Field */}
            <div>
              <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, marginBottom: '10px', fontWeight: 600 }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: textMuted }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  style={{
                    width: '100%', padding: '14px 44px',
                    background: inputBg, border: `1px solid ${borderColor}`, borderRadius: '6px',
                    color: textLight, fontSize: '14px', outline: 'none', transition: 'border-color 0.2s, background-color 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={e => { e.target.style.borderColor = gold; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                  onBlur={e => { e.target.style.borderColor = borderColor; e.target.style.background = inputBg; }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: textMuted, cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              {/* Strength Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '4px', width: '120px' }}>
                  <div style={{ height: '3px', flex: 1, background: password.length > 0 ? strength.color : inputBg, borderRadius: '2px', transition: 'background 0.3s' }} />
                  <div style={{ height: '3px', flex: 1, background: password.length >= 6 ? strength.color : inputBg, borderRadius: '2px', transition: 'background 0.3s' }} />
                  <div style={{ height: '3px', flex: 1, background: strength.label === 'Strong' ? strength.color : inputBg, borderRadius: '2px', transition: 'background 0.3s' }} />
                </div>
                <span style={{ fontSize: '10px', color: textMuted }}>Password Strength: <span style={{ color: strength.color }}>{strength.label || 'None'}</span></span>
              </div>
            </div>

            {/* Confirm New Password Field */}
            <div>
              <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, marginBottom: '10px', fontWeight: 600 }}>Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: textMuted }} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  style={{
                    width: '100%', padding: '14px 44px',
                    background: inputBg, border: `1px solid ${borderColor}`, borderRadius: '6px',
                    color: textLight, fontSize: '14px', outline: 'none', transition: 'border-color 0.2s, background-color 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={e => { e.target.style.borderColor = gold; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                  onBlur={e => { e.target.style.borderColor = borderColor; e.target.style.background = inputBg; }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: textMuted, cursor: 'pointer' }}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', marginTop: '4px',
                background: loading ? goldMuted : gold,
                border: 'none', borderRadius: '6px',
                color: '#111', fontSize: '12px', fontWeight: 600,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                transition: 'background 0.2s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => { if (!loading) e.target.style.background = '#e5c04c'; }}
              onMouseLeave={e => { if (!loading) e.target.style.background = gold; }}
            >
              {loading ? (
                <div style={{ width: '18px', height: '18px', border: `2px solid #111`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              ) : (
                <><span>Update Password</span><ArrowRight size={16} /></>
              )}
            </button>
            
            {/* Back to Sign In */}
            <div style={{ textAlign: 'center', marginTop: '-4px' }}>
              <button 
                type="button"
                onClick={() => navigate('/admin/login')}
                style={{ background: 'none', border: 'none', color: textMuted, fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = textLight}
                onMouseLeave={e => e.target.style.color = textMuted}
              >
                <ArrowLeft size={14} /> Back to Sign In
              </button>
            </div>
          </form>

          {/* Footer Security Text */}
          <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Shield size={18} color={textMuted} />
            <div style={{ color: textMuted, fontSize: '10px', letterSpacing: '0.02em', lineHeight: 1.4 }}>
              Your password will be securely updated.<br/>Keep your account safe and private.
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

export default UpdatePassword;

import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

const C = {
  ink950: '#0c0b09',
  ink900: '#14120f',
  ink800: '#1c1a15',
  ivory50: '#f7f2e8',
  stone400: '#a49a84',
  stone500: '#857b67',
  em500: '#2c8360',
  em700: '#1a4d38',
  rose400: '#c87f63',
  brass400: '#c6a462',
  lineDark: 'rgba(247,242,232,0.10)',
};

const SERIF = '"Fraunces","Georgia",serif';
const SANS = '"Archivo","Helvetica Neue",sans-serif';

export default function AdminScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize Scanner
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    });

    scanner.render(success, error);

    async function success(decodedText) {
      // Pause scanner while processing
      scanner.pause();
      setLoading(true);

      const regId = decodedText.trim();
      
      try {
        // Query database
        const { data, error: fetchError } = await supabase
          .from('registrations')
          .select('*')
          .eq('registration_id', regId)
          .single();

        if (fetchError || !data) {
          setScanResult({ type: 'error', message: `Invalid Pass: ${regId} not found.` });
        } else if (data.checked_in) {
          setScanResult({ type: 'warning', message: `Duplicate: ${data.name} is already checked in.`, data });
        } else {
          // Mark as checked in
          const { error: updateError } = await supabase
            .from('registrations')
            .update({ checked_in: true, updated_at: new Date().toISOString() })
            .eq('id', data.id);

          if (updateError) {
            setScanResult({ type: 'error', message: 'Failed to update check-in status in database.' });
          } else {
            setScanResult({ type: 'success', message: `Welcome, ${data.name}!`, data });
          }
        }
      } catch (err) {
        setScanResult({ type: 'error', message: err.message });
      }

      setLoading(false);
    }

    function error(err) {
      // ignore empty scan errors
    }

    return () => {
      scanner.clear().catch(console.error);
    };
  }, []);

  const resetScanner = () => {
    setScanResult(null);
    // Restart logic is handled automatically if we clear and re-render or just resume
    // Since we paused it, we need a way to resume. Wait, `Html5QrcodeScanner` API for pause/resume isn't always stable.
    // It's easier to force a component remount or rely on a state toggle.
    // We'll use window location reload for absolute safety in this quick implementation, or better, we can just clear state.
    // Actually, `scanner.resume()` is valid if we had the instance.
    // For simplicity, we just reload the route or remount the component.
    window.location.reload(); 
  };

  return (
    <div style={{ padding: '32px', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: SERIF, fontSize: '28px', color: C.ivory50, fontWeight: 600 }}>Gate Check-in</h2>
        <p style={{ color: C.stone500, fontSize: '13px' }}>Scan the digital event pass QR code.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', width: '100%', maxWidth: '900px' }}>
        
        {/* Camera Section */}
        <div style={{ background: C.ink900, padding: '24px', borderRadius: '8px', border: `1px solid ${C.lineDark}` }}>
          <div id="reader" style={{ width: '100%', background: C.ink950, borderRadius: '4px', overflow: 'hidden' }}></div>
        </div>

        {/* Results Section */}
        <div style={{ background: C.ink900, padding: '24px', borderRadius: '8px', border: `1px solid ${C.lineDark}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', color: C.brass400 }}>
              <RefreshCw size={40} className="spin" />
              <p>Verifying Pass...</p>
            </div>
          )}

          {!loading && !scanResult && (
            <div style={{ color: C.stone500, textAlign: 'center' }}>
              <p>Waiting for scan...</p>
            </div>
          )}

          <AnimatePresence>
            {!loading && scanResult && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                style={{ textAlign: 'center', width: '100%' }}
              >
                {scanResult.type === 'success' && (
                  <div style={{ background: 'rgba(44,131,96,0.1)', border: `2px solid ${C.em500}`, padding: '32px', borderRadius: '8px' }}>
                    <CheckCircle2 size={64} color={C.em500} style={{ margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '24px', color: C.em500, marginBottom: '8px' }}>VALID</h3>
                    <p style={{ fontSize: '18px', color: C.ivory50, fontWeight: 600 }}>{scanResult.message}</p>
                    <p style={{ fontSize: '13px', color: C.stone400, marginTop: '8px' }}>Track: {scanResult.data.track}</p>
                  </div>
                )}

                {scanResult.type === 'warning' && (
                  <div style={{ background: 'rgba(198,164,98,0.1)', border: `2px solid ${C.brass400}`, padding: '32px', borderRadius: '8px' }}>
                    <AlertCircle size={64} color={C.brass400} style={{ margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '24px', color: C.brass400, marginBottom: '8px' }}>ALREADY SCANNED</h3>
                    <p style={{ fontSize: '18px', color: C.ivory50, fontWeight: 600 }}>{scanResult.message}</p>
                  </div>
                )}

                {scanResult.type === 'error' && (
                  <div style={{ background: 'rgba(200,127,99,0.1)', border: `2px solid ${C.rose400}`, padding: '32px', borderRadius: '8px' }}>
                    <XCircle size={64} color={C.rose400} style={{ margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '24px', color: C.rose400, marginBottom: '8px' }}>INVALID PASS</h3>
                    <p style={{ fontSize: '16px', color: C.ivory50 }}>{scanResult.message}</p>
                  </div>
                )}

                <button 
                  onClick={resetScanner} 
                  style={{ marginTop: '24px', background: C.ink800, color: C.ivory50, border: `1px solid ${C.lineDark}`, padding: '10px 24px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Scan Next
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}

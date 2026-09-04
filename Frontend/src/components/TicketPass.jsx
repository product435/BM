import React from 'react';
import QRCode from 'react-qr-code';

export default function TicketPass({ applicant }) {
  // Agar applicant data nahi hai toh kuch render mat karo
  if (!applicant) return null;

  return (
    <div style={{ textAlign: 'center', padding: '20px', background: 'white', borderRadius: '8px' }}>
      <h2>Event Pass</h2>
      <p>Name: {applicant.name}</p>
      <p>ID: {applicant.registration_id}</p>
      
      {/* Yahan QR Code generate ho raha hai */}
      <div style={{ marginTop: '20px', padding: '16px', background: 'white' }}>
        <QRCode 
          value={applicant.registration_id} // QR Scan karne par ye ID milegi
          size={200} // QR code ka size (pixels)
          bgColor="#ffffff" // Background color
          fgColor="#000000" // QR Code ka color
        />
      </div>
      
      <p style={{ marginTop: '10px', fontSize: '12px', color: 'gray' }}>
        Scan this at the entrance
      </p>
    </div>
  );
}


import React, { useState } from 'react';
import { logoSrc } from '../api/offices';

// Office logo, or the first letter of its name when there is no logo (or it fails to load).
// office: { name, logoUrl } as returned by the API
export default function OfficeAvatar({ office, size = 44 }) {
  const [broken, setBroken] = useState(false);
  const src = logoSrc(office.logoUrl);
  const box = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: `${Math.round(size * 0.23)}px`,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  };

  if (src && !broken) {
    return (
      <div style={{ ...box, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <img
          src={src}
          alt={office.name}
          onError={() => setBroken(true)}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    );
  }

  return (
    <div style={{ ...box, backgroundColor: '#0d6e75', color: '#ffffff', fontSize: `${Math.round(size * 0.42)}px`, fontWeight: '800' }}>
      {office.name?.trim().charAt(0) || 'ت'}
    </div>
  );
}
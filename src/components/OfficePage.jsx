import React from 'react';

// Title + content of one office settings page (same width and heading on all of them)
export default function OfficePage({ title, children }) {
  return (
    <div style={{ maxWidth: '840px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0c232f', margin: '0 0 28px' }}>{title}</h1>
      {children}
    </div>
  );
}

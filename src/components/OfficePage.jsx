import React from 'react';

// Title + content of one portal page (same heading on all of them)
export default function OfficePage({ title, children, width = '840px' }) {
  return (
    <div style={{ maxWidth: width }}>
      <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0c232f', margin: '0 0 28px' }}>{title}</h1>
      {children}
    </div>
  );
}

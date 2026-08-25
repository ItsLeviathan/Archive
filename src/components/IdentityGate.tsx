'use client';

import { useEffect, useState } from 'react';
import { identityStore } from '@/lib/identityStore';

export function IdentityGate() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    function handleRequest() {
      if (!identityStore.getSnapshot()) {
        setValue('');
        setOpen(true);
      }
    }
    window.addEventListener('archive:request-identity', handleRequest);
    return () => window.removeEventListener('archive:request-identity', handleRequest);
  }, []);

  function confirm(name: string) {
    identityStore.set(name);
    setOpen(false);
    window.dispatchEvent(new CustomEvent('archive:identity-ready'));
  }

  if (!open) return null;

  return (
    <div className="identity-overlay" role="dialog" aria-modal="true" aria-label="Tell us who you are">
      <div className="identity-card">
        <span className="eyebrow">Before you leave something here</span>
        <h2>What should we call you?</h2>
        <p>So the archive remembers your voice if you write again. You can still publish any single story anonymously.</p>
        <input
          autoFocus
          className="identity-input"
          placeholder="A name, a nickname, initials…"
          value={value}
          maxLength={40}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && value.trim()) confirm(value.trim()); }}
        />
        <div className="identity-actions">
          <button type="button" className="btn-primary" disabled={!value.trim()} onClick={() => confirm(value.trim())}>
            Continue
          </button>
          <button type="button" className="btn-ghost" onClick={() => confirm('Anonymous')}>
            Stay anonymous
          </button>
        </div>
      </div>
    </div>
  );
}
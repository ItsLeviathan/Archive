'use client';

import { useEffect, useRef, useState } from 'react';
import { identityStore } from '@/lib/identityStore';
import { useToast } from '@/contexts/ToastContext';

// Opened only when someone asks for it (footer "Set your name"). Writing
// never forces it — the Write page asks how to sign inline instead.
export function IdentityGate() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    function handleRequest() {
      const current = identityStore.getSnapshot();
      setValue(current === 'Anonymous' ? '' : current);
      setOpen(true);
    }
    window.addEventListener('archive:request-identity', handleRequest);
    return () => window.removeEventListener('archive:request-identity', handleRequest);
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  function save(name: string) {
    identityStore.set(name);
    setOpen(false);
    showToast(name === 'Anonymous' ? 'You’ll sign as Anonymous.' : `You’ll sign as ${name}.`);
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="identity-title"
      onClose={() => setOpen(false)}
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <form
        className="modal-card"
        onSubmit={(e) => { e.preventDefault(); if (value.trim()) save(value.trim()); }}
      >
        <p className="hand">Dear diary, my name is…</p>
        <h2 id="identity-title">How should you sign your entries?</h2>
        <p>Remembered on this device only. You can still leave any single entry anonymously.</p>
        <label htmlFor="identity-input" className="visually-hidden">Your name</label>
        <input
          id="identity-input"
          autoFocus
          className="field"
          placeholder="A name, a nickname, initials…"
          value={value}
          maxLength={40}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={() => save('Anonymous')}>Stay anonymous</button>
          <button type="submit" className="btn-primary" disabled={!value.trim()}>Save name</button>
        </div>
      </form>
    </dialog>
  );
}

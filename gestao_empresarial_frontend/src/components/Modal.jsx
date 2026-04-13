// src/components/Modal.jsx
import { useEffect } from 'react';

export default function Modal({ titulo, onFechar, children }) {
  // Fecha com ESC
  useEffect(() => {
    function handler(e) { if (e.key === 'Escape') onFechar(); }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onFechar]);

  return (
    <div className="overlay" onClick={e => { if (e.target === e.currentTarget) onFechar(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={titulo}>
        <div className="modal-header">
          <span className="modal-title">{titulo}</span>
          <button className="btn btn-ghost btn-icon" onClick={onFechar} title="Fechar">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
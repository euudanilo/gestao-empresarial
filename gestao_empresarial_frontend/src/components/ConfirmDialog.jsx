// src/components/ConfirmDialog.jsx

export default function ConfirmDialog({ mensagem, onConfirmar, onCancelar, loading }) {
  return (
    <div className="overlay" onClick={e => { if (e.target === e.currentTarget) onCancelar(); }}>
      <div className="modal" style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <span className="modal-title">Confirmar exclusão</span>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.6 }}>{mensagem}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancelar} disabled={loading}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={onConfirmar} disabled={loading}>
            {loading && <span className="spinner spinner-sm" />}
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
// src/components/EmpresaDetail.jsx

function campo(label, valor, mono = false) {
  return (
    <div className="detail-field">
      <label>{label}</label>
      <p className={mono ? 'mono' : ''}>{valor || '—'}</p>
    </div>
  );
}

function fmtCnpj(v = '') {
  return v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}
function fmtCep(v = '') {
  return v.replace(/(\d{5})(\d{3})/, '$1-$2');
}

export default function EmpresaDetail({ empresa, onEditar, onFechar }) {
  return (
    <>
      <div className="modal-body">

        {/* Identificação */}
        <div className="detail-section">
          <div className="detail-section-title">Identificação</div>
          <div className="detail-grid">
            <div className="detail-full">
              {campo('Razão social / Nome fantasia', empresa.nomeEmpresa)}
            </div>
            <div className="detail-full">
              {campo('CNPJ', fmtCnpj(empresa.cnpj), true)}
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="detail-section">
          <div className="detail-section-title">Endereço</div>
          <div className="detail-grid">
            <div className="detail-full">
              {campo('Logradouro', empresa.endereco)}
            </div>
            {campo('Número', empresa.numero)}
            {campo('Complemento', empresa.complemento)}
            {campo('Bairro', empresa.bairro)}
            {campo('Cidade', empresa.cidade)}
            {campo('Estado (UF)', empresa.estado)}
            {campo('CEP', fmtCep(empresa.cep), true)}
          </div>
        </div>

        {/* Contato */}
        <div className="detail-section">
          <div className="detail-section-title">Contato</div>
          <div className="detail-grid">
            <div className="detail-full">
              {campo('Nome do contato', empresa.nomeContato)}
            </div>
            {campo('E-mail', empresa.email)}
            {campo('Telefone', empresa.telefone || '—')}
            {campo('Celular', empresa.celular || '—')}
          </div>
        </div>

      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onFechar}>Fechar</button>
        <button className="btn btn-primary" onClick={onEditar}>Editar empresa</button>
      </div>
    </>
  );
}
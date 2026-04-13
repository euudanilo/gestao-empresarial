// src/components/EmpresaForm.jsx
import { useState } from 'react';
import { validarCreate, validarUpdate, formatarCnpj, formatarCep, formatarTelefone } from '../services/validacao';
import { criarEmpresa, atualizarEmpresa } from '../services/empresaService';

const VAZIO = {
  nomeEmpresa: '', cnpj: '', cep: '', numero: '',
  complemento: '', nomeContato: '', telefone: '', celular: '', email: '',
};

export default function EmpresaForm({ empresa, onSalvo, onCancelar }) {
  const isEdit = Boolean(empresa);

  const [form, setForm] = useState(
    isEdit
      ? { ...empresa }   // pré-preenche com dados da empresa ao editar
      : { ...VAZIO }
  );
  const [erros, setErros] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiErro, setApiErro] = useState('');

  function set(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }));
    if (erros[campo]) setErros(e => ({ ...e, [campo]: undefined }));
  }

  async function handleSubmit() {
    const validar = isEdit ? validarUpdate : validarCreate;
    const novosErros = validar(form);

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    // Remove formatação antes de enviar — backend espera só dígitos
    const payload = {
      ...form,
      cep: form.cep.replace(/\D/g, ''),
      telefone: form.telefone?.replace(/\D/g, '') || '',
      celular: form.celular?.replace(/\D/g, '') || '',
    };
    if (!isEdit) payload.cnpj = form.cnpj.replace(/\D/g, '');

    setSaving(true);
    setApiErro('');
    try {
      if (isEdit) {
        await atualizarEmpresa(empresa.cnpj, payload);
      } else {
        await criarEmpresa(payload);
      }
      onSalvo();
    } catch (err) {
      setApiErro(err?.message || 'Erro ao salvar. Verifique os dados e tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {apiErro && (
        <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
          ⚠ {apiErro}
          <button className="alert-close" onClick={() => setApiErro('')}>×</button>
        </div>
      )}

      <div className="form-grid">

        {/* Nome da empresa */}
        <div className="field form-full">
          <label>Nome da empresa *</label>
          <input
            type="text"
            className={erros.nomeEmpresa ? 'invalid' : ''}
            value={form.nomeEmpresa}
            onChange={e => set('nomeEmpresa', e.target.value)}
            placeholder="Razão social ou nome fantasia"
          />
          {erros.nomeEmpresa && <span className="field-error">{erros.nomeEmpresa}</span>}
        </div>

        {/* CNPJ — só na criação */}
        {!isEdit && (
          <div className="field">
            <label>CNPJ *</label>
            <input
              type="text"
              className={erros.cnpj ? 'invalid' : ''}
              value={form.cnpj}
              onChange={e => set('cnpj', formatarCnpj(e.target.value))}
              placeholder="00.000.000/0000-00"
              maxLength={18}
            />
            {erros.cnpj && <span className="field-error">{erros.cnpj}</span>}
          </div>
        )}

        {/* CEP */}
        <div className="field">
          <label>CEP *</label>
          <input
            type="text"
            className={erros.cep ? 'invalid' : ''}
            value={form.cep}
            onChange={e => set('cep', formatarCep(e.target.value))}
            placeholder="00000-000"
            maxLength={9}
          />
          {erros.cep && <span className="field-error">{erros.cep}</span>}
          <span className="field-hint">O endereço será preenchido automaticamente pelo CEP</span>
        </div>

        {/* Número */}
        <div className="field">
          <label>Número *</label>
          <input
            type="text"
            className={erros.numero ? 'invalid' : ''}
            value={form.numero}
            onChange={e => set('numero', e.target.value)}
            placeholder="123"
          />
          {erros.numero && <span className="field-error">{erros.numero}</span>}
        </div>

        {/* Complemento */}
        <div className="field form-full">
          <label>Complemento</label>
          <input
            type="text"
            value={form.complemento}
            onChange={e => set('complemento', e.target.value)}
            placeholder="Sala, andar, bloco... (opcional)"
          />
        </div>

        {/* Contato */}
        <div className="field form-full">
          <label>Nome do contato *</label>
          <input
            type="text"
            className={erros.nomeContato ? 'invalid' : ''}
            value={form.nomeContato}
            onChange={e => set('nomeContato', e.target.value)}
            placeholder="Nome completo"
          />
          {erros.nomeContato && <span className="field-error">{erros.nomeContato}</span>}
        </div>

        {/* Telefone */}
        <div className="field">
          <label>Telefone</label>
          <input
            type="text"
            value={form.telefone}
            onChange={e => set('telefone', formatarTelefone(e.target.value))}
            placeholder="(00) 0000-0000"
            maxLength={15}
          />
        </div>

        {/* Celular */}
        <div className="field">
          <label>Celular</label>
          <input
            type="text"
            value={form.celular}
            onChange={e => set('celular', formatarTelefone(e.target.value))}
            placeholder="(00) 00000-0000"
            maxLength={15}
          />
        </div>

        {/* Email */}
        <div className="field form-full">
          <label>E-mail *</label>
          <input
            type="email"
            className={erros.email ? 'invalid' : ''}
            value={form.email}
            onChange={e => set('email', e.target.value)}
            placeholder="contato@empresa.com.br"
          />
          {erros.email && <span className="field-error">{erros.email}</span>}
        </div>

      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onCancelar} disabled={saving}>
          Cancelar
        </button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
          {saving && <span className="spinner spinner-sm" />}
          {isEdit ? 'Salvar alterações' : 'Cadastrar empresa'}
        </button>
      </div>
    </>
  );
}
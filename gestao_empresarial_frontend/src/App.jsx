// src/App.jsx
import { useState, useEffect, useCallback } from 'react';
import { isLoggedIn, logout, getUser } from './services/authService';
import { listarEmpresas, excluirEmpresa } from './services/empresaService';
import LoginPage from './pages/LoginPage';
import Modal from './components/Modal';
import EmpresaForm from './components/EmpresaForm';
import EmpresaDetail from './components/EmpresaDetail';
import ConfirmDialog from './components/ConfirmDialog';

function fmtCnpj(v = '') {
  return v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

export default function App() {
  const [logado, setLogado] = useState(isLoggedIn());

  function handleLogin()  { setLogado(true); }
  function handleLogout() { logout(); setLogado(false); }

  if (!logado) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <Sistema onLogout={handleLogout} />;
}

function Sistema({ onLogout }) {
  const [empresas, setEmpresas]   = useState([]);
  const [filtradas, setFiltradas] = useState([]);
  const [busca, setBusca]         = useState('');
  const [loading, setLoading]     = useState(true);
  const [deletando, setDeletando] = useState(false);
  const [modal, setModal]         = useState(null);
  const [selecionada, setSelecionada] = useState(null);
  const [alerta, setAlerta]       = useState(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const dados = await listarEmpresas();
      setEmpresas(dados);
    } catch (err) {
      mostrarAlerta('error', err?.message || 'Erro ao carregar empresas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  useEffect(() => {
    const q = busca.toLowerCase().trim();
    if (!q) { setFiltradas(empresas); return; }
    setFiltradas(empresas.filter(e =>
      e.nomeEmpresa.toLowerCase().includes(q) ||
      e.cnpj.includes(q) ||
      (e.cidade || '').toLowerCase().includes(q) ||
      (e.estado || '').toLowerCase().includes(q)
    ));
  }, [busca, empresas]);

  function mostrarAlerta(tipo, msg) {
    setAlerta({ tipo, msg });
    setTimeout(() => setAlerta(null), 5000);
  }

  function abrirCriar()        { setSelecionada(null);  setModal('criar'); }
  function abrirDetalhe(e)     { setSelecionada(e);     setModal('detalhe'); }
  function abrirEditar(e)      { setSelecionada(e);     setModal('editar'); }
  function abrirConfirmar(e)   { setSelecionada(e);     setModal('confirmar'); }
  function fecharModal()       { setModal(null); }

  async function handleSalvo(acao) {
    fecharModal();
    await carregar();
    mostrarAlerta('success', acao === 'editar' ? 'Empresa atualizada!' : 'Empresa cadastrada!');
  }

  async function handleExcluir() {
    setDeletando(true);
    try {
      await excluirEmpresa(selecionada.cnpj);
      fecharModal();
      await carregar();
      mostrarAlerta('success', 'Empresa excluída com sucesso.');
    } catch (err) {
      mostrarAlerta('error', err?.message || 'Erro ao excluir empresa.');
      fecharModal();
    } finally {
      setDeletando(false);
    }
  }

  const totalEmpresas = empresas.length;
  const totalEstados  = new Set(empresas.map(e => e.estado).filter(Boolean)).size;
  const totalCidades  = new Set(empresas.map(e => e.cidade).filter(Boolean)).size;

  return (
    <div className="app">

      {/* ── Header com logout ── */}
      <header className="header">
        <div className="header-brand">
          <div className="header-logo">CE</div>
          <div>
            <div className="header-title">Cadastrar Empresas</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: 13, color: 'var(--ink3)' }}>
            Olá, <strong style={{ color: 'var(--ink2)' }}>{getUser()}</strong>
          </span>
          <button className="btn btn-primary" onClick={abrirCriar}>
            + Nova empresa
          </button>
          <button className="btn btn-secondary" onClick={onLogout} title="Sair">
            Sair
          </button>
        </div>
      </header>

      <main className="main">

        {alerta && (
          <div className={`alert alert-${alerta.tipo}`}>
            {alerta.tipo === 'success' ? '✓' : '⚠'} {alerta.msg}
            <button className="alert-close" onClick={() => setAlerta(null)}>×</button>
          </div>
        )}

        <div className="metrics-grid">
          <div className="metric">
            <div className="metric-value">{totalEmpresas}</div>
            <div className="metric-label">Total de empresas</div>
          </div>
          <div className="metric">
            <div className="metric-value">{totalEstados}</div>
            <div className="metric-label">Estados</div>
          </div>
          <div className="metric">
            <div className="metric-value">{totalCidades}</div>
            <div className="metric-label">Cidades</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Empresas cadastradas</span>
            <div className="search-bar">
              <div className="search-input-wrap">
                <span className="search-icon">⌕</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar por nome, CNPJ, cidade..."
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                />
              </div>
              <button className="btn btn-secondary" onClick={carregar}>↻ Atualizar</button>
            </div>
          </div>

          {loading ? (
            <div className="loading"><span className="spinner" />Carregando...</div>
          ) : filtradas.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">🏢</div>
              <div className="empty-title">{busca ? 'Nenhuma empresa encontrada' : 'Nenhuma empresa cadastrada'}</div>
              <div className="empty-sub">{busca ? `Sem resultados para "${busca}"` : 'Clique em "+ Nova empresa" para começar'}</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Empresa</th><th>CNPJ</th><th>Cidade / UF</th>
                    <th>Contato</th><th>E-mail</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtradas.map(emp => (
                    <tr key={emp.cnpj}>
                      <td><span className="td-name" onClick={() => abrirDetalhe(emp)}>{emp.nomeEmpresa}</span></td>
                      <td className="td-mono">{fmtCnpj(emp.cnpj)}</td>
                      <td>{emp.cidade}{emp.estado ? ` / ${emp.estado}` : ''}</td>
                      <td>{emp.nomeContato}</td>
                      <td style={{ color: 'var(--ink3)', fontSize: 12 }}>{emp.email}</td>
                      <td>
                        <div className="td-actions">
                          <button className="btn btn-secondary btn-sm" onClick={() => abrirEditar(emp)}>Editar</button>
                          <button className="btn btn-danger btn-sm" onClick={() => abrirConfirmar(emp)}>Excluir</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {modal === 'criar' && (
        <Modal titulo="Nova empresa" onFechar={fecharModal}>
          <div className="modal-body">
            <EmpresaForm onSalvo={() => handleSalvo('criar')} onCancelar={fecharModal} />
          </div>
        </Modal>
      )}

      {modal === 'editar' && selecionada && (
        <Modal titulo="Editar empresa" onFechar={fecharModal}>
          <div className="modal-body">
            <EmpresaForm empresa={selecionada} onSalvo={() => handleSalvo('editar')} onCancelar={fecharModal} />
          </div>
        </Modal>
      )}

      {modal === 'detalhe' && selecionada && (
        <Modal titulo={selecionada.nomeEmpresa} onFechar={fecharModal}>
          <EmpresaDetail
            empresa={selecionada}
            onEditar={() => { fecharModal(); abrirEditar(selecionada); }}
            onFechar={fecharModal}
          />
        </Modal>
      )}

      {modal === 'confirmar' && selecionada && (
        <ConfirmDialog
          mensagem={`Tem certeza que deseja excluir "${selecionada.nomeEmpresa}"? Esta ação não pode ser desfeita.`}
          onConfirmar={handleExcluir}
          onCancelar={fecharModal}
          loading={deletando}
        />
      )}
    </div>
  );
}

// src/pages/LoginPage.jsx
import { useState } from 'react';
import { login } from '../services/authService';

export default function LoginPage({ onLogin }) {
  const [form, setForm]     = useState({ username: '', password: '' });
  const [erro, setErro]     = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setErro('Preencha usuário e senha.');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      await login(form.username.trim(), form.password);
      onLogin(); // avisa o App que o login foi bem-sucedido
    } catch (err) {
      setErro(err.message || 'Usuário ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Logo / marca */}
        <div className="login-brand">
          <div className="login-logo">CE</div>
          <h1 className="login-title">Cadastrar Empresas</h1>
          <p className="login-sub">Faça login para continuar</p>
        </div>

        {/* Erro */}
        {erro && (
          <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
            ⚠ {erro}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="field" style={{ marginBottom: '14px' }}>
            <label>Usuário</label>
            <input
              type="text"
              autoComplete="username"
              autoFocus
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              placeholder="Digite seu usuário"
            />
          </div>

          <div className="field" style={{ marginBottom: '24px' }}>
            <label>Senha</label>
            <input
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '11px' }}
            disabled={loading}
          >
            {loading && <span className="spinner spinner-sm" />}
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

      </div>
    </div>
  );
}
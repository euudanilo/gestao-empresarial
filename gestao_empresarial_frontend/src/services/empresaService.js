// src/services/empresaService.js
import { getToken, logout } from './authService';

async function request(method, path, body) {
  const token = getToken();

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(path, options);

  if (response.status === 401) {
    logout();
    window.location.href = '/';
    return;
  }

  if (response.status === 204) return null;

  const data = await response.json();

  if (!response.ok) throw data;

  return data;
}

export function listarEmpresas()               { return request('GET',    '/empresas'); }
export function buscarPorCnpj(cnpj)            { return request('GET',    `/empresas/${cnpj}`); }
export function criarEmpresa(dados)            { return request('POST',   '/empresas', dados); }
export function atualizarEmpresa(cnpj, dados)  { return request('PUT',    `/empresas/${cnpj}`, dados); }
export function excluirEmpresa(cnpj)           { return request('DELETE', `/empresas/${cnpj}`); }
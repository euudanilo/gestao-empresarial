// src/services/authService.js
const TOKEN_KEY = 'empresa_token';
const USER_KEY  = 'empresa_user';

export async function login(username, password) {
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {

    throw new Error(data.message || 'Usuário ou senha inválidos');
  }

  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, data.username);

  return data;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken()    { return localStorage.getItem(TOKEN_KEY); }
export function getUser()     { return localStorage.getItem(USER_KEY); }
export function isLoggedIn()  { return Boolean(getToken()); }
// src/services/validacao.js

export function validarCreate(form) {
  const erros = {};

  if (!form.nomeEmpresa?.trim())
    erros.nomeEmpresa = 'Nome da empresa é obrigatório';

  const cnpjSoDigitos = (form.cnpj || '').replace(/\D/g, '');
  if (!cnpjSoDigitos)
    erros.cnpj = 'CNPJ é obrigatório';
  else if (cnpjSoDigitos.length !== 14)
    erros.cnpj = 'CNPJ deve conter 14 dígitos (somente números)';

  const cepSoDigitos = (form.cep || '').replace(/\D/g, '');
  if (!cepSoDigitos)
    erros.cep = 'CEP é obrigatório';
  else if (cepSoDigitos.length !== 8)
    erros.cep = 'CEP deve conter 8 dígitos (somente números)';

  if (!form.numero?.trim())
    erros.numero = 'Número é obrigatório';

  if (!form.nomeContato?.trim())
    erros.nomeContato = 'Nome do contato é obrigatório';

  if (!form.email?.trim())
    erros.email = 'Email é obrigatório';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    erros.email = 'Email inválido';

  return erros;
}

export function validarUpdate(form) {
  const erros = {};

  if (!form.nomeEmpresa?.trim())
    erros.nomeEmpresa = 'Nome da empresa é obrigatório';

  const cepSoDigitos = (form.cep || '').replace(/\D/g, '');
  if (!cepSoDigitos)
    erros.cep = 'CEP é obrigatório';
  else if (cepSoDigitos.length !== 8)
    erros.cep = 'CEP deve conter 8 dígitos';

  if (!form.numero?.trim())
    erros.numero = 'Número é obrigatório';

  if (!form.nomeContato?.trim())
    erros.nomeContato = 'Nome do contato é obrigatório';

  if (!form.email?.trim())
    erros.email = 'Email é obrigatório';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    erros.email = 'Email inválido';

  return erros;
}

export function formatarCnpj(v = '') {
  const d = v.replace(/\D/g, '').slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export function formatarCep(v = '') {
  const d = v.replace(/\D/g, '').slice(0, 8);
  return d.replace(/^(\d{5})(\d)/, '$1-$2');
}

export function formatarTelefone(v = '') {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 10)
    return d.replace(/^(\d{2})(\d{4})(\d)/, '($1) $2-$3');
  return d.replace(/^(\d{2})(\d{5})(\d)/, '($1) $2-$3');
}
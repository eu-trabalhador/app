import React from 'react';

/**
 * Função para validar CPF.
 * Verifica a validade do CPF com base nos dígitos verificadores.
 * @param cpf - CPF no formato de string, pode conter pontos e hífen.
 * @returns Retorna `true` se o CPF for válido, caso contrário, retorna `false`.
 */
export const validarCPF = (cpf: string): boolean => {
  // Remove qualquer caractere que não seja número
  cpf = cpf.replace(/[^\d]/g, "");

  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais (CPFs inválidos como 111.111.111-11)
  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }

  // Converte para array de números
  const cpfArray = cpf.split("").map(digito => parseInt(digito));

  // Valida o primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += cpfArray[i] * (10 - i);
  }
  let primeiroDigitoVerificador = 11 - (soma % 11);
  if (primeiroDigitoVerificador >= 10) {
    primeiroDigitoVerificador = 0;
  }

  // Verifica se o primeiro dígito verificador está correto
  if (cpfArray[9] !== primeiroDigitoVerificador) {
    return false;
  }

  // Valida o segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += cpfArray[i] * (11 - i);
  }
  let segundoDigitoVerificador = 11 - (soma % 11);
  if (segundoDigitoVerificador >= 10) {
    segundoDigitoVerificador = 0;
  }

  // Verifica se o segundo dígito verificador está correto
  if (cpfArray[10] !== segundoDigitoVerificador) {
    return false;
  }

  // Se passou em todas as validações, o CPF é válido
  return true;
};

export const validarEmail = (email:string): boolean => {
  // Regex básica para validar o formato de e-mail
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return re.test(email);
};
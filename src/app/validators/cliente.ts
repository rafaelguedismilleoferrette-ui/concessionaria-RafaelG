import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const textoObrigatorio: ValidatorFn = (control: AbstractControl): ValidationErrors | null =>
  typeof control.value === 'string' && control.value.trim() ? null : { required: true };

export function quantidadeDigitos(...tamanhos: number[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');
    return tamanhos.includes(value.replace(/\D/g, '').length) && /^[\d.()\s/-]+$/.test(value)
      ? null
      : { formato: true };
  };
}

export function mascara(value: string, tipo: 'cpf' | 'cnpj' | 'telefone' | 'cep'): string {
  const limite = { cpf: 11, cnpj: 14, telefone: 11, cep: 8 }[tipo];
  const digits = value.replace(/\D/g, '').slice(0, limite);
  if (tipo === 'cpf')
    return digits
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3}\.\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3}\.\d{3}\.\d{3})(\d)/, '$1-$2');
  if (tipo === 'cnpj')
    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2}\.\d{3})(\d)/, '$1.$2')
      .replace(/(\d{2}\.\d{3}\.\d{3})(\d)/, '$1/$2')
      .replace(/(\/\d{4})(\d)/, '$1-$2');
  if (tipo === 'cep') return digits.replace(/^(\d{5})(\d)/, '$1-$2');
  return digits
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(digits.length === 11 ? /(\d{5})(\d{1,4})$/ : /(\d{4})(\d{1,4})$/, '$1-$2');
}

import { FormControl } from '@angular/forms';
import { mascara, quantidadeDigitos, textoObrigatorio } from './cliente';

describe('Validação de cliente', () => {
  it('recusa campos preenchidos só com espaços', () => {
    expect(textoObrigatorio(new FormControl('   '))).toEqual({ required: true });
  });

  it('aceita telefone fixo e celular com DDD', () => {
    const validar = quantidadeDigitos(10, 11);
    expect(validar(new FormControl('(11) 3333-0000'))).toBeNull();
    expect(validar(new FormControl('(11) 99999-0000'))).toBeNull();
    expect(validar(new FormControl('99999-0000'))).toEqual({ formato: true });
  });

  it('rejeita documento incompleto e letras', () => {
    expect(quantidadeDigitos(11)(new FormControl('123.456'))).toEqual({ formato: true });
    expect(quantidadeDigitos(11)(new FormControl('12345678900abc'))).toEqual({ formato: true });
  });

  it.each([
    ['cpf', '12345678900', '123.456.789-00'],
    ['cnpj', '12345678000190', '12.345.678/0001-90'],
    ['telefone', '1133330000', '(11) 3333-0000'],
    ['telefone', '11999990000', '(11) 99999-0000'],
    ['cep', '01001000', '01001-000'],
  ] as const)('formata %s', (tipo, entrada, esperado) => {
    expect(mascara(entrada, tipo)).toBe(esperado);
  });
});

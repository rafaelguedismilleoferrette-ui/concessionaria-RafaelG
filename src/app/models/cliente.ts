export type TipoPessoa = 'PF' | 'PJ';

export interface DadosCliente {
  nome: string;
  tipoPessoa: TipoPessoa;
  cpfCnpj: string;
  telefone: string;
  cep: string;
  cidade: string;
  uf: string;
  logradouro: string;
  bairro: string;
  numero: string;
  email: string;
}

export interface Cliente extends DadosCliente {
  id: string;
  criadoEm: string;
}

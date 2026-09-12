import { DadosCliente } from './cliente';

export function normalizarCliente(dados: DadosCliente): DadosCliente {
  return {
    nome: dados.nome.trim(),
    tipoPessoa: dados.tipoPessoa,
    cpfCnpj: dados.cpfCnpj.trim(),
    telefone: dados.telefone.trim(),
    cep: dados.cep.trim(),
    cidade: dados.cidade.trim(),
    uf: dados.uf.trim().toUpperCase(),
    logradouro: dados.logradouro.trim(),
    bairro: dados.bairro.trim(),
    numero: dados.numero.trim(),
    email: dados.email.trim(),
  };
}

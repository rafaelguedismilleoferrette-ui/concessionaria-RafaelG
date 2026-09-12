import { Injectable, signal } from '@angular/core';
import { Cliente, DadosCliente } from '../models/cliente';
import { normalizarCliente } from '../models/dados-cliente';

export const CLIENTES_STORAGE_KEY = 'vertice.clientes.v1';

function isCliente(value: unknown): value is Cliente {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  const campos = [
    'nome',
    'cpfCnpj',
    'telefone',
    'cep',
    'cidade',
    'uf',
    'logradouro',
    'bairro',
    'numero',
    'email',
    'id',
    'criadoEm',
  ];
  return (
    campos.every((campo) => typeof item[campo] === 'string') &&
    (item['tipoPessoa'] === 'PF' || item['tipoPessoa'] === 'PJ')
  );
}

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private readonly registros = signal<Cliente[]>([]);
  readonly clientes = this.registros.asReadonly();
  readonly aviso = signal('');

  constructor() {
    try {
      const raw = localStorage.getItem(CLIENTES_STORAGE_KEY);
      if (raw === null) return;
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed) || !parsed.every(isCliente)) throw new Error();
      this.registros.set(parsed);
    } catch {
      this.aviso.set(
        'Não foi possível carregar os cadastros deste navegador. Os dados existentes foram preservados; verifique o armazenamento antes de salvar.',
      );
    }
  }

  salvar(dados: DadosCliente): Cliente {
    if (this.aviso()) throw new Error(this.aviso());
    const normalizados = normalizarCliente(dados);
    const documento = normalizados.cpfCnpj.replace(/\D/g, '');
    if (this.registros().some((cliente) => cliente.cpfCnpj.replace(/\D/g, '') === documento)) {
      throw new Error('Já existe um cliente com este CPF/CNPJ.');
    }
    const cliente: Cliente = {
      ...normalizados,
      id: crypto.randomUUID(),
      criadoEm: new Date().toISOString(),
    };
    const atualizados = [cliente, ...this.registros()];
    try {
      localStorage.setItem(CLIENTES_STORAGE_KEY, JSON.stringify(atualizados));
    } catch {
      throw new Error(
        'Não foi possível salvar. Libere espaço ou permita o armazenamento no navegador e tente novamente.',
      );
    }
    this.registros.set(atualizados);
    return cliente;
  }
}

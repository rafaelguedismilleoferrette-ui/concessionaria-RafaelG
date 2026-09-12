import { ClientesService, CLIENTES_STORAGE_KEY } from './clientes';
import { clienteTeste } from '../testing/cliente';

describe('ClientesService', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('salva todos os campos e recupera os dados ao iniciar novamente', () => {
    const servico = new ClientesService();
    const salvo = servico.salvar(clienteTeste);
    const reaberto = new ClientesService();
    expect(reaberto.clientes()).toEqual([
      { ...clienteTeste, id: salvo.id, criadoEm: salvo.criadoEm },
    ]);
  });

  it('impede documentos duplicados mesmo sem a máscara', () => {
    const servico = new ClientesService();
    servico.salvar(clienteTeste);
    expect(() => servico.salvar({ ...clienteTeste, cpfCnpj: '12345678900' })).toThrow(
      'Já existe um cliente',
    );
    expect(servico.clientes()).toHaveLength(1);
  });

  it('não altera a lista se o armazenamento falhar', () => {
    const servico = new ClientesService();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    expect(() => servico.salvar(clienteTeste)).toThrow('Não foi possível salvar');
    expect(servico.clientes()).toEqual([]);
  });

  it('preserva dados inválidos em vez de sobrescrevê-los', () => {
    localStorage.setItem(CLIENTES_STORAGE_KEY, '{invalido');
    const servico = new ClientesService();
    expect(servico.aviso()).toContain('Não foi possível carregar');
    expect(() => servico.salvar(clienteTeste)).toThrow();
    expect(localStorage.getItem(CLIENTES_STORAGE_KEY)).toBe('{invalido');
  });

  it('recusa registros sem os campos esperados', () => {
    localStorage.setItem(CLIENTES_STORAGE_KEY, JSON.stringify([{ nome: 'Incompleto' }]));
    expect(new ClientesService().aviso()).toContain('Não foi possível carregar');
  });
});

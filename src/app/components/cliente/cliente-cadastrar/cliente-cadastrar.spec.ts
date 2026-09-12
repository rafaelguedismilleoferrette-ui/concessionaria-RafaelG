import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClienteCadastrar } from './cliente-cadastrar';
import { ClientesService } from '../../../services/clientes';
import { clienteTeste } from '../../../testing/cliente';

describe('ClienteCadastrar', () => {
  let fixture: ComponentFixture<ClienteCadastrar>;
  let component: ClienteCadastrar;
  let servico: ClientesService;

  beforeEach(async () => {
    localStorage.clear();
    fixture = TestBed.createComponent(ClienteCadastrar);
    component = fixture.componentInstance;
    servico = TestBed.inject(ClientesService);
    await fixture.whenStable();
  });

  async function enviar() {
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
  }

  it('mostra erros e não salva o formulário vazio', async () => {
    await enviar();
    expect(servico.clientes()).toEqual([]);
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'Revise os campos',
    );
    expect(fixture.nativeElement.querySelectorAll('mat-error').length).toBeGreaterThan(0);
  });

  it('salva um cadastro completo, incluindo a cidade, e limpa o formulário', async () => {
    component.formularioCliente.setValue(clienteTeste);
    await enviar();
    expect(servico.clientes()[0].cidade).toBe('São Paulo');
    expect(servico.clientes()[0].email).toBe('cliente@example.com');
    expect(component.formularioCliente.controls.nome.value).toBe('');
    expect(fixture.nativeElement.querySelectorAll('mat-error').length).toBe(0);
    expect(component.mensagemValidacao).toContain('sucesso');
  });

  it('impede o envio de um e-mail inválido', async () => {
    component.formularioCliente.setValue({ ...clienteTeste, email: 'email-invalido' });
    await enviar();
    expect(servico.clientes()).toEqual([]);
    expect(component.formularioCliente.controls.email.hasError('email')).toBe(true);
  });

  it('exige CNPJ ao selecionar pessoa jurídica', async () => {
    component.formularioCliente.setValue({ ...clienteTeste, tipoPessoa: 'PJ' });
    component.trocarTipoPessoa();
    expect(component.formularioCliente.controls.cpfCnpj.value).toBe('');
    component.formularioCliente.controls.cpfCnpj.setValue('123.456.789-00');
    await enviar();
    expect(servico.clientes()).toHaveLength(0);
    component.formularioCliente.controls.cpfCnpj.setValue('12.345.678/0001-90');
    await enviar();
    expect(servico.clientes()[0].tipoPessoa).toBe('PJ');
  });

  it('cancela sem salvar e remove os erros visíveis', async () => {
    await enviar();
    component.formularioCliente.controls.nome.setValue('Rascunho');
    component.cancelar();
    await fixture.whenStable();
    expect(component.formularioCliente.controls.nome.value).toBe('');
    expect(component.formularioCliente.touched).toBe(false);
    expect(fixture.nativeElement.querySelectorAll('mat-error').length).toBe(0);
    expect(servico.clientes()).toEqual([]);
  });

  it('mantém os valores digitados quando o documento já está cadastrado', async () => {
    servico.salvar(clienteTeste);
    component.formularioCliente.setValue(clienteTeste);
    await enviar();
    expect(component.mensagemValidacao).toContain('Já existe');
    expect(component.formularioCliente.controls.nome.value).toBe(clienteTeste.nome);
    expect(servico.clientes()).toHaveLength(1);
  });
});

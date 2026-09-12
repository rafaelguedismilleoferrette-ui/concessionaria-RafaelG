import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { DadosCliente } from '../../../models/cliente';
import { normalizarCliente } from '../../../models/dados-cliente';
import { ClientesService } from '../../../services/clientes';
import { mascara, quantidadeDigitos, textoObrigatorio } from '../../../validators/cliente';

@Component({
  selector: 'app-cliente-cadastrar',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './cliente-cadastrar.html',
  styleUrl: './cliente-cadastrar.css',
})
export class ClienteCadastrar {
  private readonly criadorFormulario = inject(FormBuilder);
  private readonly clientesService = inject(ClientesService);
  private readonly formDirective = viewChild(FormGroupDirective);

  mensagemValidacao = '';
  erro = false;

  readonly formularioCliente = this.criadorFormulario.nonNullable.group({
    nome: ['', [textoObrigatorio, Validators.minLength(3), Validators.maxLength(50)]],
    tipoPessoa: ['', Validators.required],
    cpfCnpj: ['', [Validators.required, quantidadeDigitos(11)]],
    telefone: ['', [Validators.required, quantidadeDigitos(10, 11)]],
    cep: ['', [Validators.required, quantidadeDigitos(8)]],
    cidade: ['', [textoObrigatorio, Validators.maxLength(80)]],
    uf: ['', [textoObrigatorio, Validators.pattern(/^[A-Z]{2}$/)]],
    logradouro: ['', [textoObrigatorio, Validators.maxLength(120)]],
    bairro: ['', [textoObrigatorio, Validators.maxLength(80)]],
    numero: ['', [textoObrigatorio, Validators.maxLength(15)]],
    email: ['', [textoObrigatorio, Validators.email, Validators.maxLength(120)]],
  });

  get pessoaJuridica(): boolean {
    return this.formularioCliente.controls.tipoPessoa.value === 'PJ';
  }

  trocarTipoPessoa(): void {
    const documento = this.formularioCliente.controls.cpfCnpj;
    documento.reset('');
    documento.setValidators([
      Validators.required,
      quantidadeDigitos(this.pessoaJuridica ? 14 : 11),
    ]);
    documento.updateValueAndValidity();
  }

  aplicarMascara(campo: 'cpfCnpj' | 'telefone' | 'cep', event: Event): void {
    const input = event.target as HTMLInputElement;
    const posicao = input.selectionStart ?? input.value.length;
    const antes = input.value.slice(0, posicao).replace(/\D/g, '').length;
    const tipo = campo === 'cpfCnpj' ? (this.pessoaJuridica ? 'cnpj' : 'cpf') : campo;
    const valor = mascara(input.value, tipo);
    this.formularioCliente.controls[campo].setValue(valor);

    let novaPosicao = 0;
    let contagem = 0;
    while (novaPosicao < valor.length && contagem < antes) {
      if (/\d/.test(valor[novaPosicao])) contagem++;
      novaPosicao++;
    }
    input.setSelectionRange(novaPosicao, novaPosicao);
  }

  formatarUf(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = input.value
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .slice(0, 2);
    this.formularioCliente.controls.uf.setValue(valor);
    input.setSelectionRange(valor.length, valor.length);
  }

  erroCampo(campo: keyof DadosCliente): string {
    const controle = this.formularioCliente.controls[campo];
    if (controle.hasError('required')) return 'Este campo é obrigatório.';
    if (controle.hasError('minlength')) return 'Informe pelo menos 3 caracteres.';
    if (controle.hasError('maxlength')) return 'O texto ultrapassa o limite permitido.';
    if (controle.hasError('email')) return 'Informe um e-mail válido.';
    if (campo === 'uf') return 'Informe a sigla do estado (2 letras).';
    if (campo === 'cpfCnpj') {
      return this.pessoaJuridica
        ? 'Informe os 14 dígitos do CNPJ.'
        : 'Informe os 11 dígitos do CPF.';
    }
    if (campo === 'telefone') return 'Informe o DDD e o telefone (10 ou 11 dígitos).';
    return 'Informe os 8 dígitos do CEP.';
  }

  salvarCliente(): void {
    const valores = this.formularioCliente.getRawValue();
    const dados = normalizarCliente({
      ...valores,
      tipoPessoa: this.pessoaJuridica ? 'PJ' : 'PF',
    });
    this.formularioCliente.patchValue({ ...dados, tipoPessoa: valores.tipoPessoa });
    this.formularioCliente.markAllAsTouched();

    if (this.formularioCliente.invalid) {
      this.erro = true;
      this.mensagemValidacao = 'Revise os campos obrigatórios antes de salvar.';
      return;
    }

    try {
      this.clientesService.salvar(dados);
      this.cancelar();
      this.mensagemValidacao = 'Cliente salvo com sucesso.';
    } catch (error) {
      this.erro = true;
      this.mensagemValidacao =
        error instanceof Error ? error.message : 'Não foi possível salvar o cliente.';
    }
  }

  cancelar(): void {
    const formulario = this.formDirective();
    if (formulario) formulario.resetForm();
    else this.formularioCliente.reset();
    this.trocarTipoPessoa();
    this.mensagemValidacao = '';
    this.erro = false;
  }
}

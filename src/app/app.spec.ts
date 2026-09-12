import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(() => localStorage.clear());

  it('exibe o formulário de cadastro ao abrir', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('mat-card-title').textContent).toBe(
      'Formulário de Cadastro de Cliente',
    );
    expect(fixture.nativeElement.querySelectorAll('input').length).toBe(10);
  });
});

import { Component } from '@angular/core';
import { ClienteCadastrar } from './components/cliente/cliente-cadastrar/cliente-cadastrar';

@Component({
  selector: 'app-root',
  imports: [ClienteCadastrar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}

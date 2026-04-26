import { Component } from '@angular/core';

@Component({
  selector: 'app-cadastro-profissional',
  standalone: false,
  templateUrl: './cadastro-profissional.html',
  styleUrl: './cadastro-profissional.css',
})
export class CadastroProfissional {
possuiCnpj: boolean = false;
}

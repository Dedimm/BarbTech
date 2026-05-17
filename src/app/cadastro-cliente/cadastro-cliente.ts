import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-cadastro-cliente',
  standalone: false,
  templateUrl: './cadastro-cliente.html',
  styleUrl: './cadastro-cliente.css',
})
export class CadastroCliente {
  possuiCondicaoEspecial: boolean = false;
  errorMessage: string = '';

  formData = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    cpf: '',
    condicao: ''
  };

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    if (this.formData.senha !== this.formData.confirmarSenha) {
      this.errorMessage = 'As senhas não coincidem';
      return;
    }

    // Adapt this to match the Django API expectations for "Cliente" creation.
    // For now, doing a basic POST.
    const payload = {
      user: {
        username: this.formData.email,
        email: this.formData.email,
        password: this.formData.senha,
        first_name: this.formData.nome
      },
      cpf: this.formData.cpf,
      telefone: this.formData.telefone,
      condicoes_especiais: this.possuiCondicaoEspecial ? this.formData.condicao : null
    };

    this.http.post(`${environment.apiUrl}/register/cliente/`, payload).subscribe({
      next: () => {
        this.router.navigate(['/login-usuario']);
      },
      error: (err) => {
        this.errorMessage = 'Erro ao realizar cadastro. Verifique os dados.';
      }
    });
  }
}


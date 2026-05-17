import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-cadastro-profissional',
  standalone: false,
  templateUrl: './cadastro-profissional.html',
  styleUrl: './cadastro-profissional.css',
})
export class CadastroProfissional {
  possuiCnpj: boolean = false;
  errorMessage: string = '';

  formData = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    cpf: '',
    cnpj: ''
  };

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    if (this.formData.senha !== this.formData.confirmarSenha) {
      this.errorMessage = 'As senhas não coincidem';
      return;
    }

    // Adapt this to match the Django API expectations for "Profissional" creation.
    // For now, doing a basic POST.
    const payload = {
      user: {
        username: this.formData.email,
        email: this.formData.email,
        password: this.formData.senha,
        first_name: this.formData.nome
      },
      cpf: this.formData.cpf,
      cnpj: this.possuiCnpj ? this.formData.cnpj : null,
      telefone: this.formData.telefone
    };

    this.http.post(`${environment.apiUrl}/register/profissional/`, payload).subscribe({
      next: () => {
        this.router.navigate(['/login-profissional']);
      },
      error: (err) => {
        this.errorMessage = 'Erro ao realizar cadastro. Verifique os dados.';
      }
    });
  }
}


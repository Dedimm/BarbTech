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

    // Separar o nome completo em Primeiro Nome e Sobrenome
    const partesDoNome = this.formData.nome.trim().split(' ');
    const primeiroNome = partesDoNome[0] || '';
    const sobrenome = partesDoNome.slice(1).join(' ') || 'Silva'; 

    // Montando o pacote plano para a API do Django
    const payload = {
      username: this.formData.email,     
      email: this.formData.email,
      password: this.formData.senha,
      first_name: primeiroNome,       
      last_name: sobrenome,           
      telefone: this.formData.telefone,
      cpf: this.formData.cpf,
      is_barbeiro: true,
      nome_barbearia: this.possuiCnpj ? this.formData.cnpj : 'Barbearia Individual'
    };

    this.http.post(`${environment.apiUrl}/usuarios/`, payload).subscribe({
      next: () => {
        alert('Profissional cadastrado com sucesso!');
        this.router.navigate(['/login-profissional']);
      },
      error: (err) => {
        console.error('Erro ao cadastrar profissional:', err);
        this.errorMessage = 'Erro ao realizar cadastro. Verifique os dados.';
      }
    });
  }
}

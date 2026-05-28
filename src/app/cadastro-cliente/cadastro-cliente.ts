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

    // Separar o nome completo em Primeiro Nome e Sobrenome
    const partesDoNome = this.formData.nome.trim().split(' ');
    const primeiroNome = partesDoNome[0] || '';
    const sobrenome = partesDoNome.slice(1).join(' ') || 'Silva'; 

    // Montando o pacote EXATAMENTE como o serializer do Django quer (plano)
    const payload = {
      username: this.formData.email,     
      email: this.formData.email,
      password: this.formData.senha,
      first_name: primeiroNome,       
      last_name: sobrenome,           
      telefone: this.formData.telefone,
      cpf: this.formData.cpf,
      is_barbeiro: false,
      bio: this.possuiCondicaoEspecial ? `Condição especial: ${this.formData.condicao}` : ''
    };

    this.http.post(`${environment.apiUrl}/usuarios/`, payload).subscribe({
      next: (response) => {
        alert('Cliente cadastrado com sucesso!');
        this.router.navigate(['/login-usuario']);
      },
      error: (err) => {
        console.error('Erro ao realizar o cadastro:', err);
        this.errorMessage = 'Erro ao realizar cadastro. Verifique os dados.';
      }
    });
  }
}

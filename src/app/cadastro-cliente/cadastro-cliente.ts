import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cadastro-cliente',
  standalone: false,
  templateUrl: './cadastro-cliente.html',
  styleUrl: './cadastro-cliente.css',
})
export class CadastroCliente {
  possuiCondicaoEspecial: boolean = false;

  dados = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    cpf: '',
    descricaoCondicao: ''
  };

  constructor(private http: HttpClient) {}

  enviarDados() {
    console.log('Botão clicado! Enviando dados para o Django...', this.dados);

    if (this.dados.senha !== this.dados.confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    const urlBackend = 'http://localhost:8000/api/usuarios/';

    // Lógica para separar o nome completo em Primeiro e Sobrenome
    const partesDoNome = this.dados.nome.trim().split(' ');
    const primeiroNome = partesDoNome[0] || '';
    const sobrenome = partesDoNome.slice(1).join(' ') || 'Silva'; 

    // Montando o pacote EXATAMENTE como o serializer do Django quer
    const dadosParaOBackend = {
      username: this.dados.email,     
      email: this.dados.email,
      password: this.dados.senha,
      first_name: primeiroNome,       
      last_name: sobrenome,           
      telefone: this.dados.telefone,
      cpf: this.dados.cpf
    };

    console.log('Pacote tratado enviado ao Django:', dadosParaOBackend);

    this.http.post(urlBackend, dadosParaOBackend).subscribe({
      next: (response) => {
        console.log('Sucesso! Salvo no banco SQLite:', response);
        alert('Cliente cadastrado com sucesso!');
      },
      error: (err) => {
        console.error('Erro detalhado do Django:', err.error);
        alert('Erro ao realizar o cadastro. Verifique o console.');
      }
    });
  }
}
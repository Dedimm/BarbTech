import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-servico-component',
  standalone: false,
  templateUrl: './servico-component.html',
  styleUrl: './servico-component.css'
})
export class ServicoComponent implements OnInit {
  listaServicos: any[] = [];
  servicoSelecionado: any = null;

  @Output() servicoEscolhido = new EventEmitter<any>();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.carregarServicosDoBanco();
  }

  carregarServicosDoBanco() {
    this.http.get<any[]>('http://localhost:8000/api/servicos/').subscribe({
      next: (dados) => {
        this.listaServicos = dados;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  selecionarServico(servico: any) {
    this.servicoSelecionado = servico;
    this.servicoEscolhido.emit(servico);
  }
}
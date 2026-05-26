import { Component, OnInit } from '@angular/core';
import { ProfissionalService } from '../services/profissional';
import { BarbeiroService } from '../services/barbeiro.service';

@Component({
  selector: 'app-lista-servico',
  standalone: false,
  templateUrl: './lista-servico.html',
  styleUrl: './lista-servico.css',
})
export class ListaServico implements OnInit {
  servicos: any[] = [];
  servicosFiltrados: any[] = [];

  constructor(
    private profissionalService: ProfissionalService,
    private barbeiroService: BarbeiroService
  ) {}

  ngOnInit() {
    const barbeiros = this.barbeiroService.getBarbeiros();

    this.servicos = this.profissionalService.getServicos().map((servico: any) => ({
      ...servico,
      barbeiros: barbeiros.filter((b: any) => b.servicos.includes(servico.nome))
    }));

    this.servicosFiltrados = this.servicos;
  }

  filtrar(evento: Event) {
    const texto = (evento.target as HTMLInputElement).value.toLowerCase();
    this.servicosFiltrados = this.servicos.filter(s =>
      s.nome.toLowerCase().includes(texto)
    );
  }
}
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-lista-servico',
  standalone: false,
  templateUrl: './lista-servico.html',
  styleUrl: './lista-servico.css',
})
export class ListaServico implements OnInit {
  servicos: any[] = [];
  servicosFiltrados: any[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Carregar todos os serviços do banco
    forkJoin({
      servicos: this.http.get<any[]>(`${environment.apiUrl}/servicos/`),
      barbeiros: this.http.get<any[]>(`${environment.apiUrl}/usuarios/?is_barbeiro=true`)
    }).subscribe({
      next: ({ servicos, barbeiros }) => {
        this.servicos = servicos.map(s => ({
          id: s.id,
          nome: s.nome,
          valor: s.preco,
          tempo: s.duracao_minutos,
          barbeiros: barbeiros.filter(b => b.id === s.barbeiro).map(b => ({
            id: b.id,
            nome: `${b.first_name || ''} ${b.last_name || ''}`.trim() || b.username
          }))
        }));
        this.servicosFiltrados = this.servicos;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar serviços:', err)
    });
  }

  filtrar(evento: Event) {
    const texto = (evento.target as HTMLInputElement).value.toLowerCase();
    this.servicosFiltrados = this.servicos.filter(s =>
      s.nome.toLowerCase().includes(texto)
    );
  }
}
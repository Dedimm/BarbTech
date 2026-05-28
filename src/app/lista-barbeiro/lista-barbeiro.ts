import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BarbeiroService } from '../services/barbeiro.service';

@Component({
  selector: 'app-lista-barbeiro',
  standalone: false,
  templateUrl: './lista-barbeiro.html',
  styleUrl: './lista-barbeiro.css',
})
export class ListaBarbeiro implements OnInit {
  barbeiros: any[] = [];
  servicoFiltro: string = '';

  constructor(
    private barbeiroService: BarbeiroService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.servicoFiltro = this.route.snapshot.paramMap.get('servico') || '';
    this.barbeiroService.getBarbeiros().subscribe({
      next: (todos) => {
        this.barbeiros = this.servicoFiltro
          ? todos.filter((b: any) => b.servicos?.includes(this.servicoFiltro))
          : todos;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao obter barbeiros:', err)
    });
  }
}
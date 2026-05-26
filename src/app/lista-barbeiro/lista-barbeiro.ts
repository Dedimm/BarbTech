import { Component, OnInit } from '@angular/core';
import { BarbeiroService } from '../services/barbeiro.service';

@Component({
  selector: 'app-lista-barbeiro',
  standalone: false,
  templateUrl: './lista-barbeiro.html',
  styleUrl: './lista-barbeiro.css',
})
export class ListaBarbeiro implements OnInit {
  barbeiros: any[] = [];

  constructor(private barbeiroService: BarbeiroService) {}

  ngOnInit() {
    this.barbeiros = this.barbeiroService.getBarbeiros();
  }
}
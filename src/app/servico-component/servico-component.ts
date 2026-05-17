import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProfissionalService } from '../services/profissional';

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

  constructor(private profissionalService: ProfissionalService) {}

  ngOnInit() {
    this.listaServicos = this.profissionalService.getServicos();
  }

  selecionarServico(servico: any) {
    this.servicoSelecionado = servico;
    this.servicoEscolhido.emit(servico);
  }
}
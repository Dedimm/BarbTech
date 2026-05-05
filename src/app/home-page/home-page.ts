import { Component } from '@angular/core';


@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  currentIndex = 1;


  items = [
    { url: 'image/DestaqueCentral.png' },
    { url: 'image/DestaqueEsquerda.png' },
    { url: 'image/DestaqueDireita.png' },
  ];

  getClass(index: number) {
    if (index === this.currentIndex) return 'active';
    if (index === this.currentIndex - 1) return 'left';
    if (index === this.currentIndex + 1) return 'right';
    return 'hidden';
  }

  next() {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  especialistas = [
    { url: 'image/Barbeiro1.png', nome: 'Ricardo', nomeCompleto: 'Ricardo Silva', fotoGrande:'image/Barbeiro1FotoGrande.png', descricao: "Especialista em cortes clássicos e barboterapia. Unindo técnicas ancestrais ao visagismo moderno para um resultado impecável." },
    { url: 'image/Barbeiro2.png', nome: 'Marcus', nomeCompleto: 'Marcus Santos', descricao: "Especialista em cortes clássicos e barboterapia. Unindo técnicas ancestrais ao visagismo moderno para um resultado impecável."},
    { url: 'image/Barbeiro3.png', nome: 'Felipe', nomeCompleto: 'Felipe Amancio', descricao: "Especialista em cortes clássicos e barboterapia. Unindo técnicas ancestrais ao visagismo moderno para um resultado impecável."},
    { url: 'image/Barbeiro4.png', nome: 'André', nomeCompleto: 'André Oliveira', descricao: "Especialista em cortes clássicos e barboterapia. Unindo técnicas ancestrais ao visagismo moderno para um resultado impecável."},
    { url: 'image/Barbeiro5.png', nome: 'Julio', nomeCompleto: 'Julio Pilla', descricao: "Especialista em cortes clássicos e barboterapia. Unindo técnicas ancestrais ao visagismo moderno para um resultado impecável."},
    { url: 'image/Barbeiro6.png', nome: 'Sérgio', nomeCompleto: 'Sérgio Pereira', descricao: "Especialista em cortes clássicos e barboterapia. Unindo técnicas ancestrais ao visagismo moderno para um resultado impecável."}
  ]

  selectedIndex = 0;

selecionar(index: number) {
  this.selectedIndex = index;
}
}

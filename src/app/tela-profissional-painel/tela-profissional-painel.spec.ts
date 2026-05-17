import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaProfissionalPainel } from './tela-profissional-painel';

describe('TelaProfissionalPainel', () => {
  let component: TelaProfissionalPainel;
  let fixture: ComponentFixture<TelaProfissionalPainel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TelaProfissionalPainel],
    }).compileComponents();

    fixture = TestBed.createComponent(TelaProfissionalPainel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

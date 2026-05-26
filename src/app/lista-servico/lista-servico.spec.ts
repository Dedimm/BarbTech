import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaServico } from './lista-servico';

describe('ListaServico', () => {
  let component: ListaServico;
  let fixture: ComponentFixture<ListaServico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaServico],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaServico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

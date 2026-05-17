import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaAgendamento } from './tela-agendamento';

describe('TelaAgendamento', () => {
  let component: TelaAgendamento;
  let fixture: ComponentFixture<TelaAgendamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TelaAgendamento],
    }).compileComponents();

    fixture = TestBed.createComponent(TelaAgendamento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

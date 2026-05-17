import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicoComponent } from './servico-component';

describe('ServicoComponent', () => {
  let component: ServicoComponent;
  let fixture: ComponentFixture<ServicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServicoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

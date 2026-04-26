import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroProfissional } from './cadastro-profissional';

describe('CadastroProfissional', () => {
  let component: CadastroProfissional;
  let fixture: ComponentFixture<CadastroProfissional>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CadastroProfissional],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroProfissional);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

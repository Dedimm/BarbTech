import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaLoginProfissional } from './tela-login-profissional';

describe('TelaLoginProfissional', () => {
  let component: TelaLoginProfissional;
  let fixture: ComponentFixture<TelaLoginProfissional>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TelaLoginProfissional],
    }).compileComponents();

    fixture = TestBed.createComponent(TelaLoginProfissional);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

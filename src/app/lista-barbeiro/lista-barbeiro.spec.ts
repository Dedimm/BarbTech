import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaBarbeiro } from './lista-barbeiro';

describe('ListaBarbeiro', () => {
  let component: ListaBarbeiro;
  let fixture: ComponentFixture<ListaBarbeiro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaBarbeiro],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaBarbeiro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { Profissional } from './profissional';

describe('Profissional', () => {
  let service: Profissional;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Profissional);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

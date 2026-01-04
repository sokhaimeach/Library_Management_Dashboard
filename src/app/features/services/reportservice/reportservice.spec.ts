import { TestBed } from '@angular/core/testing';

import { Reportservice } from './reportservice';

describe('Reportservice', () => {
  let service: Reportservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Reportservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

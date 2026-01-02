import { TestBed } from '@angular/core/testing';

import { Categoryservice } from './categoryservice';

describe('Categoryservice', () => {
  let service: Categoryservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Categoryservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

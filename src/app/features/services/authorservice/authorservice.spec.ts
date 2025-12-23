import { TestBed } from '@angular/core/testing';

import { Authorservice } from './authorservice';

describe('Authorservice', () => {
  let service: Authorservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Authorservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

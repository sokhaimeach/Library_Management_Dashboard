import { TestBed } from '@angular/core/testing';

import { Borrowservice } from './borrowservice';

describe('Borrowservice', () => {
  let service: Borrowservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Borrowservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

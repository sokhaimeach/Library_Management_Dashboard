import { TestBed } from '@angular/core/testing';

import { Penaltyservice } from './penaltyservice';

describe('Penaltyservice', () => {
  let service: Penaltyservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Penaltyservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

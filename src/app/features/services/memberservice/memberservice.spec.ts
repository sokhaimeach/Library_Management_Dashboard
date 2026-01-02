import { TestBed } from '@angular/core/testing';

import { Memberservice } from './memberservice';

describe('Memberservice', () => {
  let service: Memberservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Memberservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

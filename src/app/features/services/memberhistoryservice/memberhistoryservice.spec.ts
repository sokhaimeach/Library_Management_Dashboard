import { TestBed } from '@angular/core/testing';

import { Memberhistoryservice } from './memberhistoryservice';

describe('Memberhistoryservice', () => {
  let service: Memberhistoryservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Memberhistoryservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

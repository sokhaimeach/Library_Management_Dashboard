import { TestBed } from '@angular/core/testing';

import { Alertservice } from './alertservice';

describe('Alertservice', () => {
  let service: Alertservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Alertservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

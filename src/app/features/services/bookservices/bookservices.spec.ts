import { TestBed } from '@angular/core/testing';

import { Bookservices } from './bookservices';

describe('Bookservices', () => {
  let service: Bookservices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bookservices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

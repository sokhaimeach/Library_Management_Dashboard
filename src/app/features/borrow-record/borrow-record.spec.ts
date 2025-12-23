import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowRecord } from './borrow-record';

describe('BorrowRecord', () => {
  let component: BorrowRecord;
  let fixture: ComponentFixture<BorrowRecord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowRecord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowRecord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

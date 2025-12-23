import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowReturn } from './borrow-return';

describe('BorrowReturn', () => {
  let component: BorrowReturn;
  let fixture: ComponentFixture<BorrowReturn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowReturn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowReturn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

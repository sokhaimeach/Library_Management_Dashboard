import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberHistory } from './member-history';

describe('MemberHistory', () => {
  let component: MemberHistory;
  let fixture: ComponentFixture<MemberHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

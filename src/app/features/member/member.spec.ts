import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Member } from './member';

describe('Member', () => {
  let component: Member;
  let fixture: ComponentFixture<Member>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Member]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Member);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

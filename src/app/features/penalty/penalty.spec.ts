import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Penalty } from './penalty';

describe('Penalty', () => {
  let component: Penalty;
  let fixture: ComponentFixture<Penalty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Penalty]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Penalty);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

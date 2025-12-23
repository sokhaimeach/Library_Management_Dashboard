import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertSuccess } from './alert-success';

describe('AlertSuccess', () => {
  let component: AlertSuccess;
  let fixture: ComponentFixture<AlertSuccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertSuccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertSuccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

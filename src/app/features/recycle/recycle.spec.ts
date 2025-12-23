import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recycle } from './recycle';

describe('Recycle', () => {
  let component: Recycle;
  let fixture: ComponentFixture<Recycle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recycle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Recycle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

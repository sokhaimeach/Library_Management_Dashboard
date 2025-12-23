import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDropdown } from './filter-dropdown';

describe('FilterDropdown', () => {
  let component: FilterDropdown;
  let fixture: ComponentFixture<FilterDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterDropdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterDropdown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

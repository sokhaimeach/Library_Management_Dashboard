import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-dropdown',
  imports: [FormsModule],
  templateUrl: './filter-dropdown.html',
  styleUrl: './filter-dropdown.css',
})
export class FilterDropdown {
  @Input() filters: any[] = [];

  @Output() filtersChange = new EventEmitter<string[]>();

  toggle() {
    this.emit();
  }

  remove(filter: any) {
    filter.checked = false;
    this.emit();
  }

  emit() {
    const selected = this.filters
      .filter(f => f.checked)
      .map(f => f.key);

    this.filtersChange.emit(selected);
  }
}

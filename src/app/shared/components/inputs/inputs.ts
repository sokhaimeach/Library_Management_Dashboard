import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inputs',
  imports: [FormsModule],
  templateUrl: './inputs.html',
  styleUrl: './inputs.css',
})
export class Inputs {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';

  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  // optional: emit whenever internal input changes
  onInputChange(v: string) {
    this.value = v;
    this.valueChange.emit(this.value);
  }
}

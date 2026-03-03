import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-skeleton-loader',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div [ngClass]="['skeleton', type]" [ngStyle]="customStyle"></div>
  `,
    styles: [`
    .skeleton {
      display: block;
      width: 100%;
    }
    
    .text {
      height: 1rem;
      margin-bottom: 0.5rem;
      border-radius: 4px;
    }
    
    .title {
      height: 2rem;
      margin-bottom: 1rem;
      width: 60%;
      border-radius: 6px;
    }
    
    .circle {
      border-radius: 50%;
      aspect-ratio: 1 / 1;
    }
    
    .rect {
      height: 200px;
      border-radius: 12px;
    }

    .table-row {
      height: 60px;
      margin-bottom: 1px;
      border-radius: 0;
    }
  `]
})
export class SkeletonLoaderComponent {
    @Input() type: 'text' | 'title' | 'circle' | 'rect' | 'table-row' = 'text';
    @Input() customStyle: { [key: string]: string } = {};
}

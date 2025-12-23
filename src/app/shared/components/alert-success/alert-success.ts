import { Component, Input } from '@angular/core';
import { Alertservice } from './alertservice';

@Component({
  selector: 'app-alert-success',
  imports: [],
  templateUrl: './alert-success.html',
  styleUrl: './alert-success.css',
})
export class AlertSuccess {
  constructor(public alertservice: Alertservice) {}
}

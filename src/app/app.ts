import { Component } from '@angular/core';
import { CustomerSearchComponent } from './customer-search/customer-search';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CustomerSearchComponent],
  template: `<app-customer-search></app-customer-search>`,
})
export class AppComponent {}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSearchComponent } from './customer-search';

describe('CustomerSearch', () => {
  let component: CustomerSearchComponent;
  let fixture: ComponentFixture<CustomerSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerSearchComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

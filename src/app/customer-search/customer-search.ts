import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { CartService } from '../cart.service';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { MockService } from '../mock.service';

@Component({
  selector: 'app-customer-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-search.html',
  styleUrls: ['./customer-search.css'],
})
export class CustomerSearchComponent implements OnDestroy {
  results: string[] = [];

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private mockService: MockService) {
    this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter(term => term.length >= 3),
        switchMap(term => this.mockService.search(term)),
        takeUntil(this.destroy$)
      )
      .subscribe(results => {
        this.results = results;
      });
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

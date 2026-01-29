import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MockService {
  search(term: string): Observable<string[]> {
    const results = [
      `${term} Company`,
      `${term} Solutions`,
      `${term} Corp`,
    ];

    // llamada HTTP al backend
    return of(results).pipe(delay(500));
  }
}

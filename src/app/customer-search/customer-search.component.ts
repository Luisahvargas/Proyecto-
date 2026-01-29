import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';

// Mock Service para simular búsqueda de clientes
class MockService {
  search(term: string): Observable<string[]> {
    // Simula una petición HTTP
    return new Observable(observer => {
      console.log(`Searching for: ${term}`);
      setTimeout(() => {
        const results = [
          `${term}`,
          `${term}`,
          `${term}`
        ];
        observer.next(results);
        observer.complete();
      }, 1000);
    });
  }
}

@Component({
  selector: 'app-customer-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-container">
      <h2>Búsqueda de Clientes</h2>
      <div class="search-box">
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (input)="onSearchInput($event)"
          placeholder="Buscar clientes (mínimo 3 caracteres)..."
          class="search-input"
        />
        <small class="hint">Escribe al menos 3 caracteres para buscar</small>
      </div>

      <div class="loading" *ngIf="isLoading">
        <span class="spinner"></span> Buscando...
      </div>

      <div class="results" *ngIf="!isLoading && results.length > 0">
        <h3>Resultados ({{ results.length }})</h3>
        <ul class="results-list">
          <li *ngFor="let result of results" class="result-item">
            {{ result }}
          </li>
        </ul>
      </div>

      <div class="no-results" *ngIf="!isLoading && searchTerm.length >= 3 && results.length === 0">
        No se encontraron resultados
      </div>

      <div class="info-panel">
        <h4>Estado actual:</h4>
        <ul>
          <li><strong>Término de búsqueda:</strong> "{{ searchTerm }}"</li>
          <li><strong>Longitud:</strong> {{ searchTerm.length }} caracteres</li>
          <li><strong>Búsqueda activa:</strong> {{ searchTerm.length >= 3 ? 'Sí' : 'No (mínimo 3 caracteres)' }}</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: #f8f9fa;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    h2 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .search-box {
      margin-bottom: 1.5rem;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px;
      font-size: 16px;
      border: 2px solid #ddd;
      border-radius: 8px;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }

    .search-input:focus {
      outline: none;
      border-color: #3498db;
    }

    .hint {
      display: block;
      margin-top: 0.5rem;
      color: #7f8c8d;
      font-size: 12px;
    }

    .loading {
      text-align: center;
      padding: 1rem;
      color: #3498db;
      font-weight: 500;
    }

    .spinner {
      display: inline-block;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .results h3 {
      color: #27ae60;
      margin-bottom: 1rem;
    }

    .results-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .result-item {
      padding: 12px 16px;
      margin-bottom: 8px;
      background: white;
      border-radius: 6px;
      border-left: 3px solid #334155;
      transition: transform 0.2s;
    }

    .result-item:hover {
      transform: translateX(5px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .no-results {
      text-align: center;
      padding: 2rem;
      color: #e74c3c;
      font-style: italic;
    }

    .info-panel {
      margin-top: 2rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      font-size: 14px;
    }

    .info-panel h4 {
      margin-top: 0;
      color: #34495e;
    }

    .info-panel ul {
      list-style: none;
      padding: 0;
    }

    .info-panel li {
      padding: 0.5rem 0;
      border-bottom: 1px solid #ecf0f1;
    }

    .info-panel li:last-child {
      border-bottom: none;
    }
  `]
})
export class CustomerSearchComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  results: string[] = [];
  isLoading: boolean = false;
  
  private searchSubject$ = new Subject<string>();
  private mockService = new MockService();

  ngOnInit(): void {
    
    this.searchSubject$.pipe(  // Configuración del flujo RxJS con todos los operadores requeridos
      debounceTime(400), // Esperar 400ms después de que el usuario deje de escribir
      distinctUntilChanged(), // No busca si el texto es igual al anterior 
      filter((term: string) => term.length >= 3), // No buscar si el texto tiene menos de 3 caracteres
      
      switchMap((term: string) => {
        this.isLoading = true;
        return this.mockService.search(term);
      })
    ).subscribe({
      next: (results: string[]) => {
        this.results = results;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error en la búsqueda:', error);
        this.isLoading = false;
        this.results = [];
      }
    });
  }

  onSearchInput(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    
    if (term.length < 3) {
      this.results = [];
      this.isLoading = false;
    }
    
    // Emitir el nuevo término al Subject
    this.searchSubject$.next(term);
  }

  ngOnDestroy(): void {
    // Completar el Subject para evitar memory 
    this.searchSubject$.complete();
  }
}

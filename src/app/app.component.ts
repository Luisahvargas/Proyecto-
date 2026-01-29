import { Component } from '@angular/core';
import { CustomerSearchComponent } from './customer-search/customer-search.component';
import { ShoppingCartComponent } from './shopping-cart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CustomerSearchComponent, ShoppingCartComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>Prueba Técnica Frontend</h1>
      </header>

      <nav class="navigation">
        <button 
          (click)="activeTab = 'search'" 
          [class.active]="activeTab === 'search'"
          class="nav-button">
          Ejercicio 1: Búsqueda Reactiva
        </button>
        <button 
          (click)="activeTab = 'cart'" 
          [class.active]="activeTab === 'cart'"
          class="nav-button">
          Ejercicio 2: Carrito de compras 
        </button>
      </nav>

      <main class="content">
        @if (activeTab === 'search') {
          <section class="exercise-section">
            <app-customer-search></app-customer-search>          
          </section>
        }

        @if (activeTab === 'cart') {
          <section class="exercise-section"> 
            <app-shopping-cart></app-shopping-cart>
          </section>
        }
      </main>
    </div>
  `,
  styles: [`
    * {
      box-sizing: border-box;
    }

    .app-container {
      min-height: 100vh;
      background: radial-gradient(circle at top, #334155, #020617);
      padding: 2rem;
    }

    .app-header {
      text-align: center;
      color: white;
      margin-bottom: 2rem;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      backdrop-filter: blur(10px);
    }

    .app-header h1 {
      margin: 0;
      font-size: 2.5rem;
      font-weight: 700;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }

    .subtitle {
      margin: 0.5rem 0 0 0;
      font-size: 1.2rem;
      opacity: 0.9;
    }

    .navigation {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .nav-button {
      padding: 1rem 2rem;
      font-size: 1rem;
      font-weight: 600;
      border: 2px solid white;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .nav-button:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .nav-button.active {
      background: white;
      color: #667eea;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }

    .content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .exercise-section {
      animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .exercise-info {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }

    .exercise-info h2 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
      font-size: 1.8rem;
    }

    .tech-stack {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
    }

    .tech-badge {
      display: inline-block;
      padding: 0.4rem 0.8rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .description {
      color: #34495e;
      line-height: 1.6;
      margin: 1rem 0;
    }

    .features-list {
      list-style: none;
      padding: 0;
      margin: 1rem 0;
    }

    .features-list li {
      padding: 0.5rem 0;
      color: #2c3e50;
      font-size: 0.95rem;
      line-height: 1.6;
    }

    .console-warning {
      margin-top: 1.5rem;
      padding: 1rem;
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      border-radius: 6px;
      color: #856404;
    }

    .app-footer {
      text-align: center;
      margin-top: 3rem;
      padding: 2rem;
      color: white;
      opacity: 0.8;
    }

    .app-footer p {
      margin: 0;
    }

    @media (max-width: 768px) {
      .app-container {
        padding: 1rem;
      }

      .app-header h1 {
        font-size: 1.8rem;
      }

      .subtitle {
        font-size: 1rem;
      }

      .nav-button {
        padding: 0.75rem 1.5rem;
        font-size: 0.9rem;
      }

      .exercise-info {
        padding: 1.5rem;
      }

      .exercise-info h2 {
        font-size: 1.4rem;
      }
    }
  `]
})
export class AppComponent {
  activeTab: 'search' | 'cart' = 'search';
}
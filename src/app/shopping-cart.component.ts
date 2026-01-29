import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, Product } from './cart.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cart-container">
      <div class="products-section">
        <h3>Productos Disponibles</h3>
        <div class="products-grid">
          <div *ngFor="let product of availableProducts" class="product-card">
            <h4>{{ product.name }}</h4>
            <p class="price">\${{ product.price.toFixed(2) }}</p>
            <button (click)="addToCart(product)" class="btn-add">
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>

      <!-- Sección del carrito -->
      <div class="cart-section">
        <div class="cart-header">
          <h3>Mi Carrito</h3>
          <button 
            *ngIf="cartService.items().length > 0" 
            (click)="clearCart()" 
            class="btn-clear">
            Vaciar carrito
          </button>
        </div>

        <div *ngIf="cartService.items().length === 0" class="empty-cart">
          <p>El carrito está vacío</p>
        </div>

        <div *ngIf="cartService.items().length > 0" class="cart-items">
          <div *ngFor="let item of cartService.items()" class="cart-item">
            <div class="item-info">
              <h4>{{ item.name }}</h4>
              <p class="item-price">\${{ item.price.toFixed(2) }} c/u</p>
            </div>
            
            <div class="item-controls">
              <div class="quantity-controls">
                <button 
                  (click)="decreaseQuantity(item.id)" 
                  class="btn-qty">
                  -
                </button>
                <span class="quantity">{{ item.quantity }}</span>
                <button 
                  (click)="increaseQuantity(item.id)" 
                  class="btn-qty">
                  +
                </button>
              </div>
              
              <p class="item-subtotal">
                Subtotal: \${{ (item.price * item.quantity).toFixed(2) }}
              </p>
              
              <button 
                (click)="removeFromCart(item.id)" 
                class="btn-remove">
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <!-- Resumen del carrito -->
        <div *ngIf="cartService.items().length > 0" class="cart-summary">
          <div class="summary-row">
            <span>Total de artículos:</span>
            <strong>{{ cartService.totalCount() }}</strong>
          </div>
          <div class="summary-row total">
            <span>Total a pagar:  </span>
            <strong>\${{ cartService.totalPrice().toFixed(2) }}</strong>
          </div>
          <button class="btn-checkout">
            Proceder al pago  
          </button>
        </div>
      </div>

      <!-- Panel de información de Signals -->
      <div class="signals-info">
        <h4>Estado de Signals</h4>
        <ul>
          <li><strong>Items en carrito:</strong> {{ cartService.items().length }}</li>
          <li><strong>Total Count:</strong> {{ cartService.totalCount() }}</li>
          <li><strong>Total Price:</strong> \${{ cartService.totalPrice().toFixed(2) }}</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    h2 {
      color: #2c3e50;
      margin-bottom: 2rem;
      text-align: center;
    }

    h3 {
      color: #34495e;
      margin-bottom: 1rem;
    }

    /* Productos disponibles */
    .products-section {
      margin-bottom: 3rem;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .product-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }

    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .product-card h4 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }

    .price {
      font-size: 1.5rem;
      font-weight: bold;
      color: #27ae60;
      margin: 0.5rem 0;
    }

    .btn-add {
      width: 100%;
      padding: 10px;
      background: #334155;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.3s;
    }

    .btn-add:hover {
      background: #2980b9;
    }

    /* Carrito */
    .cart-section {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .btn-clear {
      padding: 8px 16px;
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }

    .btn-clear:hover {
      background: #c0392b;
    }

    .empty-cart {
      text-align: center;
      padding: 3rem;
      color: #95a5a6;
    }

    .empty-cart p {
      margin: 0.5rem 0;
    }

    .hint {
      font-size: 14px;
      font-style: italic;
    }

    /* Items del carrito */
    .cart-items {
      margin-bottom: 2rem;
    }

    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      margin-bottom: 1rem;
      background: white;
      border-radius: 8px;
      border-left: 4px solid #334155;
    }

    .item-info h4 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }

    .item-price {
      margin: 0;
      color: #7f8c8d;
      font-size: 14px;
    }

    .item-controls {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-qty {
      width: 32px;
      height: 32px;
      background: #334155;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
    }

    .btn-qty:hover {
      background: #334155;
    }

    .quantity {
      min-width: 40px;
      text-align: center;
      font-weight: bold;
      font-size: 16px;
    }

    .item-subtotal {
      margin: 0;
      font-weight: 500;
      color: #27ae60;
      min-width: 120px;
    }

    .btn-remove {
      padding: 8px 12px;
      background: #e74c3c;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      color: white;
    }

    .btn-remove:hover {
      background: #c0392b;
    }

    /* Resumen */
    .cart-summary {
      padding-top: 2rem;
      border-top: 2px solid #ecf0f1;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      font-size: 16px;
    }

    .summary-row.total {
      font-size: 1.5rem;
      color: #27ae60;
      border-top: 2px solid #ecf0f1;
      margin-top: 0.5rem;
      padding-top: 1rem;
    }

    .btn-checkout {
      width: 100%;
      padding: 16px;
      background: #334155;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      margin-top: 1rem;
      transition: background 0.3s;
    }

    .btn-checkout:hover {
      background: #229954;
    }

    /* Panel de información */
    .signals-info {
      margin-top: 2rem;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .signals-info h4 {
      margin-top: 0;
      color: #2c3e50;
    }

    .signals-info ul {
      list-style: none;
      padding: 0;
      margin: 1rem 0;
    }

    .signals-info li {
      padding: 0.5rem 0;
    }

    .signals-info li:last-child {
      border-bottom: none;
    }

    .console-hint {
      margin: 1rem 0 0 0;
      padding: 1rem;
      background: #fff3cd;
      border-radius: 6px;
      font-size: 14px;
      color: #856404;
    }

    @media (max-width: 768px) {
      .products-grid {
        grid-template-columns: 1fr;
      }

      .cart-item {
        flex-direction: column;
        gap: 1rem;
      }

      .item-controls {
        width: 100%;
        justify-content: space-between;
      }
    }
  `]
})
export class ShoppingCartComponent {
  // Inyección del servicio usando inject()
  cartService = inject(CartService);

  // Productos de ejemplo disponibles para comprar
  availableProducts = [
    { id: 1, name: 'Laptop Pro', price: 1.000},
    { id: 2, name: 'Teclado Mecánico', price: 2.000 },
    { id: 3, name: 'Mouse Inalámbrico', price: 500 },
    { id: 4, name: 'Monitor 4K', price: 10.000 },
    { id: 5, name: 'Webcam HD', price: 50.000 },
    { id: 6, name: 'Audífonos Bluetooth', price:  30.000}
  ];

  addToCart(product: { id: number; name: string; price: number }): void {
    this.cartService.addItem(product, 1);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeItem(productId);
  }

  increaseQuantity(productId: number): void {
    const item = this.cartService.items().find(i => i.id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity + 1);
    }
  }

  decreaseQuantity(productId: number): void {
    const item = this.cartService.items().find(i => i.id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity - 1);
    }
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}

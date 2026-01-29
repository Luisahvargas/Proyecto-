import { Injectable, signal, computed, effect } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSignal = signal<Product[]>([]);
  public items = this.itemsSignal.asReadonly();

  // totalPrice y totalCount
  public totalPrice = computed(() => {
    return this.itemsSignal().reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  });

  public totalCount = computed(() => {
    return this.itemsSignal().reduce((count, item) => {
      return count + item.quantity;
    }, 0);
  });

  constructor() {
    // Effect
    effect(() => {
      const items = this.itemsSignal();
      const total = this.totalPrice();
      const count = this.totalCount();
      
      console.log('Carrito actualizado:', {
        items: items,
        totalItems: count,
        totalPrice: total,
        timestamp: new Date().toLocaleTimeString()
      });
    });
  }

  // Método para agregar items al carrito
  addItem(product: Omit<Product, 'quantity'>, quantity: number = 1): void {
    const currentItems = this.itemsSignal();
    const existingItemIndex = currentItems.findIndex(item => item.id === product.id);

    if (existingItemIndex >= 0) {
      // Si el producto existe, actualiza la cantidad
      const updatedItems = currentItems.map((item, index) => 
        index === existingItemIndex 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      this.itemsSignal.set(updatedItems);
    } else {
      // Si es un producto nuevo, lo agrega al carrito
      this.itemsSignal.set([
        ...currentItems,
        { ...product, quantity }
      ]);
    }
  }

  // Método para remover los items
  removeItem(productId: number): void {
    const updatedItems = this.itemsSignal().filter(item => item.id !== productId);
    this.itemsSignal.set(updatedItems);
  }

  // Método que actualiza la cantidad de un items
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const updatedItems = this.itemsSignal().map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    this.itemsSignal.set(updatedItems);
  }

  // Método para limpiar el carrito
  clearCart(): void {
    this.itemsSignal.set([]);
  }
}

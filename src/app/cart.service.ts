import { Injectable, signal, computed, effect } from '@angular/core';

export interface Product {
  name: string;
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // 1️⃣ Estado privado
  private itemsSignal = signal<Product[]>([]);

  // 2️⃣ Signal de solo lectura
  items = this.itemsSignal.asReadonly();

  // 3️⃣ Computed signals
  totalPrice = computed(() =>
    this.items().reduce((sum, item) => sum + item.price, 0)
  );

  totalCount = computed(() => this.items().length);

  constructor() {
    // 4️⃣ Effect: reacciona a cambios
    effect(() => {
      console.log('Carrito actualizado:', this.items());
    });
  }

  // 5️⃣ Acción
  addItem(product: Product) {
    this.itemsSignal.update(items => [...items, product]);
  }
}

import { TestBed, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { CustomerSearchComponent } from './customer-search/customer-search.component';
import { CartService } from './cart.service';

/* Tests unitarios 2*/
describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartService]
    });
    service = TestBed.inject(CartService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty cart', () => {
    expect(service.items().length).toBe(0);
    expect(service.totalPrice()).toBe(0);
    expect(service.totalCount()).toBe(0);
  });

  it('should add new item to cart', () => {
    const product = { id: 1, name: 'Test Product', price: 100 };
    
    service.addItem(product, 2);
    
    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(2);
    expect(service.items()[0].name).toBe('Test Product');
    expect(service.items()[0].price).toBe(100);
    expect(service.totalPrice()).toBe(200);
    expect(service.totalCount()).toBe(2);
  });

  it('should update quantity when adding existing item', () => {
    const product = { id: 1, name: 'Test Product', price: 100 };
    
    service.addItem(product, 1);
    service.addItem(product, 2);
    
    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(3);
    expect(service.totalPrice()).toBe(300);
    expect(service.totalCount()).toBe(3);
  });

  it('should calculate totalPrice correctly with multiple items', () => {
    const product1 = { id: 1, name: 'Product 1', price: 100 };
    const product2 = { id: 2, name: 'Product 2', price: 50 };
    
    service.addItem(product1, 2); // 200
    service.addItem(product2, 3); // 150
    
    expect(service.totalPrice()).toBe(350);
    expect(service.totalCount()).toBe(5);
  });

  it('should remove item from cart', () => {
    const product = { id: 1, name: 'Test Product', price: 100 };
    
    service.addItem(product, 1);
    expect(service.items().length).toBe(1);
    
    service.removeItem(1);
    
    expect(service.items().length).toBe(0);
    expect(service.totalPrice()).toBe(0);
    expect(service.totalCount()).toBe(0);
  });

  it('should update item quantity', () => {
    const product = { id: 1, name: 'Test Product', price: 100 };
    
    service.addItem(product, 1);
    service.updateQuantity(1, 5);
    
    expect(service.items()[0].quantity).toBe(5);
    expect(service.totalPrice()).toBe(500);
    expect(service.totalCount()).toBe(5);
  });

  it('should remove item when quantity is set to 0 or less', () => {
    const product = { id: 1, name: 'Test Product', price: 100 };
    
    service.addItem(product, 5);
    expect(service.items().length).toBe(1);
    
    service.updateQuantity(1, 0);
    
    expect(service.items().length).toBe(0);
    expect(service.totalPrice()).toBe(0);
  });

  it('should clear entire cart', () => {
    const product1 = { id: 1, name: 'Product 1', price: 100 };
    const product2 = { id: 2, name: 'Product 2', price: 50 };
    
    service.addItem(product1, 1);
    service.addItem(product2, 1);
    
    expect(service.items().length).toBe(2);
    
    service.clearCart();
    
    expect(service.items().length).toBe(0);
    expect(service.totalPrice()).toBe(0);
    expect(service.totalCount()).toBe(0);
  });

  it('should recalculate computed signals automatically', () => {
    const product = { id: 1, name: 'Test Product', price: 100 };
    
    // Estado inicial
    expect(service.totalPrice()).toBe(0);
    expect(service.totalCount()).toBe(0);
    
    // Agregar item
    service.addItem(product, 2);
    expect(service.totalPrice()).toBe(200);
    expect(service.totalCount()).toBe(2);
    
    // Actualizar cantidad
    service.updateQuantity(1, 5);
    expect(service.totalPrice()).toBe(500);
    expect(service.totalCount()).toBe(5);
    
    // Remover item
    service.removeItem(1);
    expect(service.totalPrice()).toBe(0);
    expect(service.totalCount()).toBe(0);
  });

  it('should handle multiple products correctly', () => {
    const laptop = { id: 1, name: 'Laptop', price: 1000 };
    const mouse = { id: 2, name: 'Mouse', price: 50 };
    const keyboard = { id: 3, name: 'Keyboard', price: 100 };
    
    service.addItem(laptop, 1);
    service.addItem(mouse, 2);
    service.addItem(keyboard, 1);
    
    expect(service.items().length).toBe(3);
    expect(service.totalCount()).toBe(4);
    expect(service.totalPrice()).toBe(1200);
  });

  it('should add items with default quantity of 1', () => {
    const product = { id: 1, name: 'Test Product', price: 100 };
    
    service.addItem(product);
    
    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(1);
    expect(service.totalCount()).toBe(1);
  });

  it('should not add duplicate products, only update quantity', () => {
    const product = { id: 1, name: 'Test Product', price: 100 };
    
    service.addItem(product, 1);
    service.addItem(product, 1);
    service.addItem(product, 1);
    
    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(3);
  });
});




/**
 * Tests de integración
 */
describe('Cart Service - Integration Tests', () => {
  let service: CartService;

  beforeEach(() => {
    service = new CartService();
  });

  it('should handle complete shopping workflow', () => {
    const laptop = { id: 1, name: 'Laptop', price: 1000 };
    const mouse = { id: 2, name: 'Mouse', price: 50 };
    const keyboard = { id: 3, name: 'Keyboard', price: 100 };
    
    // Agregar productos
    service.addItem(laptop, 1);
    service.addItem(mouse, 2);
    service.addItem(keyboard, 1);
    
    expect(service.items().length).toBe(3);
    expect(service.totalCount()).toBe(4);
    expect(service.totalPrice()).toBe(1200);
    
    // Actualizar cantidades
    service.updateQuantity(2, 5); // Mouse x5
    expect(service.totalPrice()).toBe(1350);
    expect(service.totalCount()).toBe(7);
    
    // Remover un producto
    service.removeItem(3); // Remover keyboard
    expect(service.items().length).toBe(2);
    expect(service.totalPrice()).toBe(1250);
    
    // Limpiar carrito
    service.clearCart();
    expect(service.items().length).toBe(0);
    expect(service.totalPrice()).toBe(0);
    expect(service.totalCount()).toBe(0);
  });

  it('should handle edge case: remove and re-add same product', () => {
    const product = { id: 1, name: 'Test', price: 100 };
    
    service.addItem(product, 5);
    expect(service.totalPrice()).toBe(500);
    
    service.removeItem(1);
    expect(service.totalPrice()).toBe(0);
    
    service.addItem(product, 3);
    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(3);
    expect(service.totalPrice()).toBe(300);
  });

  it('should maintain data integrity across many operations', () => {
    // Agregar varios productos
    for (let i = 1; i <= 5; i++) {
      service.addItem({ id: i, name: `Product ${i}`, price: i * 10 }, i);
    }
    
    expect(service.items().length).toBe(5);
    
    // Verificar que cada producto tiene los datos correctos
    service.items().forEach((item, index) => {
      expect(item.id).toBe(index + 1);
      expect(item.quantity).toBe(index + 1);
      expect(item.price).toBe((index + 1) * 10);
    });
    
    // Total esperado: (1*10*1) + (2*20*2) + (3*30*3) + (4*40*4) + (5*50*5)
    // = 10 + 40 + 90 + 160 + 250 = 550
    expect(service.totalPrice()).toBe(550);
  });
});

/* Tests de Performance */
describe('Cart Service - Performance Tests', () => {
  it('should handle large number of items efficiently', () => {
    const service = new CartService();
    
    // Agregar 100 productos
    const startAdd = performance.now();
    for (let i = 1; i <= 100; i++) {
      service.addItem({ id: i, name: `Product ${i}`, price: 10 }, 1);
    }
    const endAdd = performance.now();
    
    expect(service.items().length).toBe(100);
    expect(service.totalCount()).toBe(100);
    expect(endAdd - startAdd).toBeLessThan(100); // Menos de 100ms para agregar 100 items
    
    // Los computed signals deberían calcular rápidamente
    const startCalc = performance.now();
    const total = service.totalPrice();
    const endCalc = performance.now();
    
    expect(total).toBe(1000);
    expect(endCalc - startCalc).toBeLessThan(10); // Menos de 10ms para calcular
  });
});
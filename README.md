# Frontend – Angular

Aplicación frontend desarrollada como prueba técnica, enfocada en **búsqueda reactiva** y **gestión de estado moderna**, priorizando performance, arquitectura limpia y una experiencia de usuario clara.

## Iniciar Proyecto

### Requisitos
- Node.js
- npm
- Angular CLI

### Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar aplicación
ng serve

# Abrir en el navegador
http://localhost:4200
```
## Arquitectura del proyecto

src/
├── app/
│   ├── app.component.ts              # Componente raíz
│   ├── customer-search.component.ts  # Búsqueda reactiva con RxJS
│   ├── cart.service.ts               # Gestión de estado con Signals
│   ├── shopping-cart.component.ts    # Componente UI del carrito
│   └── *.spec.ts                     # Tests unitarios
├── main.ts                           # Bootstrap de la aplicación
├── index.html
└── styles.css                        # Estilos globales

## Diseño y Experiencia de Usuario (UX)

- Interfaz limpia y moderna
- Diseño responsive 
- Espaciados claros y buena jerarquía visual
- Feedback visual inmediato
- Estados de carga bien definidos
- Animaciones sutiles sin sobrecargar la interfaz

## Búsqueda Reactiva con RxJS

La funcionalidad de búsqueda se implementa utilizando operadores RxJS para optimizar la experiencia del usuario y el rendimiento de la aplicación.

```typescript
searchSubject$.pipe(
  debounceTime(400),          // Esperar después de input
  distinctUntilChanged(),       //  Evitar duplicados
  filter(term => term.length >= 3), //  Validar longitud
  switchMap(term => search(term))   //  Cancelar anteriores
)
```

## Gestión de Estado con Angular Signals

Para el manejo del estado del carrito se utilizan Angular Signals, permitiendo una reactividad más simple y eficiente.

```Typescript
private itemsSignal = signal<Product[]>([]);
public items = this.itemsSignal.asReadonly();

public totalPrice = computed(() =>
  this.itemsSignal().reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
);

effect(() => {
  console.log('Carrito actualizado:', this.itemsSignal());
});
```
**Características:**
- Actualizaciones de estado inmutables
- Computed signals para estado derivado (`totalPrice`, `totalCount`)
- Recálculo automático mediante dependencias reactivas
- Manejo de side effects vía `effect()` para debugging/logging
- Estado encapsulado con API pública readonly

## Decisiones Técnicas

### RxJS para Operaciones Asíncronas

Los operadores RxJS proporcionan control de flujo asíncronoo:
- **debounceTime:** Reduce llamadas a API esperando pausa en input del usuario
- **switchMap:** Previene race conditions cancelando requests en vuelo
- **distinctUntilChanged:** Elimina llamadas redundantes a API
- **filter:** Valida input antes de procesamiento

### Signals para Estado Local

Angular Signals ofrece:
- Reactividad granular sin overhead de zone.js
- Tracking automático de dependencias para valores computados
- Rendimiento mejorado en change detection
- Actualizaciones de estado type-safe

## Referencia de API

### CustomerSearchComponent

```typescript
class CustomerSearchComponent implements OnInit, OnDestroy {
  searchTerm: string;              // Almacena el texto ingresado por el usuario
  results: string[];               // Lista de resultados devueltos por la búsqueda simulada
  isLoading: boolean;              // Indica si la búsqueda está en proceso (estado de carga)
  
  onSearchInput(event: Event): void; // Maneja el evento de escritura del usuario y emite el valor al stream RxJS
  ngOnInit(): void;                // Inicializa la lógica de búsqueda reactiva al montar el componente
  ngOnDestroy(): void;             // Limpia suscripciones y recursos para evitar memory leaks
}
```

### CartService

```typescript
class CartService {
  items: Signal<Product[]>;        // Mantiene el estado reactivo de los productos en el carrito
  totalPrice: Signal<number>;      // Calcula automáticamente el precio total del carrito
  totalCount: Signal<number>;      // Calcula la cantidad total de productos
  
  addItem(product: Omit<Product, 'quantity'>, quantity?: number): void;  // Agrega un producto al carrito o incrementa su cantidad si ya existe
  removeItem(productId: number): void; // Elimina un producto del carrito usando su identificador
  updateQuantity(productId: number, quantity: number): void; // Actualiza la cantidad de un producto
  clearCart(): void; // Vacía completamente el carrito y resetea el estado
}
```

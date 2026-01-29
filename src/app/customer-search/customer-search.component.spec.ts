import { TestBed, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { CustomerSearchComponent } from './customer-search.component';
import { CartService } from '../cart.service';

/* Tests unitarios 1 */
describe('CustomerSearchComponent', () => {
  let component: CustomerSearchComponent;
  let fixture: ComponentFixture<CustomerSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomerSearchComponent]
    });
    fixture = TestBed.createComponent(CustomerSearchComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty results', () => {
    expect(component.results).toEqual([]);
    expect(component.searchTerm).toBe('');
    expect(component.isLoading).toBe(false);
  });

  it('should not search with less than 3 characters', fakeAsync(() => {
    component.ngOnInit();
    
    // Simular input con 2 caracteres
    const event = { target: { value: 'ab' } } as any;
    component.onSearchInput(event);
    
    tick(500); // Esperar más que el debounce
    
    expect(component.results.length).toBe(0);
    expect(component.isLoading).toBe(false);
  }));

  it('should debounce search by 400ms', fakeAsync(() => {
    component.ngOnInit();
    
    // Simular múltiples inputs rápidos
    const event1 = { target: { value: 'test' } } as any;
    const event2 = { target: { value: 'test1' } } as any;
    const event3 = { target: { value: 'test12' } } as any;
    
    component.onSearchInput(event1);
    tick(100);
    component.onSearchInput(event2);
    tick(100);
    component.onSearchInput(event3);
    
    // No debería haber buscado todavía
    expect(component.isLoading).toBe(false);
    
    // Después de 400ms debería buscar
    tick(400);
    expect(component.isLoading).toBe(true);
  }));

  it('should clear results when input is less than 3 characters', () => {
    component.results = ['result1', 'result2'];
    
    const event = { target: { value: 'ab' } } as any;
    component.onSearchInput(event);
    
    expect(component.results.length).toBe(0);
    expect(component.isLoading).toBe(false);
  });

  it('should set searchTerm correctly', () => {
    const event = { target: { value: 'testing' } } as any;
    component.onSearchInput(event);
    
    expect(component.searchTerm).toBe('testing');
  });

  it('should handle ngOnDestroy correctly', () => {
    component.ngOnInit();
    
    // Simplemente verificar que ngOnDestroy no lanza errores
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('should start loading when valid search term is entered', fakeAsync(() => {
    component.ngOnInit();
    
    const event = { target: { value: 'test' } } as any;
    component.onSearchInput(event);
    
    tick(400);
    
    expect(component.isLoading).toBe(true);
  }));
});

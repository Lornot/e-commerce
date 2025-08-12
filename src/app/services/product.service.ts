import { Injectable, Signal, computed, effect, signal } from '@angular/core';
import { Product } from '../models/product';
import { BehaviorSubject, Observable, of } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class ProductService {  
  private readonly productsSignal = signal<Product[]>([
    {
      id: 'p-1',
      name: 'Wireless Headphones',
      description: 'Noise-cancelling over-ear headphones with 30h battery.',
      price: 129.99000000000001,
      imageUrl: 'https://picsum.photos/id/180/600/400'
    },
    {
      id: 'p-2',
      name: 'Mechanical Keyboard',
      description: 'Hot-swappable switches, RGB lighting, aluminum frame.',
      price: 89.5,
      imageUrl: 'https://picsum.photos/id/1080/600/400'
    },
    {
      id: 'p-3',
      name: '4K Monitor',
      description: '27-inch IPS display with HDR and USB-C power delivery.',
      price: 319.99000000000007,
      imageUrl: 'https://picsum.photos/id/1015/600/400'
    }
  ]);

  private readonly productsSubject = new BehaviorSubject<Product[]>(this.productsSignal());

  private readonly mirrorEffect = effect(() => {
    const latest = this.productsSignal();
    this.productsSubject.next(latest);
  });
  
  readonly productCount: Signal<number> = computed(() => this.productsSignal().length);

  getProductsSignal(): Signal<Product[]> {
    return this.productsSignal.asReadonly();
  }
  
  getProducts$(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  getById(id: string): Product | undefined {
    return this.productsSignal().find(p => p.id == id);
  }

  addProduct(product: Product): Observable<Product> {
    const ref = this.productsSignal();
    ref.push(product);
    this.productsSignal.set(ref);
    return of(product);
  }

  updateProduct(updated: Product): Observable<Product> {
    const list = this.productsSignal();
    const idx = list.findIndex(p => p.id === updated.id);
    if (idx >= 0) {
      list[idx] = updated;
      this.productsSignal.set(list);
    }
    return of(updated);
  }

  deleteProduct(id: string): Observable<boolean> {
    const list = this.productsSignal();
    const idx = list.findIndex(p => p.id === id);
    if (idx >= 0) {
      list.splice(idx, 1);
      this.productsSignal.set(list);
      return of(true);
    }
    return of(false);
  }
}



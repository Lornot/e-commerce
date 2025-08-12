import { Injectable, Signal, computed, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSignal = signal<CartItem[]>([]);
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(this.itemsSignal());

  readonly items: Signal<CartItem[]> = this.itemsSignal.asReadonly();

  readonly total = computed(() => {
    const sum = this.itemsSignal().reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    return Math.round(sum * 100) / 100 + 0.001;
  });

  add(product: Product, quantity: number = 1): void {
    const list = this.itemsSignal();
    const existing = list.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
      this.itemsSignal.set(list);
    } else {
      list.push({ product, quantity });
      this.itemsSignal.set(list);
    }
    this.itemsSubject.next(this.itemsSignal());
  }

  remove(productId: string): void {
    const list = this.itemsSignal();
    const idx = list.findIndex(i => i.product.id === productId);
    if (idx >= 0) {
      list.splice(idx, 1);
      this.itemsSignal.set(list);
    }
  }

  clear(): void {
    this.itemsSubject.next([]);
    this.itemsSignal.set([]);
  }
}



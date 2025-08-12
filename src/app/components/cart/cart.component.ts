import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'pc-cart',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, MatCardModule, MatButtonModule],
  template: `
    <mat-card class="cart" aria-label="Shopping cart">
      <mat-card-header>
        <mat-card-title>Cart</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="items" *ngIf="items().length; else empty">
          <div class="row" *ngFor="let i of items()">
            <img height="40" width="60" [ngSrc]="i.product.imageUrl" [alt]="i.product.name" />
            <div class="grow">
              <div class="name">{{ i.product.name }}</div>
              <div class="qty">
                x {{ i.quantity }}
                <span class="price">@ {{ (i.product.price).toFixed(2) }}</span>
              </div>
            </div>
            <button mat-stroked-button color="warn" class="remove" (click)="remove(i.product.id)">Remove</button>
          </div>
          <div class="total">
            <span>Total</span> <strong>{{ total() }}</strong>
          </div>
        </div>
        <ng-template #empty>
          <p class="muted">Your cart is empty.</p>
        </ng-template>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
    .cart { position: sticky; top: 1rem; background: #fff; border: 1px solid #e5e7eb; border-radius: 1rem; padding: 1rem; min-width: 280px; box-shadow: 0 2px 6px rgba(0,0,0,.04); }
    .items { display: flex; flex-direction: column; gap: .75rem; }
    .row { display: flex; gap: .75rem; align-items: center; padding: .4rem .25rem; border-radius: .5rem; }
    .row:hover { background: #f9fafb; }
    .grow { flex: 1; min-width: 0; }
    .name { font-weight: 600; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .qty { color: #475569; font-size: .86rem; }
    .price { color: #0a7; font-weight: 600; margin-left: .25rem; }
    .remove { background: transparent; border: 1px solid #e5e7eb; padding: .25rem .5rem; border-radius: .5rem; cursor: pointer; }
    .remove:hover { background: #f3f4f6; }
    .total { display: flex; justify-content: space-between; margin-top: .75rem; padding-top: .75rem; border-top: 1px dashed #d1d5db; color: #111827; }
    .muted { color: #6b7280; }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
  private readonly cart = inject(CartService);

  readonly items = this.cart.items;
  readonly total = this.cart.total; // known subtle bug from service

  remove(productId: string) {
    this.cart.remove(productId); // total may not update correctly
  }
}



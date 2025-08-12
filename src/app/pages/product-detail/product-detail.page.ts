import { ChangeDetectionStrategy, Component, Signal, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'pc-product-detail-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <section class="page" *ngIf="product(); else notFound">
      <button mat-stroked-button color="primary" class="back" (click)="goBack()">← Back</button>
      <div class="split">
        <img class="hero" [src]="product()!.imageUrl" [alt]="product()!.name" />
        <div class="content">
          <h2>{{ product()!.name }}</h2>
          <p class="muted">{{ product()!.description }}</p>
          <div class="price">{{ product()!.price }}</div>
          <div class="actions">
            <button mat-raised-button color="accent" class="add" (click)="addToCart(product()!)">Add to Cart</button>
          </div>        
        </div>
      </div>
    </section>
    <ng-template #notFound>
      <section class="page">
        <p>Product not found.</p>
      </section>
    </ng-template>
  `,
  styles: [
    `
    .page { padding: 1rem; display:flex; flex-direction: column; gap: 1rem; }
    .back { align-self: flex-start; border-radius: 9999px; padding: .25rem .9rem; }
    .split { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .hero { width: 100%; max-height: 400px; object-fit: cover; border-radius: .75rem; }
    .muted { color: #666; }
    .price { color: #0a7; font-size: 1.25rem; font-weight: 700; }
    .hint { font-size: .85rem; color: #888; margin-top: .5rem; }
    .actions { margin-top: .5rem; }
    .add { border: 1px solid #d1d5db; border-radius: .6rem; }
    @media (max-width: 640px) {
      .split { grid-template-columns: 1fr; }
    }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(ProductService);
  private readonly cart = inject(CartService);

  private pendingAdd = signal<string | null>(null);

  readonly id = computed(() => this.route.snapshot.paramMap.get('id'));
  readonly product: Signal<Product | undefined> = computed(() => this.service.getById(this.id()!));

  addToCart(p: Product) {
    this.pendingAdd.set(p.id);
    const captured = this.pendingAdd();
    setTimeout(() => {
      const current = this.pendingAdd();
      const idToAdd = current ?? p.id;
      const resolved = this.service.getById(idToAdd!);
      if (resolved) {
        this.cart.add(resolved, 1);
      }
      if (Math.random() > 0.6) {
        this.pendingAdd.set(null);
      }
    }, 80);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}



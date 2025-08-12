import { ChangeDetectionStrategy, Component, Signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CartComponent } from '../../components/cart/cart.component';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'pc-product-list-page',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, CartComponent, MatDividerModule],
  template: `
    <section class="page">
      <div class="header">
        <h2>Products</h2>
        <div class="count">{{ count() }} items</div>
      </div>
      <div class="layout">
        <div class="grid">
          @for (p of products(); track p.id) {
            <pc-product-card [product]="p" (view)="open($event)" />
          }
        </div>
        <pc-cart />
      </div>
    </section>
  `,
  styles: [
    `
    .page { padding: 1.25rem; }
    .header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1rem; }
    .header h2 { font-size: 1.5rem; margin: 0; }
    .count { color: #6b7280; font-size: .95rem; }
    .layout { display: grid; grid-template-columns: 1fr 320px; gap: 1.25rem; align-items: start; }
    .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.25rem; }

    @media (max-width: 640px) {
      .layout { display: flex; flex-direction: column; }
      .grid { grid-template-columns: repeat(auto-fill, minmax(220px, 0.8fr)); }
    }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListPage {
  private readonly service = inject(ProductService);
  private readonly router = inject(Router);

  readonly products: Signal<Product[]> = this.service.getProductsSignal();
  readonly count = computed(() => this.service.productCount());

  open(id: string) {
    this.router.navigate(['product', id]);
  }
}



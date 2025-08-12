import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../models/product';

@Component({
  selector: 'pc-product-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <mat-card class="card" [attr.data-id]="product?.id">
      <img mat-card-image class="thumb" [src]="product?.imageUrl" [alt]="product?.name" />
      <mat-card-content class="meta">
        <h3 class="name">{{ product?.name }}</h3>
        <p class="price">{{ product?.price }}</p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-stroked-button color="primary" class="view" (click)="view.emit(product!.id)">View</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    `
    .card { display: flex; flex-direction: column; gap: .5rem; background: #fff; border: 1px solid #eee; border-radius: 1rem; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,.04); transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease; }
    .card:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(0,0,0,.08); border-color: #e5e7eb; }
    .thumb { width: 100%; height: 200px; object-fit: cover; }
    .meta { padding: .9rem .9rem 0; display: grid; gap: .25rem; }
    .name { margin: 0; font-size: 1.05rem; font-weight: 650; line-height: 1.3; color: #0f172a; }
    .price { color: #0a7; font-weight: 700; letter-spacing: .2px; }
    .view { margin: .9rem; padding: .55rem .9rem; border-radius: .6rem; border: 1px solid #e5e7eb; background: #f8fafc; cursor: pointer; transition: background .15s ease, border-color .15s ease; }
    .view:hover { background: #eef2f7; border-color: #d0d5dd; }
    .view:focus { outline: 2px solid #a7f3d0; outline-offset: 2px; }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() view = new EventEmitter<string>();
}



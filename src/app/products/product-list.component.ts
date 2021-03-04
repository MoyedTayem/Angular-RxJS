import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { Subscription, Observable, empty, EMPTY, Subject, combineLatest } from 'rxjs';

import { Product } from './product';
import { ProductService } from './product.service';
import { catchError,map, startWith } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnDestroy {
  
  pageTitle = 'Product List';
  private errorMessageSubject=new Subject<string>();
  errorMessage$=this.errorMessageSubject.asObservable();
  private categorySelectedSubject=new Subject<number>();
  categorySelectedAction$=this.categorySelectedSubject.asObservable();

  products$=combineLatest([
    this.productService.productsWithAdd$,
    this.categorySelectedAction$.pipe(
      startWith(0))
  ])
    .pipe(
    map(([products,selectedCategoryId])=>
      products.filter(product=>
        selectedCategoryId?product.categoryId===selectedCategoryId:true)
    ),
    catchError(err=>{
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );
    
  categories$=this.prodcutCategoryService.productCategory$.pipe(
    catchError(err=>{
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  )
   


  constructor(private productService: ProductService,
    private prodcutCategoryService:ProductCategoryService) { }

  

  ngOnDestroy(): void {
   
  }

  onAdd(): void {
  this.productService.addProduct();
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
    
  }
}

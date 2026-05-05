import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ownerRoutes } from './owner.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ownerRoutes)
  ]
})
export class OwnerModule { }

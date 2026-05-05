import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { tenantRoutes } from './tenant.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(tenantRoutes)
  ]
})
export class TenantModule { }

import { Routes } from '@angular/router';

export const tenantRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/tenant-layout.component').then(m => m.TenantLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'properties',
        pathMatch: 'full'
      },
      {
        path: 'properties',
        loadComponent: () => import('./pages/property-list/property-list.component').then(m => m.TenantPropertyListComponent)
      },
      {
        path: 'properties/:id',
        loadComponent: () => import('./pages/property-details/property-details.component').then(m => m.TenantPropertyDetailsComponent)
      },
      {
        path: 'properties/:id/book',
        loadComponent: () => import('./pages/booking-request/booking-request.component').then(m => m.BookingRequestComponent)
      },
      {
        path: 'my-bookings',
        loadComponent: () => import('../../components/tenant/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent)
      }
    ]
  }
];

import { Routes } from '@angular/router';

export const ownerRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/owner-layout.component').then(m => m.OwnerLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('../../components/owner/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'properties',
        loadComponent: () => import('../../components/owner/my-properties/my-properties.component').then(m => m.MyPropertiesComponent)
      },
      {
        path: 'properties/add',
        loadComponent: () => import('../../components/owner/add-property/add-property.component').then(m => m.AddPropertyComponent)
      },
      {
        path: 'properties/:id',
        loadComponent: () => import('../../components/properties/property-details/property-details.component').then(m => m.PropertyDetailsComponent)
      },
      {
        path: 'properties/edit/:id',
        loadComponent: () => import('../../components/owner/edit-property/edit-property.component').then(m => m.EditPropertyComponent)
      },
      {
        path: 'booking-requests',
        loadComponent: () => import('../../components/owner/booking-requests/booking-requests.component').then(m => m.BookingRequestsComponent)
      }
    ]
  }
];

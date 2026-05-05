import { Routes } from '@angular/router';
import { authGuard, ownerGuard, tenantGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'not-authorized',
    loadComponent: () => import('./components/shared/not-authorized/not-authorized.component').then(m => m.NotAuthorizedComponent)
  },
  {
    path: 'tenant',
    canActivate: [authGuard, tenantGuard],
    loadChildren: () => import('./modules/tenant/tenant.module').then(m => m.TenantModule)
  },
  {
    path: 'owner',
    canActivate: [authGuard, ownerGuard],
    loadChildren: () => import('./modules/owner/owner.module').then(m => m.OwnerModule)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

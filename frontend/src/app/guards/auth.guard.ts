import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Verifies user is logged in before accessing protected routes
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn) {
    return true;
  }

  // Redirect to login and preserve intended destination
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

// Ensures only property owners can access owner-specific pages
export const ownerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  if (authService.isOwner) {
    return true;
  }

  router.navigate(['/not-authorized']);
  return false;
};

// Ensures only tenants can access tenant-specific pages
export const tenantGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  if (authService.isTenant) {
    return true;
  }

  router.navigate(['/not-authorized']);
  return false;
};

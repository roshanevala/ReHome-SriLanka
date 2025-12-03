import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = authService.getCurrentUser();
  
  if (!user) {
    router.navigate(['/']);
    return false;
  }
  
  const isAdmin = await authService.isAdmin();
  
  if (isAdmin) {
    return true;
  }
  
  // Redirect to home if not admin
  router.navigate(['/']);
  return false;
};

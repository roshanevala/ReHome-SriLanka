import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = authService.getCurrentUser();
  
  if (user) {
    return true;
  }
  
  // Redirect to home if not authenticated
  router.navigate(['/'], { queryParams: { returnUrl: state.url } });
  return false;
};

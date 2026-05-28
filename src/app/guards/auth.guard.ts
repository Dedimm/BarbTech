import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const profissionalGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isBarbeiro()) {
    return true;
  }

  authService.logout();
  router.navigate(['/login-profissional']);
  return false;
};

export const clienteGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && !authService.isBarbeiro()) {
    return true;
  }

  authService.logout();
  router.navigate(['/login-usuario']);
  return false;
};

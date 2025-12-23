import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Authservice } from '../../auth/authservice';

export const authguardGuard: CanActivateFn = (route, state) => {
  const authservice = inject(Authservice);
  const router = inject(Router);

  if(authservice.isLoggedIn()) {
    return true;
  }

  router.navigate(['/auth']);
  return false;
};

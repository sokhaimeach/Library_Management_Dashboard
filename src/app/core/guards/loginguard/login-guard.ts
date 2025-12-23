import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Authservice } from '../../auth/authservice';

export const loginGuard: CanActivateFn = (route, state) => {
  const authservice = inject(Authservice);
  const router = inject(Router);

  if(authservice.isLoggedIn()){
    // return router.createUrlTree(['/admin']);
    router.navigate(['/admin']);
    return false;
  }

  return true;
};

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Authservice } from '../../auth/authservice';

export const roleGuard: CanActivateFn = (route, state) => {
  const authservice = inject(Authservice);
  const router = inject(Router);

  const allowRoles = route.data?.['roles'] as string[];

  if(!authservice.hasRole(allowRoles)){
    router.navigate(['/admin']);
    return false;
  }


  return true;
};

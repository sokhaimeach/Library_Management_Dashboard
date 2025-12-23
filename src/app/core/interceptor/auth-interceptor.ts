import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Authservice } from '../auth/authservice';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authservice = inject(Authservice);
  const token = authservice.getToken();

  if (token !== null){
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      }
    });

    return next(authReq);
  }

  return next(req);
};

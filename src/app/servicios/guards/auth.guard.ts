import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  //verifica si el usuario ha iniciado sesión
  if (authService.isLoggedIn()) {
    const userType = authService.getType();

    //redirige según el tipo de usuario
    if (route.routeConfig?.path === '') {
      if (userType === 'medico') {
        router.navigate(['/medico']);
      } else if (userType === 'paciente') {
        router.navigate(['/paciente']);
      }
      return false;
    }

    //verifica las rutas específicas para médicos
    if (route.routeConfig?.path?.startsWith('medico')) {
      if (userType === 'medico') {
        return true; // Permite el acceso si el usuario es médico
      } else {
        router.navigate(['/paciente']);
        return false;
      }
    }

    //verifica las rutas específicas para pacientes
    if (route.routeConfig?.path?.startsWith('paciente')) {
      if (userType === 'paciente') {
        return true; // Permite el acceso si el usuario es paciente
      } else {
        router.navigate(['/medico']);
        return false;
      }
    }
  }

  //permitir el acceso a la página de inicio para usuarios no autenticados
  return true;
};

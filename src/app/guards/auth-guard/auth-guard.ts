import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth-service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  async canActivate(): Promise<boolean | UrlTree> {
    const userLogged = this.auth.isAuthenticated();

    if (!userLogged) {
      // Mostramos el Swal asíncrono
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes estar logueado para acceder a esta sección.',
        confirmButtonColor: '#d33',
        background: "#111827",
        color: "white",
        width: '400px',
        padding: '2em'
      });

      // Devolvemos la redirección
      return this.router.createUrlTree(['/login']);
    }

    return true;
  }
}

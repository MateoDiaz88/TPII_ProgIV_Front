import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth-service';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

 async canActivate(): Promise<boolean | UrlTree> {
    try {
      const res = await firstValueFrom(this.auth.validateSession());

      if (!res) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Debes estar logueado para acceder a esta sección.',
          confirmButtonColor: '#d33',
          background: "#111827",
          color: "white",
          width: '400px',
          padding: '2em'
        });
        return this.router.createUrlTree(['/login']);
      }

      return true;
    } catch (error) {
      return this.router.createUrlTree(['/login']);
    }
  }
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth-service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate{

  constructor(private router: Router, private authService: AuthService) { }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean | UrlTree>{
    try{
      const expectedRole = route.data['role'];
      const user = await this.authService.getProfile();
      const userRole = user?.perfil;
      if(!userRole || userRole !== expectedRole) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No tienes permiso para acceder a esta sección',
          confirmButtonColor: '#d33',
          background: "#0D0D0D",
          color: "white",
          width: '400px',
          padding: '2em'
        });
        
        return this.router.createUrlTree(['/home']);
      }  
        
    return true;
      
      
  } catch(error) {
    console.error("Error al verificar el rol:", error);
    return this.router.createUrlTree(['/home']);
  }
}
}

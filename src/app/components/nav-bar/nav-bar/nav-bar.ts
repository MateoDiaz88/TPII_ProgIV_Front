import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth-service/auth-service';
import { User } from '../../../services/usuarios-service/usuarios-service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ShowIfDirective } from '../../../directives/show-if-admin/show-if-admin';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, ShowIfDirective],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  private auth = inject(AuthService);
  private router = inject(Router)

  currentUser = this.auth.currentUser;
  isLogged = computed(() => !!this.currentUser());

  logOut() {
    this.auth.logOut();

    Swal.fire({
      icon: 'success',
      title: 'Logout realizado con exito',
      showConfirmButton: false,
      timer: 1500,
      background: "#111827",
      color: "white",
      width: '400px',
      padding: '2em',
      grow: 'row'
    });

    this.router.navigate(['/login']);
  }
}

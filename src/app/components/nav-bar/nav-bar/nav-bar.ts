import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth-service/auth-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  private auth = inject(AuthService);

  // La señal del usuario
  currentUser = this.auth.currentUser;

  // Señal derivada: true si hay usuario, false si no
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
    })
  }
}

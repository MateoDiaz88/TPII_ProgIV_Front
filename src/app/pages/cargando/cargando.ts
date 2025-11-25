import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth-service';
import { Router } from '@angular/router';
import { VideoFondo } from '../../components/video-fondo/video-fondo';

@Component({
  selector: 'app-cargando',
  imports: [VideoFondo],
  templateUrl: './cargando.html',
  styleUrl: './cargando.css',
})
export class Cargando implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {

    setTimeout(() => {
      this.auth.validateSession().subscribe(isValid => {
        if (isValid) {
          this.auth.startSessionTimer();
          this.router.navigate(['publicaciones']);
        } else {
          this.auth.stopSessionTimer();
          this.router.navigate(['login']);
        }
      });
    }, 3000);
  
}

}

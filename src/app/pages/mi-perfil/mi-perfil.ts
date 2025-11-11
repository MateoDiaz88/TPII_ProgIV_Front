import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { VideoFondo } from '../../components/video-fondo/video-fondo';
import { AuthService } from '../../services/auth-service/auth-service';
import { PublicacionService } from '../../services/publicacion-service/publicacion-service';
import Swal from 'sweetalert2';
import { Publicacion } from '../../components/publicacion/publicacion';
import { DatePipe } from '@angular/common';
import { animate } from 'motion';

@Component({
  selector: 'app-mi-perfil',
  imports: [VideoFondo, Publicacion, DatePipe],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfil implements OnInit, AfterViewInit{
  private auth = inject(AuthService);
  private publicacionesService = inject(PublicacionService);
  currentUser = this.auth.currentUser;
  publicaciones = this.publicacionesService.publicaciones;
  ngOnInit() {
    this.cargarPublicacionesUsuario();
  }

  ngAfterViewInit() {
    animate(".animation", { opacity: [0, 1], transform: ["translateY(40px)", "translateY(0)"] }, { duration: 0.5, ease: "easeOut" });
  }

   cargarPublicacionesUsuario(){
    try{
      this.publicacionesService.cargarPublicaciones("fecha", 0, 3, this.currentUser()._id); 
    } catch(error){
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar las publicaciones del usuario',
        confirmButtonColor: '#d33',
        background: "#111827",
        color: "white",
        width: '400px',
        padding: '2em'
      })
    }

  }


}

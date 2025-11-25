import { Component, inject, OnInit } from '@angular/core';
import { PublicacionService } from '../../services/publicacion-service/publicacion-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { VideoFondo } from '../../components/video-fondo/video-fondo';
import { TimeAgoPipe } from '../../pipes/timeAgoPipe.pipe';
import { Comentarios } from '../../components/comentarios/comentarios';
import { AuthService } from '../../services/auth-service/auth-service';
import { CommonModule } from '@angular/common';
import { ComentariosService } from '../../services/comentarios-service/comentarios-service';

@Component({
  selector: 'app-publicacion',
  imports: [VideoFondo, TimeAgoPipe, Comentarios, CommonModule, RouterLink],
  templateUrl: './publicacion.html',
  styleUrl: './publicacion.css',
})
export class Publicacion implements OnInit {
  private publicacionService = inject(PublicacionService);
  private comentariosService = inject(ComentariosService);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private router = inject(Router);
  publicacion = this.publicacionService.publicacion
  currentUser = this.auth.currentUser

  ngOnInit() {
    
    const publicacionId = this.route.snapshot.paramMap.get('id');
    if (!publicacionId) {
      this.router.navigate(['/publicaciones']);
    }

    this.comentariosService.resetComentarios();
    this.comentariosService.getComentarios(publicacionId!)
    
    this.publicacionService.buscarPublicacion(publicacionId!).subscribe({
      error: error => {
        console.error(error),
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar la publicacion',
            confirmButtonColor: '#d33',
            background: "#0D0D0D",
            color: "white",
            width: '400px',
            padding: '2em'
          })
      }
    });
  }


  validarUserPublicacion(): boolean {
    const user = this.currentUser();
    const pub = this.publicacion();
    if (!user || !pub?.user?._id) return false;
    return user._id === pub.user._id || user.perfil === 'administrador';
  }



  eliminarPublicacion() {
    const user = this.currentUser();
    const pub = this.publicacion();
    if (!user || !pub) return;

    if (!this.validarUserPublicacion()) return;

    Swal.fire({
      icon: 'warning',
      title: '¿Eliminar publicación?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: "#0D0D0D",
      color: "white",
      width: '400px',
      padding: '2em',
    }).then((result) => {
      if (result.isConfirmed) {
        this.publicacionService.deletePublicacion(pub._id, user._id).subscribe({
          next: () => this.router.navigate(['/publicaciones']),
          error: (err) => {
            console.error(err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al eliminar la publicación',
              confirmButtonColor: '#d33',
              background: "#111827",
              color: "white",
              width: '400px',
              padding: '2em'
            });
          }
        });
      }
    });

  }

  hasLiked() {
    if (!this.currentUser) {
      return false;
    }

    return this.publicacion()?.likes.includes(this.currentUser()._id);
  }

  toggleLike() {
    const user = this.currentUser();
    const pub = this.publicacion();
    if (!user || !pub) return;

    this.publicacionService.toggleLike(pub._id, user._id).subscribe({
      next: (updated) => {
        this.publicacion.set(updated);
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al dar like',
          confirmButtonColor: '#d33',
          background: "#111827",
          color: "white",
          width: '400px',
          padding: '2em'
        });
      }
    });
  }

}

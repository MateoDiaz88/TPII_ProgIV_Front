import { Component, inject, Input, signal } from '@angular/core';
import { TimeAgoPipe } from '../../pipes/timeAgoPipe.pipe';
import { AuthService } from '../../services/auth-service/auth-service';
import { Comentario, Publicacion as PublicacionModel, PublicacionService } from '../../services/publicacion-service/publicacion-service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-publicacion',
  imports: [TimeAgoPipe, CommonModule],
  templateUrl: './publicacion.html',
  styleUrl: './publicacion.css',
})
export class Publicacion {
  private auth = inject(AuthService);
  private publicacionService = inject(PublicacionService);
  @Input() publicacion!:PublicacionModel;
  currentUser= this.auth.currentUser();
  commentsVisible = signal(false);


  hasLiked(publicacion: PublicacionModel){
    if(!this.currentUser){
      return false;
    }
    return publicacion.likes.includes
  }

  toggleLike(publicacion:PublicacionModel){
    if (!this.currentUser){
      return;
    }
    if(this.hasLiked(publicacion)){
      this.publicacionService.addLike(publicacion._id, this.currentUser?._id).subscribe({
        next: updated => {
          publicacion.likes = updated.likes;
        },
        error: error => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al dar like',
            confirmButtonColor: '#d33',
            background: "#111827",
            color: "white",
            width: '400px',
            padding: '2em'
          })
        }
      })
    } else{
      this.publicacionService.removeLike(publicacion._id, this.currentUser?._id).subscribe({
        next: updated => {
          publicacion.likes = updated.likes;
        },
        error: error => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al quitar like',
            confirmButtonColor: '#d33',
            background: "#111827",
            color: "white",
            width: '400px',
            padding: '2em'
          })
        }
      })
    }
  }


  enviarComentario(comentario: Comentario){
    if(!this.currentUser){
      return ;
    }

    const fechaComentario = new Date().toLocaleString('es-ES', {timeZone: 'America/Argentina/Buenos_Aires'});

    this.publicacionService.addComentario(this.publicacion._id, comentario, this.currentUser?._id, fechaComentario).subscribe({
      next: updated => {
        this.publicacion.comentarios = updated.comentarios;
      },
      error: error => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al enviar el comentario',
          confirmButtonColor: '#d33',
          background: "#111827",
          color: "white",
          width: '400px',
          padding: '2em'
        })
      }
    })
  }

  toggleComments(){
    this.commentsVisible.set(!this.commentsVisible());
  }

}

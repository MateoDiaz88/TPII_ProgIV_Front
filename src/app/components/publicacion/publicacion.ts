import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { TimeAgoPipe } from '../../pipes/timeAgoPipe.pipe';
import { AuthService } from '../../services/auth-service/auth-service';
import { Comentario, Publicacion as PublicacionModel, PublicacionService } from '../../services/publicacion-service/publicacion-service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Comentarios } from '../comentarios/comentarios';
@Component({
  selector: 'app-publicacion',
  imports: [TimeAgoPipe, CommonModule, Comentarios],
  templateUrl: './publicacion.html',
  styleUrl: './publicacion.css',
})
export class Publicacion implements OnInit{
  private auth = inject(AuthService);
  private publicacionService = inject(PublicacionService);
  @Input() publicacion!: PublicacionModel;
  currentUser = this.auth.currentUser();
  commentsVisible = signal(false);
  likes = signal<string[]>([]);
  comentarios = signal<Comentario[]>([]);

  ngOnInit() {
      this.likes.set(this.publicacion.likes);
      this.comentarios.set(this.publicacion.comentarios);
  }

  hasLiked() {
    if (!this.currentUser) {
      return false;
    }

    return this.likes().includes(this.currentUser._id);
  }

  onComentarioAgregado(comentario: Comentario) {
    this.comentarios.update(prev => [...prev, comentario]);
  }

  
  toggleLike() {
    if (!this.currentUser) {
      return;
    }

    this.publicacionService.toggleLike(this.publicacion._id, this.currentUser._id).subscribe({
      next:(updated) =>{
        this.likes.set(updated.likes)
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

  }


  

  toggleComments() {
    this.commentsVisible.set(!this.commentsVisible());
  }

  validarUserPublicacion() {
    const user = this.currentUser;
    const ownerId = this.publicacion?.user?._id;

    if (!user || !ownerId) return false;

    return user._id === ownerId || user.perfil === "administrador";
  }

  eliminarPublicacion() {
    if (this.validarUserPublicacion()) {
      this.publicacionService.deletePublicacion(this.publicacion._id, this.currentUser._id).subscribe({
        
        error: error => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al eliminar la publicacion',
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
}

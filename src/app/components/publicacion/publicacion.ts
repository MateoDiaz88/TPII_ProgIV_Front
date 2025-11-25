import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { TimeAgoPipe } from '../../pipes/timeAgoPipe.pipe';
import { AuthService } from '../../services/auth-service/auth-service';
import {Publicacion as PublicacionModel, PublicacionService } from '../../services/publicacion-service/publicacion-service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Comentarios } from '../comentarios/comentarios';
import { RouterLink } from '@angular/router';
import { TruncatePipe } from '../../pipes/truncate.pipe';
@Component({
  selector: 'app-publicacion',
  imports: [TimeAgoPipe, CommonModule, RouterLink, TruncatePipe],
  templateUrl: './publicacion.html',
  styleUrl: './publicacion.css',
})
export class Publicacion implements OnInit {
  private auth = inject(AuthService);
  private publicacionService = inject(PublicacionService);
  @Input() publicacion!: PublicacionModel;
  currentUser = this.auth.currentUser();
  likes = signal<string[]>([]);
  ngOnInit() {
    this.likes.set(this.publicacion.likes);
  }

  hasLiked() {
    if (!this.currentUser) {
      return false;
    }

    return this.likes().includes(this.currentUser._id);
  }


  toggleLike(event: Event) {
    event.stopPropagation(); // Detiene la propagación, NO navega a la publicación

    if (!this.currentUser) {
      return;
    }

    this.publicacionService.toggleLike(this.publicacion._id, this.currentUser._id).subscribe({
      next: (updated) => {
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





  validarUserPublicacion() {
    const user = this.currentUser;
    const ownerId = this.publicacion?.user?._id;

    if (!user || !ownerId) return false;

    return user._id === ownerId || user.perfil === "administrador";
  }

  eliminarPublicacion() {

    if (this.validarUserPublicacion()) {
      Swal.fire({
        icon: 'warning',
        title: 'Estas seguro de eliminar la publicacion?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'Cancelar',
        background: "#0D0D0D",
        color: "white",
        width: '400px',
        padding: '2em',
      }).then((result) => {
        if (result.isConfirmed) {
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
      })
    }

  }
}

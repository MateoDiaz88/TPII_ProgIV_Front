import { Component, inject, Input, Output, EventEmitter, signal, OnInit, effect, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TimeAgoPipe } from '../../pipes/timeAgoPipe.pipe';
import { User } from '../../services/usuarios-service/usuarios-service';
import { single } from 'rxjs';
import { Comentario, ComentarioDTO, ComentariosService } from '../../services/comentarios-service/comentarios-service';
import { ActivatedRoute } from '@angular/router';
import { HighlightAutor } from '../../directives/highlight-autor/highlight-autor';
import { PublicacionService } from '../../services/publicacion-service/publicacion-service';

@Component({
  selector: 'app-comentarios',
  imports: [FormsModule, TimeAgoPipe, ReactiveFormsModule, HighlightAutor],
  templateUrl: './comentarios.html',
  styleUrl: './comentarios.css',
})
export class Comentarios{

  @Input() publicacionId: string = '';
  @Input() currentUser!: User;
  private comentariosService = inject(ComentariosService);
  private publicacionesService = inject(PublicacionService);
  publicacion = this.publicacionesService.publicacion;
  private fb = inject(FormBuilder);
  comentarios = this.comentariosService.comentarios;
  hayMas = this.comentariosService.hayMas;
  comentarioEnEdicion = signal<string | null>(null);
  contenidoEditado = signal('');
  cargando = signal(false);
  

  commentsForm = this.fb.group({
    contenido: ['', [Validators.required, Validators.maxLength(300)]]
  });

  agregarComentario() {
    const contenido = this.commentsForm.get('contenido')?.getRawValue();
    if (contenido.trim() !== '') {
      this.comentariosService.addComentario(this.publicacionId, contenido).subscribe({
        next: (nuevoComentario) => {
          this.comentarios().unshift(nuevoComentario);
          this.commentsForm.reset();
        },
        error: error => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al enviar el comentario',
            confirmButtonColor: '#d33',
            background: "#0D0D0D",
            color: "white",
            width: '400px',
            padding: '2em'
          })
        }
      });
    }
  }




  actualizarComentario(comentario: Comentario) {
    if (this.contenidoEditado().trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Error',
        text: 'El comentario no puede estar vacio',
        confirmButtonColor: '#d33',
        background: "#0D0D0D",
        color: "white",
        width: '400px',
        padding: '2em'
      });
      return;
    }

    if (this.contenidoEditado().length > 300) {
      Swal.fire({
        icon: 'warning',
        title: 'Error',
        text: 'El comentario no puede tener mas de 300 caracteres',
        confirmButtonColor: '#d33',
        background: "#0D0D0D",
        color: "white",
        width: '400px',
        padding: '2em'
      });
      return;
    }

    if (!comentario._id) return;

    this.comentariosService.updateComentario(comentario._id, this.contenidoEditado()).subscribe({
      next: () => {
        comentario.contenido = this.contenidoEditado();
        comentario.editado = true;
        this.comentarioEnEdicion.set(null);
        this.contenidoEditado.set("");
      },
      error: error => {
        console.error(error);
        this.comentarioEnEdicion.set(null);
        this.contenidoEditado.set("");
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al actualizar el comentario',
          confirmButtonColor: '#d33',
          background: "#0D0D0D",
          color: "white",
          width: '400px',
          padding: '2em'
        })
      }
    });
  }

  cargarMas() {
    this.comentariosService.getComentarios(this.publicacionId);
  }

  activarEdicion(comentario: Comentario) {
    if (!comentario._id) return;
    this.contenidoEditado.set(comentario.contenido);
    this.comentarioEnEdicion.set(comentario?._id)
  }

  cancelarEdicion() {
    this.comentarioEnEdicion.set(null);
    this.contenidoEditado.set('');
  }

  
}

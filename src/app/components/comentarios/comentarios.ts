import { Component, inject, Input, Output, EventEmitter} from '@angular/core';
import { Comentario, ComentarioDTO, PublicacionService } from '../../services/publicacion-service/publicacion-service';

import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { TimeAgoPipe } from '../../pipes/timeAgoPipe.pipe';
import { User } from '../../services/auth-service/auth-service';

@Component({
  selector: 'app-comentarios',
  imports: [FormsModule, TimeAgoPipe],
  templateUrl: './comentarios.html',
  styleUrl: './comentarios.css',
})
export class Comentarios {
  @Input() comentarios!: Comentario[];
  @Input() publicacionId: string = '';
  @Input() currentUser!: User;
  @Output() onComentarioAgregado = new EventEmitter<Comentario>();
  private publicacionService = inject(PublicacionService);
  nuevoMensaje = "";
  
  agregarComentario(){
    if(this.nuevoMensaje.trim() !== '') {
      const nuevoComentario: ComentarioDTO = {
        autor: this.currentUser._id,
        contenido: this.nuevoMensaje,
        fechaPublicacion: new Date().toISOString()
      }
      this.publicacionService.addComentario(this.publicacionId, nuevoComentario).subscribe({
        next: (comentario) => {
          this.onComentarioAgregado.emit(comentario);
          this.nuevoMensaje = '';
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



}

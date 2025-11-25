import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../enviroments/enviroment';
import { off } from 'process';
export interface ComentarioDTO {
  contenido: string;
  fechaPublicacion: string;
  autor: string;
}

export interface Comentario {
  _id?: string;
  contenido: string;
  fechaPublicacion: string;
  autor: {
    _id: string;
    name: string;
    surname: string;
    username: string;
    imagenPerfil: string;
  };
  editado: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  comentarios = signal<Comentario[]>([]);
  hayMas = signal(false);
  offset = signal(0);
  limit = 5;



  getComentarios(publicacionId: string) {
    let params = new HttpParams();

    params = params.set("offset", this.offset());
    params = params.set("limit", this.limit);
    this.http.get<{ total: number, comentarios: Comentario[], paginaActual: number, totalPaginas: number }>(`${this.apiUrl}/comentarios/publicacion/${publicacionId}`, { params })
      .subscribe({
        next: (res) => {
          if (this.offset() === 0) {
            this.comentarios.set(res.comentarios);
          } else {
            this.comentarios.update(current => [...current, ...res.comentarios]);
          }

          const hayMas = this.offset() + res.comentarios.length < res.total;
          this.hayMas.set(hayMas);
          this.offset.update(v => v + this.limit);

        },
        error: error => {
          console.error(error);
        }
      });
  }

  addComentario(publicacionId: string, contenido: string) {
    return this.http.post<Comentario>(`${this.apiUrl}/comentarios/${publicacionId}`, { contenido }, { withCredentials: true });
  }

  updateComentario(comentarioId: string, nuevoContenido: string) {
    return this.http.patch<Comentario>(`${this.apiUrl}/comentarios/${comentarioId}`, { contenido: nuevoContenido });
  }

  resetComentarios() {
    this.comentarios.set([]);
    this.offset.set(0);
  }
}

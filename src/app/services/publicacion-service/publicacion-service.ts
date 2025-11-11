import { Injectable, signal } from '@angular/core';
import { User } from '../auth-service/auth-service';
import { HttpClient, HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Observable, single, tap } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { off } from 'node:process';

export interface Publicacion {
  _id: string,
  user: User,
  contenido: string,
  imagenPublicacion?: string,
  fechaPublicacion: string,
  likes: string[],
  comentarios: Comentario[]
}

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
}

export interface PublicacionData {
  contenido?: string,
  imagen?: File,
  fechaPublicacion?: string,
  userId: string
}

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  apiUrl = environment.apiUrlPosts;
  publicaciones = signal<Publicacion[]>([]);
  cargando = signal<boolean>(false);
  hayMas = signal<boolean>(false);
  constructor(private http: HttpClient) { }
  cargarPublicaciones(orden: string = "fecha", offset: number = 0, limit: number = 5, userId?: string | null) {




    this.cargando.set(true);
    let params = new HttpParams()
      .set("orden", orden)
      .set("offset", offset)
      .set("limit", limit)

    if (userId) {
      params = params.set("userId", userId);
    }

    this.http.get<{ total: number, publicaciones: Publicacion[], paginaActual: number, totalPaginas: number }>(this.apiUrl, { params }).subscribe({
      next: (res) => {
        const { publicaciones, total } = res;

        /*
        if (offset === 0) { // primera carga
          this.publicaciones.set(res.publicaciones);
        } else {
          this.publicaciones.update(current => [...current, ...res.publicaciones]);
        }
        
        */



        this.publicaciones.set(publicaciones);


        const hayMas = offset + publicaciones.length < total;
        this.hayMas.set(hayMas);
        this.cargando.set(false);
      },
      error: error => {
        this.cargando.set(false);
        this.hayMas.set(false);
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar las publicaciones',
          confirmButtonColor: '#d33',
          background: "#111827",
          color: "white",
          width: '400px',
          padding: '2em'
        })
      }
    })
  }

  reiniciarPublicaciones() {
    this.publicaciones.set([]);
    this.hayMas.set(false);
  }

  crearPublicacion(publicacion: FormData, offset: number) {
    this.http.post<Publicacion>(`${this.apiUrl}/create`, publicacion).subscribe({
      next: (publicacion) => {
        // Si está en la primera página, la agregamos
        if (offset === 0) {
          this.publicaciones.update(current => [publicacion, ...current]);
          Swal.fire({
            icon: 'success',
            title: 'Publicacion creada',
            text: 'La publicacion se ha creado correctamente',
            confirmButtonColor: '#d33',
            background: "#0D0D0D",
            color: "white",
            width: '400px',
            padding: '2em'
          })
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Publicación creada',
            text: 'Tu publicación se creó correctamente. Podrás verla en la primera página.',
            confirmButtonColor: '#d33',
            background: "#0D0D0D",
            color: "white",
            width: '400px',
            padding: '2em'
          });
        }
      },
      error: error => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al crear la publicacion',
          confirmButtonColor: '#d33',
          background: "#0D0D0D",
          color: "white",
          width: '400px',
          padding: '2em'
        })

      }
    })
  }



  // publicacion-service.ts - MODIFICAR
  toggleLike(publicacionId: string, userId: string): Observable<Publicacion> {
    return this.http.post<Publicacion>(`${this.apiUrl}/${publicacionId}/like`, { userId });
  }

  addComentario(publicacionId: string, comentario: ComentarioDTO): Observable<Comentario> {
    return this.http.post<Comentario>(`${this.apiUrl}/${publicacionId}/comentario`, comentario);
  }

  deletePublicacion(publicacionId: string, userId: string) {
    return this.http.delete<void>(`${this.apiUrl}/${publicacionId}`, { params: { userId } }).pipe(
      tap(() => {
        this.publicaciones.update(prev => prev.filter(pub => pub._id !== publicacionId));
      })
    );
  }

}

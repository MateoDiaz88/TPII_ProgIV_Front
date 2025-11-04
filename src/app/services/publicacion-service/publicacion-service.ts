import { Injectable, signal } from '@angular/core';
import { User } from '../auth-service/auth-service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

export interface Publicacion{
  _id:string,
  user: User,
  titulo:string,
  contenido:string,
  imagen?:string,
  fechaPublicacion:string,
  likes: string[],
  comentarios: Comentario[]
}

export interface Comentario{
  _id:string,
  user_id:string,
  contenido:string,
  fechaPublicacion:string
}

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  apiUrl = 'http://localhost:3000/publicaciones'
  publicaciones = signal<Publicacion[]>([]);
    
  constructor(private http: HttpClient) { }
  cargarPublicaciones(){
    this.http.get<Publicacion[]>(this.apiUrl).subscribe({
      next: publicaciones => {
        this.publicaciones.set(publicaciones);
      },
      error: error => {
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

  addLike(publicacionId: string, userId:string): Observable<Publicacion>{
     return this.http.post<Publicacion>(`${this.apiUrl}/${publicacionId}/like`, { userId });
  }

  removeLike(publicacionId: string, userId:string): Observable<Publicacion>{
    return this.http.post<Publicacion>(`${this.apiUrl}/${publicacionId}/unlike`, { userId });
  }

  addComentario(publicacionId: string, comentario: Comentario, userId: string, fechaComentario: string): Observable<Publicacion>{
    return this.http.post<Publicacion>(`${this.apiUrl}/${publicacionId}/comentario`,{comentario, userId, fechaComentario});
  }

}

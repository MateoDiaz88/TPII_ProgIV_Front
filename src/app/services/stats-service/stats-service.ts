import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../enviroments/enviroment';

export interface PublicacionesStats {
  userId: string;
  count: number
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getPublicacionesPorUsuario(start: string, end: string) {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<{ userId: string, totalPublicaciones: number }[]>(`${this.apiUrl}/estadisticas/publicaciones`, { params, withCredentials: true });
  }

  getComentariosPorUsuario(start: string, end: string) {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<{ userId: string, totalComentarios: number }[]>(`${this.apiUrl}/estadisticas/comentarios`, {params, withCredentials: true });
  }

  getComentariosPorPublicacion(start: string, end: string) {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<{ titulo: string, totalComentarios: number }[]>(`${this.apiUrl}/estadisticas/comentarios-publicacion`, { params, withCredentials: true });
  }
}

import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { error } from 'console';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

export interface User {
  _id: string,
  name: string,
  surname: string,
  email: string;
  username: string;
  password: string;
  fechaNacimiento: string;
  descripcion: string;
  imagenPerfil: string;
  public_id: string;
  perfil: "usuario" | "administrador";
  habilitado: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  usuarios = signal<User[]>([]);


  


  getUsers() {
    this.http.get<User[]>(`${this.apiUrl}/usuarios`).subscribe({
      next: res => {
        this.usuarios.set(res);
      },
      error: error => {
        console.error(error);
      }
    });
  }

  toggleUser(id: string){
    this.http.patch<User>(`${this.apiUrl}/usuarios/${id}`, {}).subscribe({
      next: res => {
        this.usuarios.update(current => current.map(user => user._id === id ? res : user));
      },
      error: error => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cambiar el estado del usuario',
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

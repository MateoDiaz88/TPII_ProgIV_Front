import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, tap } from 'rxjs';
import Swal from 'sweetalert2';

export interface RegisterData {
  name: string,
  surname: string,
  email: string,
  username: string,
  password: string,
  fechaNacimiento: string,
  descripcion: string,
  imagenPerfil: string,
  public_id: string
}

export interface User {
  _id: String,
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
  createdAt: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrlLogin = 'http://localhost:3000/autenticacion';
  apiUrlRegister = "http://localhost:3000/usuarios";

  currentUser = signal<User | null>(null);
  constructor(private http: HttpClient) { }


  async register(userData: RegisterData): Promise<User> {
    try {
      const response = await firstValueFrom(this.http.post<User>(`${this.apiUrlRegister}/register`, userData));
      return response;
    } catch (error) {
      console.error(error);
      throw new Error("Error al registrar al usuario");
    }
  }

  async login(email: string, password: string) {
    try {
      const result = await firstValueFrom(
        this.http.post<{ user: User }>(`${this.apiUrlLogin}/login`, { email, password }, { withCredentials: true })
      );


      if (result) {
        this.currentUser.set(result.user); // Actualiza la signal
        Swal.fire({
          icon: 'success',
          title: `¡Bienvenido ${result.user.name}!`,
          text: 'Has iniciado sesión correctamente',
          confirmButtonColor: '#d33',
          background: "#111827",
          color: "white",
        })

      }

    } catch (error) {
      this.currentUser.set(null);
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Credenciales inválidas',
        confirmButtonColor: '#d33',
        background: "#111827",
        color: "white"
      })
      throw error;
    }
  }

  async logOut() {
    try {
      this.currentUser.set(null);
      const response = await firstValueFrom(this.http.post(`${this.apiUrlLogin}/logout`, {}, { withCredentials: true }));
      return response;
    } catch (error) {
      console.error(error);
      throw new Error("Error al registrar al usuario");
    }
  }

  // Check perfil (por ejemplo al cargar la app)
  async loadProfile() {
    try {
      const user = await firstValueFrom(
        this.http.get<User>(`${this.apiUrlLogin}/profile`, { withCredentials: true })
      );
      this.currentUser.set(user);
    } catch (error: any) {
      
      if (error.statusCode !== 401) {
        console.error('Error al cargar perfil:', error);
      }
      this.currentUser.set(null);
    }
  }

  isAuthenticated(): boolean {
    if (this.currentUser()) {
      return true;
    } else {
      return false;
    }
  }

}

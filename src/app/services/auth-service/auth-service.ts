import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, firstValueFrom, map, Observable, of, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { error } from 'node:console';
import { environment } from '../../../enviroments/enviroment';
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
  createdAt: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrlLogin = environment.apiUrlLogin;
  apiUrlRegister = environment.apiUrlRegister;

  currentUser = signal<any | null>(null);

  constructor(private http: HttpClient) {

    this.validateSession().subscribe();
  }


  async register(userData: RegisterData): Promise<User> {
    try {
      const response = await firstValueFrom(this.http.post<User>(`${this.apiUrlRegister}/register`, userData));
      return response;
    } catch (error) {
      console.error(error);
      throw new Error("Error al registrar al usuario");
    }
  }

  async login(login: string, password: string) {
    try {
      const result = await firstValueFrom(
        this.http.post<{ user: User }>(`${this.apiUrlLogin}/login`, { login, password }, { withCredentials: true })
      );


      if (result) {

        this.currentUser.set(result.user); // Actualizamos el currentUserSubject
        Swal.fire({
          icon: 'success',
          title: `¡Bienvenido ${result.user.name}!`,
          text: 'Has iniciado sesión correctamente',
          confirmButtonColor: '#d33',
          background: "#111827",
          color: "white",
        })

      }

    } catch (error: any) {
      this.currentUser.set(null);
      console.error(error);
      switch (error.status) {
        case 429:
          Swal.fire({
            icon: 'warning',
            title: 'Error',
            text: 'Demasiados intentos de inicio de sesión. Por favor, intenta nuevamente en 5 minutos.',
            confirmButtonColor: '#d33',
            background: "#111827",
            color: "white",
            width: '400px',
            padding: '2em'
          })
          break;
        case 401:
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Credenciales inválidas',
            confirmButtonColor: '#d33',
            background: "#111827",
            color: "white",
            width: '400px',
            padding: '2em'
          })
          break;
        default:
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al iniciar sesión',
            confirmButtonColor: '#d33',
            background: "#111827",
            color: "white",
            width: '400px',
            padding: '2em'
          })
          break;

      }
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
  loadProfile() {
    this.http.get<User>(`${this.apiUrlLogin}/profile`, {
      withCredentials: true
    }).pipe(
      catchError(err => {
        console.error(err);
        return of(null);
      })
    )
      .subscribe(user => {
        this.currentUser.set(user);
      });
  }

  validateSession() {
      return this.http
        .get<{ message: string; user: any }>(`${this.apiUrlLogin}/validate`, {
          withCredentials: true,
        })
        .pipe(
          tap(res => this.currentUser.set(res.user ?? null)),
          // Y devolvemos true/false para que el guard lo use
          map(res => !!res.user),
          catchError(() => {
            this.currentUser.set(null);
            return of(false);
          })
        );
    
  }




}

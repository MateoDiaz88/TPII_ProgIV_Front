import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, firstValueFrom, lastValueFrom, map, Observable, of, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../enviroments/enviroment';
import { User, UsuariosService } from '../usuarios-service/usuarios-service';
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

export interface AdminCreateUserData extends RegisterData{
  perfil:"usuario" | "administrador"
}



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl;
  isLogged = signal<boolean>(false);
  currentUser = signal<any | null>(null);
  private refreshTimer: any;

  constructor(private http: HttpClient) {
  }


  async register(userData: RegisterData): Promise<User> {
    try {
      const response = await firstValueFrom(this.http.post<User>(`${this.apiUrl}/usuarios/register`,userData));
      return response;
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  async createUserByAdmin(data:AdminCreateUserData): Promise<User> {
    try{
      const response = await firstValueFrom(this.http.post<User>(`${this.apiUrl}/usuarios/create-user`, data, { withCredentials: true }));
      return response;
    } catch(error){
      console.error(error);
      throw error;
    }
}

  async login(login: string, password: string) {
    try {
      const result = await firstValueFrom(
        this.http.post<{ user: User }>(`${this.apiUrl}/autenticacion/login`, { login, password }, { withCredentials: true })
      );


      if (result) {

        this.currentUser.set(result.user); 

        this.startSessionTimer();
        Swal.fire({
          icon: 'success',
          title: `¡Bienvenido ${result.user.name}!`,
          text: 'Has iniciado sesión correctamente',
          confirmButtonColor: '#d33',
          background: "#0D0D0D",
          color: "white",
        })

      }

    } catch (error: any) {
      this.currentUser.set(null);
      console.error(error);

      throw error;
    }
  }

  async logOut() {
    try {
      this.currentUser.set(null);
      const response = await firstValueFrom(this.http.post(`${this.apiUrl}/autenticacion/logout`, {}, { withCredentials: true }));
      return response;
    } catch (error) {
      console.error(error);
      throw new Error("Error al registrar al usuario");
    }
  }

  startSessionTimer = () => {
    if (this.refreshTimer) clearInterval(this.refreshTimer);

    this.refreshTimer = setInterval(() => {
      console.log("Timer ejecutado");
      this.askExtendSession();
    }, 10 * 60 * 1000);
  }

  stopSessionTimer = () => {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
  }
  validateSession() {
    return this.http
      .get<{ message: string; user: any }>(
        `${this.apiUrl}/autenticacion/validate`,
        { withCredentials: true }
      )
      .pipe(
        tap(res => {
          const user = res.user ?? null;
          this.currentUser.set(user);
          this.isLogged.set(!!user);
        }),
        map(res => !!res.user),
        catchError(err => {
          console.warn("Sesión no válida o expirada:", err.error?.message);
          this.currentUser.set(null);
          this.isLogged.set(false);
          return of(false);
        })
      );
  }

  async initSession() {
    try {
      const valid = await lastValueFrom(this.validateSession());

      if(valid){
        this.startSessionTimer();
      }
    } catch (e) {
      console.warn("No se pudo inicializar sesión:", e);
    }
  }
  async askExtendSession() {
    const { isConfirmed } = await Swal.fire({
      icon: 'question',
      title: 'Aviso',
      text: "Quedan 5 minutos de sesión, ¿desea extenderla?",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
      background: "#111827",
      color: "white",
      width: '400px',
      padding: '2em',
    });

    if (isConfirmed) {
      this.extendSession();
    }
  }
  extendSession() {
    this.http.get(`${this.apiUrl}/autenticacion/renew`, { withCredentials: true }).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Sesion extendida',
          text: 'La sesion se ha extendido correctamente',
          confirmButtonColor: '#d33',
          background: "#0D0D0D",
          color: "white",
          width: '400px',
          padding: '2em'
        })
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al extender la sesion',
          confirmButtonColor: '#d33',
          background: "#111827",
          color: "white",
          width: '400px',
          padding: '2em'
        })
      }
    }
    );
  }

  getProfile(): Promise<any | null> {
    return lastValueFrom(
      this.validateSession().pipe(
        map(() => this.currentUser())
      )
    );
  }




}

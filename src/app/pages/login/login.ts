import { AfterViewInit, Component, inject, } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth-service/auth-service';
import { VideoFondo } from '../../components/video-fondo/video-fondo';
import { DebounceClick } from '../../directives/debounce-click/debounce-click';
import { animate } from "motion";
@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, VideoFondo, DebounceClick],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements AfterViewInit{
  ngAfterViewInit(): void {
    animate(".animation",{opacity:[0,1], transform:["translateY(40px)", "translateY(0)"]},{duration: 0.5, ease:"easeOut"});

  }

  loginForm: FormGroup;
  auth = inject(AuthService);

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      identify: ['', [this.emailOrUsernameValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }


  emailOrUsernameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) return { required: true };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{8,20}$/; // Ajusta según tus reglas de username

    if (emailRegex.test(value) || usernameRegex.test(value)) {
      return null; // válido
    }

    return { invalid: true }; 
  }

  async login() {
    try {
      const loginData = this.loginForm.getRawValue();

      await this.auth.login(loginData.identify, loginData.password);

      this.router.navigate(['/publicaciones']);
    } catch (error: any) {
      console.error(error);
      let mensaje = "Error al iniciar sesión";

      switch(error.status) {
        case 429:
          mensaje = "Has intentado iniciar sesión demasiadas veces. Por favor, espera 5 minutos antes de volver a intentarlo.";
          break;
        case 401:
          mensaje = error.error.message || "Usuario no autorizado";
          break;
        default:
          break;
      }

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensaje,
        confirmButtonColor: '#d33',
        background: "#0D0D0D",
        color: "white",
        width: '400px',
        padding: '2em'
      });
    }


  }

}

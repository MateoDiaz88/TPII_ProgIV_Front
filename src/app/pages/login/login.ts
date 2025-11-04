import { Component, inject, } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth-service/auth-service';
import { VideoFondo } from '../../components/video-fondo/video-fondo';
import { DebounceClick } from '../../directives/debounce-click/debounce-click';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, VideoFondo, DebounceClick],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

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
    } catch (error) {
      console.error(error);
    }


  }

}

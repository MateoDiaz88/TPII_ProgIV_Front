import { Component, inject, } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth-service/auth-service';
import { VideoFondo } from '../../components/video-fondo/video-fondo';
import { DebounceClick } from '../../directives/debounce-click/debounce-click';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule , ReactiveFormsModule, VideoFondo, DebounceClick],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginForm: FormGroup;
  auth = inject(AuthService);

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  async login(){
    try{
      const loginData = this.loginForm.getRawValue();

      await this.auth.login(loginData.email, loginData.password);
      
      this.router.navigate(['/publicaciones']);
    } catch(error){
      console.error(error);
    }

    
  }
 
}

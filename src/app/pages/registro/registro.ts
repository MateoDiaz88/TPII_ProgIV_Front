import { AfterViewInit, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth-service/auth-service';
import { UploadService } from '../../services/upload/upload-service';
import { VideoFondo } from '../../components/video-fondo/video-fondo';
import { DebounceClick } from '../../directives/debounce-click/debounce-click';
import { animate } from "motion";

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink, ReactiveFormsModule, VideoFondo, DebounceClick],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro implements AfterViewInit {
  loading = signal(false);
  selectedFile: File | null = null;
  selectedFileName: string = '';

  private auth = inject(AuthService)
  private fb = inject(FormBuilder);
  private upload = inject(UploadService);
  private router = inject(Router);




  ngAfterViewInit() {
    animate(".animation", { opacity: [0, 1], transform: ["translateY(40px)", "translateY(0)"] }, { duration: 0.5, ease: "easeOut" });
  }


  registerForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(4), Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
    surname: ['', [Validators.required, Validators.minLength(4), Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?!.*@)[A-Za-z\d_-]{8,20}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    repetirPassword: ['', [Validators.required]],
    fechaNacimiento: ['', [Validators.required, this.minimunAgeValidator(16)]],
    descripcion: ['', [Validators.required, Validators.maxLength(500)]],
  }, {
    validators: this.passwordMatchValidator // Estoy añadiendo un validator personalizado(en este caso para verificar que los inputs de las contraseñas coincidam)
  });

  minimunAgeValidator(minAge: number): ValidatorFn { // Retorna una funcion que angular llama automaticamente para validar el input de la fecha de nacimiento
    return (control: AbstractControl): ValidationErrors | null => {
      const fecha = new Date(control.value);
      if (!control.value) return null;

      const today = new Date(); // Esto obtiene la fecha actual
      let age = today.getFullYear() - fecha.getFullYear(); // Obtiene la diferencia de años
      const monthDiff = today.getMonth() - fecha.getMonth(); // Obtiene la diferencia de meses
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < fecha.getDate())) { // Si todavia no cumplió en el año, le resta un año
        age--;
      }

      return age >= minAge ? null : { minimumAge: { requiredAge: minAge, actualAge: age } };
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const repetirPassword = control.get('repetirPassword')?.value;

    if (password !== repetirPassword) {
      control.get('repetirPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true }; // se retorna el error
    }

    return null; // Este es el caso en que ambas coincidan
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];


      if (!file.type.match(/image\/(jpg|jpeg|png)/)) { // valido el tipo de archivo que se pone
        Swal.fire({
          icon: 'error',
          title: 'Tipo de archivo inválido',
          text: 'Solo se permiten imágenes (JPG, PNG)',
          confirmButtonColor: '#d33',
          background: "#0D0D0D",
          color: "white",
          width: '400px',
          padding: '2em'
        });
        input.value = ''; // Limpiar el input
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // Valido el tamaño de la imagen
        Swal.fire({
          icon: 'error',
          title: 'Archivo muy grande',
          text: 'La imagen debe pesar menos de 5MB',
          confirmButtonColor: '#d33',
          background: "#0D0D0D",
          color: "white",
          width: '400px',
          padding: '2em'
        });
        input.value = ''; // Limpiar el input
        return;
      }

      this.selectedFile = file; // Guarda la imagen
      this.selectedFileName = file.name;
    }
  }

  async register() {
    if (!this.selectedFile) {
      Swal.fire({
        icon: 'error',
        title: 'Imagen no seleccionada',
        text: 'Por favor selecciona una imagen.',
        confirmButtonColor: '#d33',
        background: "#0D0D0D",
        color: "white",
        width: '400px',
        padding: '2em'
      });
      return;
    }

    if (this.registerForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Campos inválidos',
        text: 'Por favor completa correctamente todos los campos.',
        confirmButtonColor: '#d33',
        background: "#0D0D0D",
        color: "white",
        width: '400px',
        padding: '2em'
      });
      return;
    }

    try {
      const response = await this.upload.uploadProfileImage(this.selectedFile);

      if (!response) {
        throw new Error("No se pudo subir la imagen");
      }

      const formData = this.registerForm.getRawValue();
      console.log(response);


      const userData = {
        ...formData,
        imagenPerfil: response.url,
        public_id: response.publicId
      }

      const {repetirPassword, ...cleanData} = userData;
      await this.auth.register(cleanData);
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'El usuario se ha registrado correctamente.',
        confirmButtonColor: '#3085d6',
        background: "#0D0D0D",
        color: "white",
        width: '400px',
        padding: '2em'
      });
      this.router.navigate(['/login']);

      
    } catch (error: any) {
      console.error("Error en registro");

      let mensaje = "Ha ocurrido un error en el registro"

      if (error.status === 409) {
        mensaje = "El nombre de usuario o mail ya existe"
      } else if (error.status === 400) {
        mensaje = "Datos inválidos. Por favor completa correctamente todos los campos."
      }

      Swal.fire({
        icon: 'error',
        title: 'Error en el registro',
        text: mensaje,
        confirmButtonColor: '#d33',
        background: "#0D0D0D",
        color: "white",
        width: '400px',
        padding: '2em'
      })
    }
  }

}


